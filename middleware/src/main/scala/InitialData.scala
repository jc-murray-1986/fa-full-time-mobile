
object InitialData {
  val LEAGUES: Seq[League] = Seq[League](
    League(uuid, "Thames Valley League")
  )

  val TEAMS: Seq[Team] = Seq[Team](
    Team(uuid, "Goring United"),
    Team(uuid, "Theale"),
    Team(uuid, "Reading YMCA"),
    Team(uuid, "Marlow"),
    Team(uuid, "Woodcote"),
    Team(uuid, "Westwood")
  )

  val FIXTURES: Seq[Fixture] = Seq[Fixture](
    Fixture(
      id = uuid, date = "2017-04-08 15:00",
      league = findLeagueByName("Thames Valley League"),
      homeTeam = findTeamByName("Goring United"), homeScore = 3,
      awayTeam = findTeamByName("Theale"), awayScore = 2),
    Fixture(
      id = uuid, date = "2017-04-08 15:00",
      league = findLeagueByName("Thames Valley League"),
      homeTeam = findTeamByName("Marlow"), homeScore = 0,
      awayTeam = findTeamByName("Reading YMCA"), awayScore = 2),
    Fixture(
      id = uuid, date = "2017-04-08 15:00",
      league = findLeagueByName("Thames Valley League"),
      homeTeam = findTeamByName("Woodcote"), homeScore = 1,
      awayTeam = findTeamByName("Westwood"), awayScore = 1)
  )

  private def uuid: String = java.util.UUID.randomUUID.toString

  private def findLeagueByName(leagueName: String): Option[League] = LEAGUES.find(league => league.name == leagueName)

  private def findTeamByName(teamName: String): Option[Team] = TEAMS.find(team => team.name == teamName)
}
