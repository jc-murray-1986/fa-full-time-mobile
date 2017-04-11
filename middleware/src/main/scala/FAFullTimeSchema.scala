
import sangria.macros.derive._
import sangria.schema._

object FAFullTimeSchema {

  val LeagueIdArgument = Argument("leagueId", StringType, "The unique identifier for the league")
  val FixtureIdArgument = Argument("fixtureId", StringType, "The unique identifier for the fixture")

  val TeamObject: ObjectType[LeagueRepo, Team] = deriveObjectType[LeagueRepo, Team](
    ObjectTypeDescription("A group of players who attack in the same direction in a football match")
  )

  val FixtureObject: ObjectType[LeagueRepo, Fixture] = ObjectType(
    "Fixture",
    "A fixture between two teams",
    fields[LeagueRepo, Fixture](
      Field("id", StringType, resolve = _.value.id),
      Field("date", StringType, resolve = _.value.date),
      Field("homeTeam", OptionType(TeamObject), Some("The home team in the fixture"), resolve = _.value.homeTeam),
      Field("homeTeamName", StringType, Some("The name of the home team in the fixture"), resolve = _.value.homeTeam.get.name),
      Field("awayTeam", OptionType(TeamObject), Some("The away team in the fixture"), resolve = _.value.awayTeam),
      Field("awayTeamName", StringType, Some("The name of the away team in the fixture"), resolve = _.value.awayTeam.get.name),
      Field("homeScore", IntType, Some("Number of goals scored by the home team"), resolve = _.value.homeScore),
      Field("awayScore", IntType, Some("Number of goals scored by the away team"), resolve = _.value.awayScore)
    )
  )

  val TeamStandingObject = ObjectType(
    "TeamStanding",
    "The position in the league that the team currently occupies",
    fields[LeagueRepo, TeamStanding](
      Field("teamName", StringType, resolve = _.value.team.get.name),
      Field("matchesPlayed", IntType, resolve = _.value.matchesPlayed),
      Field("goalDifference", IntType, resolve = _.value.goalDifference),
      Field("points", IntType, resolve = _.value.points)
    )
  )

  val LeagueObject = ObjectType(
    "League",
    "A division of teams which play competitive matches against each other",
    fields[LeagueRepo, League](
      Field("id", StringType, resolve = _.value.id),
      Field("name", StringType, resolve = _.value.name),
      Field("results", OptionType(ListType(FixtureObject)), resolve = request => request.ctx.getResultsInLeague(request.value)),
      Field("standings", OptionType(ListType(TeamStandingObject)), resolve = request => request.ctx.getStandingsForLeague(request.value))
    )
  )

  val RootSelectQuery = ObjectType("FAFullTimeQuery", fields[LeagueRepo, Unit](
    Field("fixture", OptionType(FixtureObject),
      arguments = FixtureIdArgument :: Nil,
      resolve = request ⇒ request.ctx.getFixtureById(request arg FixtureIdArgument)
    ),
    Field("fixtures", OptionType(ListType(FixtureObject)),
      resolve = request ⇒ request.ctx.allFixtures()
    ),
    Field("leagues", OptionType(ListType(LeagueObject)),
      resolve = request => request.ctx.allLeagues()
    ),
    Field("league", OptionType(LeagueObject),
      arguments = LeagueIdArgument :: Nil,
      resolve = request => request.ctx.findLeagueById(request arg LeagueIdArgument)
    )
  ))


//  val FixtureInput = ObjectType(
//    "FixtureInput",
//    fields[LeagueRepo, Fixture](
//      Field("id", StringType, resolve = _.value.id),
//      Field("date", StringType, resolve = _.value.date),
//      Field("homeTeam", StringType, resolve = _.value.homeTeam.get.name),
//      Field("homeScore", IntType, resolve = _.value.homeScore),
//      Field("awayTeam", StringType, resolve = _.value.awayTeam.get.name),
//      Field("awayScore", IntType, resolve = _.value.awayScore)
//    )
//  )
//
//  val LeagueInput = ObjectType(
//    "LeagueInput",
//    "Allows clients to submit a list of fixtures in a league",
//    fields[LeagueRepo, League](
//      Field("id", StringType, resolve = _.value.id),
//      Field("name", StringType, resolve = _.value.name),
//      Field("results", ListType(OptionType(FixtureInput)), resolve = request => request.ctx.getResultsInLeague(request.value))
//    )
//  )
//
//  val LeagueInputArgument = Argument("league", OptionType(LeagueInput), "The league with some results")

  // TODO: Allow clients to post a fixture as an object rather than all these parameters..
  val LeagueNameArgument = Argument("leagueName", StringType, "The name of the league")
  val DateArgument = Argument("date", StringType, "The date of the match")
  val HomeTeamArgument = Argument("homeTeam", StringType, "The name of the home team")
  val HomeScoreArgument = Argument("homeScore", IntType, "The number of goals scored by the home team")
  val AwayTeamArgument = Argument("awayTeam", StringType, "The name of the away team")
  val AwayScoreArgument = Argument("awayScore", IntType, "The number of goals scored by the away team")

  var RootMutationQuery = ObjectType("FAFullTimeMutation", fields[LeagueRepo, Unit](
    Field("fixture", OptionType(FixtureObject),
      arguments = LeagueIdArgument :: LeagueNameArgument :: DateArgument ::
        FixtureIdArgument :: HomeTeamArgument :: AwayTeamArgument ::
        HomeScoreArgument :: AwayScoreArgument :: Nil,
      resolve = request => request.ctx.storeFixture(
        request arg LeagueIdArgument, request arg LeagueNameArgument, request arg FixtureIdArgument,
        request arg DateArgument, request arg HomeTeamArgument, request arg AwayTeamArgument,
        request arg HomeScoreArgument, request arg AwayScoreArgument))
    )
  )

  val LeagueSchema = Schema(RootSelectQuery, Some(RootMutationQuery))
}
