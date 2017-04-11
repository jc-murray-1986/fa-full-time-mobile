import java.util.UUID

case class League(id: String, name: String)

case class Team(id: String, name: String)

case class Fixture(id: String, date: String, league: Option[League], homeTeam: Option[Team], awayTeam: Option[Team], homeScore: Int, awayScore: Int)

case class TeamStanding(league: Option[League], position: Int, team: Option[Team], matchesPlayed: Int, goalDifference: Int, points: Int)

class LeagueRepo(private var leagues: Seq[League] = Seq[League](),
                 private var fixtures: Seq[Fixture] = Seq[Fixture](),
                 private var teams: Seq[Team] = Seq[Team]()) {

  /**
    *
    * @param leagueId
    * @return
    */
  def findLeagueById(leagueId: String): Option[League] = leagues.find(league => league.id == leagueId)

  /**
    *
    * @return
    */
  def allLeagues(): Seq[League] = leagues

  /**
    *
    * @param fixtureId
    * @return
    */
  def getFixtureById(fixtureId: String): Option[Fixture] = fixtures.find(fixture => fixture.id == fixtureId)

  /**
    *
    * @return
    */
  def allFixtures(): Seq[Fixture] = fixtures

  /**
    *
    * @param league
    * @return
    */
  def getResultsInLeague(league: League): Seq[Fixture] = fixtures.filter(fixture => fixture.league.get.id == league.id)

  private def pointsForTeamInMatch(team: Team, fixture: Fixture): Int = {
    if (fixture.homeScore == fixture.awayScore) {
      1
    } else if (fixture.homeTeam.get == team && fixture.homeScore > fixture.awayScore) {
      3
    } else if (fixture.awayTeam.get == team && fixture.awayScore > fixture.homeScore) {
      3
    } else {
      0
    }
  }

  private def goalDifferenceForTeamInMatch(team: Team, fixture: Fixture): Int = {
    if (fixture.homeTeam.get == team) {
      fixture.homeScore - fixture.awayScore
    } else {
      fixture.awayScore - fixture.homeScore
    }
  }

  /**
    *
    * @param league
    * @return
    */
  def getStandingsForLeague(league: League): Seq[TeamStanding] = fixtures.filter(_.league.get.id == league.id)
    .flatMap(fixture => Seq[Option[Team]](fixture.homeTeam, fixture.awayTeam))
    .map(team => {
      val teamFixtures = fixtures.find(fixture => fixture.homeTeam == team || fixture.awayTeam == team)
      TeamStanding(
        league = Some(league), position = 0, team = team,
        matchesPlayed = teamFixtures.size,
        goalDifference = teamFixtures.map(goalDifferenceForTeamInMatch(team.get, _)).sum,
        points = teamFixtures.map(pointsForTeamInMatch(team.get, _)).sum
      )
    }).sortWith((a, b) => a.points > b.points || a.points == b.points && a.goalDifference > b.goalDifference)

  /**
    *
    * @param leagueId
    * @param fixtureId
    * @param date
    * @param homeTeamName
    * @param awayTeamName
    * @param homeScore
    * @param awayScore
    * @return
    */
  def storeFixture(leagueId: String, leagueName: String, fixtureId: String, date: String, homeTeamName: String,
                   awayTeamName: String, homeScore: Integer, awayScore: Integer): Fixture = {
    val fixture = Fixture(
      id = fixtureId, date = date,
      league = Some(findLeagueById(leagueId) getOrElse League(leagueId, leagueName)),
      homeTeam = findTeamInLeagueByName(leagueId, homeTeamName),
      awayTeam = findTeamInLeagueByName(leagueId, awayTeamName),
      homeScore, awayScore)

    fixtures = fixtures :+ fixture

    fixture
  }

  /**
    * @param leagueId
    * @param teamName
    * @return
    */
  def findTeamInLeagueByName(leagueId: String, teamName: String): Option[Team] = {
    // TODO: get by leagueId part
    Some(teams.find(team => team.name == teamName) getOrElse Team(UUID.randomUUID.toString, teamName))
  }
}
