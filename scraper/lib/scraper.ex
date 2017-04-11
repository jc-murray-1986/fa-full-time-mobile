defmodule Scraper do
  use Application

  @doc """
    Connects to the FA Full Time website and parses the HTML to extract 
    the fixtures
  """
  def fetch_fixtures do
    url = "http://full-time.thefa.com/ListPublicResult.do?selectedFixtureGroupKey=1_356306073&selectedRelatedFixtureOption=1&selectedClub=&selectedTeam=&selectedDateCode=all&selectednavpage1=All&navPageNumber1=All&previousSelectedFixtureGroupKey=1_356306073&previousSelectedClub=&seasonID=886439919&selectedSeason=886439919"

    IO.puts "Connecting to #{url}"

    case HTTPoison.get(url) do
      {:ok, response} ->
        {:ok, 
          Map.get(response, :body)
          |> Floki.find(".League-Results_Table tr") 
          |> Enum.filter(&is_valid_fixture_row(&1))
          |> Enum.map(&find_match_result(&1))
        }
      {:error, reason} -> {:error, reason}
    end
  end

  defp is_valid_fixture_row(row) do
    Floki.find(row, "th") |> Enum.count == 0 && !is_row_void_result(row)
  end

  defp is_row_void_result({_, _, cols}) do
    (fetch_text_from_col(cols, 8) |> String.replace(~r/(\s|\n|\t)/, "") |> String.length) > 3
  end

  defp fetch_text_from_col(cols, i), do: Enum.fetch!(cols, i) |> Floki.text

  @doc """
    Finds the useful details about a fixture from inside the table row
    
    Expects the table to have columns are:

    1. Expand btn 
    2. Competition code 
    3. Date/Time
    4. Home Team
    5. Result
    6. A wierd space
    7. Away Team 
    8. Competition name
  """
  def find_match_result({_, _, cols}) do
    %{
      leagueId: "1_356306073",
      leagueName: "Thames Valley Div 2",
      fixtureId: Enum.fetch!(cols, 2)
          |> Floki.find("a")
          |> Floki.attribute("href")
          |> Enum.fetch!(0)
          |> String.replace("/DisplayFixture.do?id=", ""),
      date: fetch_text_from_col(cols, 2) 
          |> Timex.parse!("{D}/{M}/{YY} {h24}:{m}") 
          |> Timex.format!("{ISOdate} {ISOtime}"),
      homeTeam: fetch_text_from_col(cols, 3),
      awayTeam: fetch_text_from_col(cols, 6),
      homeScore: 2,
      awayScore: 2
    }
  end

  defp store_in_firebase(fixture) do
    key = Application.get_env(:scraper, FirebaseKey)
    url = "https://fa-full-time-mobile-3c977.firebaseio.com/fixtures/#{fixture[:fixture_id]}.json"

    case Poison.encode(fixture) do
      {:ok, encoded_fixture} -> 
        case HTTPoison.put("#{url}?auth=#{key}", encoded_fixture) do
          {:ok, res} -> {:ok, fixture, res}
          {:error, err} -> {:error, fixture, err}
        end

      {:error, err} -> {:error, fixture, err}
    end
  end

  defp store_in_graphql(fixture) do
    url = "http://localhost:8080/graphql"

    query = "
      mutation StoreFixture(
        $leagueId: String!,
        $leagueName: String!
        $fixtureId: String!,
        $date: String!,
        $homeTeam: String!,
        $awayTeam: String!,
        $homeScore: Int!,
        $awayScore: Int!) {
          fixture(
            leagueId:$leagueId, 
            leagueName:$leagueName,
            fixtureId:$fixtureId
            date:$date
            homeTeam:$homeTeam
            awayTeam:$awayTeam
            homeScore:$homeScore
            awayScore:$awayScore) {
              id,
              date,
              homeTeam:homeTeamName,
              awayTeam:awayTeamName,
              homeScore,
              awayScore
            }
      }
    "

    request = %{query: query, variables: fixture}

    case Poison.encode(request) do
      {:ok, encoded_fixture} -> 
        headers = %{
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
        case HTTPoison.post(url, encoded_fixture, headers) do
          {:ok, res} -> IO.puts(res.body); {:ok, fixture, res}
          {:error, err} -> {:error, fixture, err}
        end

      {:error, err} -> {:error, fixture, err}
    end
  end

  def fetch_and_store do
    case fetch_fixtures do
      {:ok, fixtures} -> 
        IO.puts "Found #{Enum.count(fixtures)} total fixtures"
        Enum.map(fixtures, &store_in_graphql(&1))
      {:error, reason} -> {:error, reason}
    end
  end

  def start(_type, _args) do
    children = [
      Supervisor.Spec.worker(Scraper.Scheduler, [])
    ]

    Supervisor.start_link(children, strategy: :one_for_one)
  end
end
