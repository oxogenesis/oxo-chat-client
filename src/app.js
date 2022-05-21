/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useContext, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Provider } from '@ant-design/react-native'

import { connect } from 'react-redux'

import AppStack from './screens/AppStack'

import { ThemeProvider, ThemeContext } from './theme/theme-context'
const Stack = createStackNavigator()

const App = (props) => {
  const { toggle } = useContext(ThemeContext)
  // console.log('默认获取的主题',props.avatar.get('Theme'))
  useEffect(() => {
    toggle(props.avatar.get('Theme'))
  }, [props.avatar.get('Theme')])

  return (
    <Provider>
      <ThemeProvider defaultTheme={props.avatar.get('Theme')}>
        <NavigationContainer>
          <AppStack />
        </NavigationContainer>
      </ThemeProvider>
    </Provider>
  )
}

export default connect((state) => {
  return {
    master: state.master,
    avatar: state.avatar
  }
})(App)