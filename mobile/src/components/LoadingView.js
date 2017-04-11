
/**
 * @flow
 */

import React, { Component, PropTypes } from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'

export const LoadingView = ({ loading, content }: { loading: boolean, content: () => Component }) => (
  <View>
    {loading ? <ActivityIndicator style={styles.activityIndicator} /> : content()}
  </View>
)

LoadingView.propTypes = {
  loading: PropTypes.bool.isRequired,
  content: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  activityIndicator: {
    margin: 20
  }
})
