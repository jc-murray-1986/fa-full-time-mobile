
/**
 * @flow
 */

import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { ResultListView } from './ResultListView'
import { StandingsView } from './StandingsView'
import { LoadingView } from './LoadingView'

import type { LeagueExcerpt } from '../repo'

type LeagueDetailViewProps = {
  league: LeagueExcerpt,
  isFetchingLeagueExcerpt: boolean
}

export const LeagueDetailView = ({league, isFetchingLeagueExcerpt}: LeagueDetailViewProps) => (
  <LoadingView loading={isFetchingLeagueExcerpt} content={() => (
    <View>
      <View style={styles.contentBox}>
        <Text style={styles.headline}>Latest scores</Text>
        <ResultListView results={league.matchResults} />
      </View>
      <View style={styles.contentBox}>
        <Text style={styles.headline}>League table</Text>
        <StandingsView standings={league.standings} />
      </View>
    </View>
  )} />
)

LeagueDetailView.navigationOptions = {
  title: (navigation) => navigation.state.params.name
}

const styles = StyleSheet.create({
  leagueName: {
    fontWeight: 'bold',
    fontSize: 20
  },
  contentBox: {
    borderTopWidth: 2,
    borderColor: 'lightgray',
    marginBottom: 20
  },
  headline: {
    fontWeight: 'bold',
    margin: 10
  }
})
