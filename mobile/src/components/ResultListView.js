/**
 * @flow
 */

import React, { Component } from 'react'
import { ListView } from 'react-native'
import { ResultView } from './ResultView'
import type { MatchResult } from '../repo'

const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

export const ResultListView = ({ results } : { results: Array<MatchResult> }) => (
  <ListView
    scrollEnabled={false}
    enableEmptySections={true}
    dataSource={dataSource.cloneWithRows(results)}
    renderRow={(result, sectionId, rowId) => (
      <ResultView result={result} theme={rowId % 2 == 0 ? 'dark' : 'light'} />
    )}
  />
)
