/**
 * @flow
 */

import {
  requestLeagues, receiveLeagues,
  requestLeagueExcerpt, receiveLeagueExcerpt
} from './actionCreators/football'

import { graphqlFetch } from './graphql_fetch.js'

export type League = {
  id: string,
  name: string
}

export type MatchResult = {
  date: string,
  homeTeam: string,
  awayTeam: string,
  homeScore: number,
  awayScore: number
}

export type TeamStanding = {
  teamName: string,
  position: number,
  matchesPlayed: number,
  goalDifference: number,
  points: number
}

export type LeagueExcerpt = {
  leagueId: string,
  name: string,
  matchResults: Array<MatchResult>,
  standings: Array<TeamStanding>
}

export type DispatchFunc = (action: Object | Function) => Promise<*>

/**
 * A thunk which fetches the id and name of all leagues known by the middleware
 */
export function fetchLeagues() {
  return async (dispatch: DispatchFunc) => {
    dispatch(requestLeagues())

    const result = await graphqlFetch(`
      query {
        leagues {
          id,
          name
        }
      }
    `)

    // todo: verify result

    dispatch(receiveLeagues(result.data.leagues))
  }
}


export function navigateToLeagueDetail(league: League) {
  return (dispatch: DispatchFunc) => {

    dispatch({
      type: 'Navigation/NAVIGATE',
      routeName: 'League',
      params: {
        name: league.name
      }
    })

    return dispatch(fetchLeagueExcerpt(league))
  }
}

/**
 * A thunk which fetches the latest results and standings for the given league
 *
 * The thunk returns a promise so that this function can be chained with a
 * navigation action.
 */
export function fetchLeagueExcerpt(league: League) {
  return async (dispatch: DispatchFunc) => {
    dispatch(requestLeagueExcerpt())

    const result = await graphqlFetch(`
      query($leagueId: String!) {
        league(leagueId:$leagueId) {
          leagueId: id,
          name,
          matchResults: results {
            date,
            homeTeam: homeTeamName,
            awayTeam: awayTeamName,
            homeScore,
            awayScore
          },
          standings {
            teamName,
            matchesPlayed,
            goalDifference,
            points
          }
        }
      }
    `, { leagueId: league.id })

    dispatch(receiveLeagueExcerpt(result.data.league))
  }
}



/*


const result = graphqlFetch(`
  query {
    league(leagueId:${league.id}) {
      id,
      name,
      results(limit: 6) {
        date,
        homeTeam: homeTeamName,
        awayTeam: awayTeamName,
        homeScore,
        awayScore
      },
      standings(limit: 6) {
        team: teamName,
        matchesPlayed,
        goalDifference,
        points
      }
    }
  }
`)


const standings: Array<TeamStanding> = [{
      teamName: 'Goring United',
      position: 1,
      matchesPlayed: 5,
      goalDifference: 15,
      points: 12
    }, {
      teamName: 'Theale',
      position: 2,
      matchesPlayed: 5,
      goalDifference: 7,
      points: 9
    }, {
      teamName: 'Woodcote',
      position: 3,
      matchesPlayed: 5,
      goalDifference: 2,
      points: 8
    }]
    
    const matchResults: Array<MatchResult> = [{
      date: '2017-03-31 12:30',
      homeTeam: "Goring United",
      awayTeam: "Theale",
      homeScore: 5,
      awayScore: 0
    }, {
      date: '2017-03-31 15:00',
      homeTeam: "Reading YMCA",
      awayTeam: "Marlow",
      homeScore: 2,
      awayScore: 3
    }, {
      date: '2017-03-31 17:30',
      homeTeam: "Woodcote",
      awayTeam: "Westwood",
      homeScore: 1,
      awayScore: 1
    }]
*/
