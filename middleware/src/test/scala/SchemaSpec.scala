import org.scalatest.{Matchers, WordSpec}
import FAFullTimeSchema.LeagueSchema
import sangria.ast.Document

import scala.concurrent.Await
import scala.concurrent.duration._
import scala.concurrent.ExecutionContext.Implicits.global
import sangria.macros._
import sangria.execution.Executor
import sangria.marshalling.sprayJson._
import spray.json._

class SchemaSpec extends WordSpec with Matchers {
  "FAFullTime Schema" should {
    "allow fetching a list of all known leagues" in {
      val query =
        graphql"""
          query {
            leagues {
              id,
              name
            }
          }
        """

      executeQuery(query) should be (
        """
        {
          "data": {
            "leagues": [{
              "id": "TVL",
              "name": "Thames Valley League"
            }, {
              "id": "MWL",
              "name": "Mid Wiltshire League"
            }]
          }
        }
       """.parseJson)
    }

    "fetch fixture by id" in {

      val query =
        graphql"""
          query FetchFixture($$fixtureId: String!) {
            fixture(fixtureId:$$fixtureId) {
              date,
              homeTeam:homeTeamName,
              awayTeam:awayTeamName,
              homeScore,
              awayScore
            }
          }
        """

      executeQuery(query, vars = JsObject("fixtureId" → JsString("fixture_1"))) should be (
        """
          {
            "data": {
              "fixture": {
                "date": "2017-04-08 15:00",
                "homeTeam": "Goring United",
                "awayTeam": "Theale",
                "homeScore": 3,
                "awayScore": 2
              }
            }
          }
        """.parseJson)
    }

    "post a new fixture" in {
      val query =
        graphql"""
          mutation PostFixture($$leagueId: String!, $$leagueName: String!, $$fixtureId: String!, $$date:String!, $$homeTeam:String!, $$awayTeam:String!, $$homeScore:Int!, $$awayScore:Int!) {
            fixture(leagueId:$$leagueId, leagueName:$$leagueName, fixtureId:$$fixtureId, date:$$date, homeTeam:$$homeTeam, awayTeam:$$awayTeam, homeScore:$$homeScore, awayScore:$$awayScore) {
              id
            }
          }
        """

      val vars = JsObject(
        "leagueId" → JsString("TVL"),
        "leagueName" → JsString("Thames Valley League"),
        "fixtureId" → JsString("fixture_10"),
        "date" → JsString("2015-01-01 15:00"),
        "homeTeam" → JsString("Woodcote"),
        "awayTeam" → JsString("Goring"),
        "homeScore" → JsNumber(3),
        "awayScore" → JsNumber(3)
      )

      executeMutation(query, vars = vars).allFixtures().last.id should equal ("fixture_10")
    }
  }

  def executeQuery(query: Document, vars: JsObject = JsObject.empty) = {
    val futureResult = Executor.execute(LeagueSchema, query,
      variables = vars,
      userContext = new LeagueRepo(TestData.LEAGUES, TestData.FIXTURES, TestData.TEAMS))

    Await.result(futureResult, 10.seconds)
  }

  def executeMutation(query: Document, vars: JsObject = JsObject.empty) = {
    val repo = new LeagueRepo(TestData.LEAGUES, TestData.FIXTURES, TestData.TEAMS)

    val futureResult = Executor.execute(LeagueSchema, query,
      variables = vars,
      userContext = repo)

    Await.result(futureResult, 10.seconds)

    // return the repo so that assertions can be made on its new state
    repo
  }

  object TestData {
    val LEAGUES: Seq[League] = Seq[League](
      League("TVL", "Thames Valley League"),
      League("MWL", "Mid Wiltshire League")
    )

    val TEAMS: Seq[Team] = Seq[Team](
      Team("team_1", "Goring United"),
      Team("team_2", "Theale"),
      Team("team_3", "Reading YMCA"),
      Team("team_4", "Marlow"),
      Team("team_5", "Woodcote"),
      Team("team_6", "Westwood")
    )

    val FIXTURES: Seq[Fixture] = Seq[Fixture](
      Fixture(
        id = "fixture_1",
        date = "2017-04-08 15:00",
        league = findLeagueByName("Thames Valley League"),
        homeTeam = findTeamByName("Goring United"), homeScore = 3,
        awayTeam = findTeamByName("Theale"), awayScore = 2),
      Fixture(
        id = "fixture_2",
        date = "2017-04-08 15:00",
        league = findLeagueByName("Thames Valley League"),
        homeTeam = findTeamByName("Marlow"), homeScore = 0,
        awayTeam = findTeamByName("Reading YMCA"), awayScore = 2),
      Fixture(
        id = "fixture_3",
        date = "2017-04-08 15:00",
        league = findLeagueByName("Thames Valley League"),
        homeTeam = findTeamByName("Woodcote"), homeScore = 1,
        awayTeam = findTeamByName("Westwood"), awayScore = 1)
    )

    private def uuid: String = java.util.UUID.randomUUID.toString

    private def findLeagueByName(leagueName: String): Option[League] = LEAGUES.find(league => league.name == leagueName)

    private def findTeamByName(teamName: String): Option[Team] = TEAMS.find(team => team.name == teamName)
  }

}
