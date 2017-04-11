
/**
 * @flow
 */

import { connect } from 'react-redux'
import { LeagueListView } from '../components/LeagueListView'
import { navigateToLeagueDetail } from '../repo'
import type { League } from '../repo'

export default connect(
  // map state to props
  (state, ownProps) => ({
    leagues: Object.values(state.football.leagues),
    isFetchingLeagues: state.football.isFetchingLeagues
  }),

  // map dispatch to props
  (dispatch, ownProps) => ({
    onLeagueSelected: (league: League) => () => (
      dispatch(navigateToLeagueDetail(league))
    )
  })

  // bind to component
)(LeagueListView)
