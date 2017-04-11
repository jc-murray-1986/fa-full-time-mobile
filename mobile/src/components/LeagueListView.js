/**
 * @flow
 */

import React, { PropTypes, Component } from 'react'
import { StyleSheet, View, ListView, ActivityIndicator } from 'react-native'
import { LeagueListItem } from './LeagueListItem'
import { LoadingView } from './LoadingView'

import type { League } from '../repo'

const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

// Compile-time props checking
type LeagueListViewProps = {
  leagues: Array<League>,
  onLeagueSelected: Function,
  isFetchingLeagues: boolean
}

export const LeagueListView = ({leagues, onLeagueSelected, isFetchingLeagues}: LeagueListViewProps) => (
  <LoadingView loading={isFetchingLeagues} content={() => (
    <ListView
      enableEmptySections={true}
      dataSource={dataSource.cloneWithRows(leagues)}
      renderRow={league => <LeagueListItem league={league} onPress={onLeagueSelected(league)} />}
    />
  )} />
)

LeagueListView.navigationOptions = {
    title: 'Leagues'
}

LeagueListView.propTypes = {
  leagues: PropTypes.array.isRequired,
  onLeagueSelected: PropTypes.func.isRequired,
  isFetchingLeagues: PropTypes.bool.isRequired
}
