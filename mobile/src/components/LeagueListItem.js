/**
 * @flow
 */

import React, { Component, PropTypes } from 'react'
import { View, Text, StyleSheet, Button, Alert, TouchableHighlight } from 'react-native'
import type { League } from '../repo'

// Compile-time prop types
type LeagueListItemProps = {
  league: League,
  onPress: Function
}

// Presentational component for the league list item
export const LeagueListItem = ({ league, onPress }: LeagueListItemProps ) => (
  <TouchableHighlight style={styles.container} onPress={onPress}>
    <View>
      <Text style={styles.title}>{league.name}</Text>
    </View>
  </TouchableHighlight>
)

// Run-time prop types
LeagueListItem.propTypes = {
  league: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderColor: 'lightgray',
    borderBottomWidth: 1,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    paddingLeft: 10,
    fontWeight: 'bold'
  }
})
