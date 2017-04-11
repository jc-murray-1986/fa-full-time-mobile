
/*
 * Entry point for the application. Here we will:
 *  - Initialise the redux store
 *  - Set up the navigation
 *
 * @flow
 */

import React, { Component } from 'react'
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { Provider, connect } from 'react-redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import football from '../reducers/football'
import { StackNavigator, addNavigationHelpers } from 'react-navigation'

import LeagueListView from './LeagueListView'
import LeagueDetailView from './LeagueDetailView'

import { fetchLeagues } from '../repo'

const AppNavigator = StackNavigator({
  Main: { screen: LeagueListView },
  League: { screen: LeagueDetailView }
})

const navReducer = (state, action) => {
  const newState = AppNavigator.router.getStateForAction(action, state)
  return (newState ? newState : state)
}

const appReducer = combineReducers({ nav: navReducer, football })

// Note, thunk middleware must be applied before logger middleware
const middleware = applyMiddleware(thunk, createLogger({}))

const store = createStore(appReducer, middleware)

// Kick off initial data fetch, because this has to happen somewhere. It seemed
// wrong to put it at the component level, and since this is the entrypoint to
// the application, it seemed like a suitable place.
store.dispatch(fetchLeagues())

// Integrate the AppNavigator with Redux
const App = connect(
  state => ({ state: state.nav })
)(props => <AppNavigator navigation={addNavigationHelpers(props)} />)

export const FAFullTimeApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
)
