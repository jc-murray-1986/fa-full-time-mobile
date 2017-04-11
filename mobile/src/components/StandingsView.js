/**
 * @flow
 */

import React, { Component, PropTypes } from 'react'
import { StyleSheet, View, Text, ListView } from 'react-native'
import type { TeamStanding } from '../repo'

const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

const StandingRow = ({ teamStanding }: { teamStanding: TeamStanding }) => (
  <View key={teamStanding.teamName} style={(teamStanding.position % 2 == 0) ? styles.evenRow : styles.oddRow}>
    <Text style={styles.teamName}>{teamStanding.teamName}</Text>
    <View style={styles.numericColumn}>
      <Text>{teamStanding.matchesPlayed}</Text>
    </View>
    <View style={styles.numericColumn}>
      <Text>{teamStanding.goalDifference}</Text>
    </View>
    <View style={styles.numericColumn}>
      <Text>{teamStanding.points}</Text>
    </View>
  </View>
)

const titleRow = { teamName: '', matchesPlayed: 'Pld', goalDifference: 'GD', points: 'Pts' };

export const StandingsView = ({ standings }: StandingsViewProps) => (
  <View style={{margin: -20}}>
    <ListView
        scrollEnabled={false}
        enableEmptySections={true}
        dataSource={dataSource.cloneWithRows([titleRow, ...standings])}
        renderRow={teamStanding => <StandingRow teamStanding={teamStanding} />}
    />
  </View>
)

type StandingsViewProps = {
  standings: Array<TeamStanding>
}

StandingsView.propTypes = {
  standings: PropTypes.array.isRequired
}

const styles = StyleSheet.create({
  evenRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    backgroundColor: '#F7F7F7'
  },
  oddRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderColor: 'lightgray',
    borderBottomWidth: 1
  },
  teamName: {
    width: 220
  },
  numericColumn: {
    width: 30,
    alignItems: 'center'
  }
})
