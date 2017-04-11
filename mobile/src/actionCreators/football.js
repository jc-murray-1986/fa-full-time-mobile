/**
 * @flow
 */

import type { League, MatchResult, TeamStanding, LeagueExcerpt } from '../repo'

export function requestLeagues() {
  return { type: 'REQUEST_LEAGUES' }
}

export function receiveLeagues(leagues: Array<League>) {
  return { type: 'RECEIVE_LEAGUES', leagues: leagues }
}

export function requestLeagueExcerpt() {
  return { type: 'REQUEST_LEAGUE_EXCERPT' }
}

export function receiveLeagueExcerpt(leagueExcerpt: LeagueExcerpt) {
  return { type: 'RECEIVE_LEAGUE_EXCERPT', leagueExcerpt }
}
