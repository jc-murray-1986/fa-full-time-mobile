/**
 * @flow
 */

import { connect } from 'react-redux'
import { LeagueDetailView } from '../components/LeagueDetailView'

export default connect(
  // map state to props
  (state, ownProps) => ({
    league: state.football.selectedLeague,
    isFetchingLeagueExcerpt: state.football.isFetchingLeagueExcerpt
  })

  // connect to LeagueDetailView presentation component
)(LeagueDetailView)
