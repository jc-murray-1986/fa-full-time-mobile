# Scraper

Pulls data from FA Full Time.

## Installation

If [available in Hex](https://hex.pm/docs/publish), the package can be installed as:

  1. Add `scraper` to your list of dependencies in `mix.exs`:

    ```elixir
    def deps do
      [{:scraper, "~> 0.1.0"}]
    end
    ```

  2. Ensure `scraper` is started before your application:

    ```elixir
    def application do
      [applications: [:scraper]]
    end
    ```


## URLs

    # url_2015_16 = "#{base}?selectedFixtureGroupKey=1_904533010
    #                       &selectedRelatedFixtureOption=1
    #                       &selectedClub=
    #                       &selectedTeam=
    #                       &selectedDateCode=all
    #                       &selectednavpage1=All
    #                       &navPageNumber1=1
    #                       &previousSelectedFixtureGroupKey=1_904533010
    #                       &previousSelectedClub=
    #                       &seasonID=471503827
    #                       &selectedSeason=471503827"