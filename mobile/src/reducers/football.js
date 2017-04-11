
/**
 * @flow
 */

import type { League, LeagueExcerpt } from '../repo'

type FootballState = {
  selectedLeague: LeagueExcerpt | null,
  isFetchingLeagues: boolean,
  isFetchingLeagueExcerpt: boolean,
  leagues: Array<League>
}

const initialState: FootballState = {
  selectedLeague: null,
  isFetchingLeagues: false,
  isFetchingLeagueExcerpt: false,
  leagues: [],
}

export default function(state: FootballState = initialState, action: Object) {
  switch (action.type) {
    case 'REQUEST_LEAGUES':
      return { ...state, isFetchingLeagues: true, leagues: [] }
    case 'RECEIVE_LEAGUES':
      return { ...state, isFetchingLeagues: false, leagues: action.leagues }
    case 'REQUEST_LEAGUE_EXCERPT':
      return { ...state, isFetchingLeagueExcerpt: true, selectedLeague: null }
    case 'RECEIVE_LEAGUE_EXCERPT':
      return { ...state, isFetchingLeagueExcerpt: false, selectedLeague: action.leagueExcerpt }
    default:
      return state
  }
}
