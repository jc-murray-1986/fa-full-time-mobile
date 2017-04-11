/**
 * @flow
 */

import React, { Component, PropTypes } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import type { MatchResult } from '../repo'

export const ResultView = ({ result, theme }: ResultViewProps) => (
  <View style={theme == 'dark' ? styles.rowDark : styles.rowLight}>
    <Text style={styles.homeTeam}>{result.homeTeam}</Text>
    <View style={styles.homeScore}>
      <Text>{result.homeScore}</Text>
    </View>
    <Text>-</Text>
    <Text style={styles.awayScore}>{result.awayScore}</Text>
    <View style={styles.awayTeam}>
      <Text>{result.awayTeam}</Text>
    </View>
  </View>
)

type ResultViewProps = {
  result: MatchResult,
  style: 'dark' | 'light'
}

ResultView.propTypes = {
  result: PropTypes.object.isRequired,
  style: PropTypes.string
}

const styles = StyleSheet.create({
  rowLight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    backgroundColor: '#F7F7F7'
  },
  rowDark: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderColor: 'lightgray',
    borderBottomWidth: 1
  },
  homeTeam: {
    width: '30%'
  },
  homeScore: {
    width: 50,
    alignItems: 'flex-end',
    paddingRight: 10
  },
  awayScore: {
    width: 50,
    alignItems: 'center',
    paddingLeft: 10
  },
  awayTeam: {
    width: '30%',
    alignItems: 'flex-end'
  }
})
