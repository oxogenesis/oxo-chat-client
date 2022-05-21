import React, { useContext } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useNavigation, useRoute } from '@react-navigation/native'
import TabSessionScreen from '../TabSession'
import TabBulletinScreen from '../TabBulletin'
import TabAddressBookScreen from '../TabAddressBook'
import TabSettingScreen from '../TabSetting'
import IconAnt from 'react-native-vector-icons/AntDesign'
import { connect } from 'react-redux'
import { ThemeContext } from '../../theme/theme-context'


const Tab = createBottomTabNavigator()

//登录后界面
const TabHomeScreen = (props) => {
  const { theme } = useContext(ThemeContext)
  return (
    <Tab.Navigator
      screenOptions={{
        "tabBarActiveTintColor": theme.tab_selected_text,
        "tabBarInactiveTintColor": theme.tab_text,
        "tabBarActiveBackgroundColor": theme.tab_view,
        "tabBarInactiveBackgroundColor": theme.tab_view,
        "tabBarStyle": [
          {
            "display": "flex",
            height: 65,
          },
          null
        ]
      }}>
      <Tab.Screen name="聊天" component={TabSessionScreen} options={{
        tabBarLabel: '聊天',
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.tab_view,
        },
        headerTitleStyle: {
          color: theme.tab_text,
        },
        tabBarBadge: props.avatar.get("CountUnreadMessage"),
        tabBarIcon: ({ color }) => {
          return <IconAnt
            name={'message1'}
            size={32}
            color={color}
          />
        }
      }} />
      <Tab.Screen name="公告" component={TabBulletinScreen} options={{
        tabBarLabel: '公告',
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.tab_view,
        },
        headerTitleStyle: {
          color: theme.tab_text,
        },
        tabBarIcon: ({ color, focusd }) => (
          <IconAnt
            name={'notification'}
            size={32}
            color={color}
          />
        )
      }} />
      <Tab.Screen name="地址薄" component={TabAddressBookScreen} options={{
        tabBarLabel: '地址薄',
        headerStyle: {
          backgroundColor: theme.tab_view,
        },
        headerTitleStyle: {
          color: theme.tab_text,
        },
        tabBarIcon: ({ color, focusd }) => (
          <IconAnt
            name={'contacts'}
            size={32}
            color={color}
          />
        )
      }} />
      <Tab.Screen name="TabSetting" component={TabSettingScreen} options={{
        tabBarLabel: '设置',
        headerShown: false,
        tabBarIcon: ({ color, focusd }) => (
          <IconAnt
            name={'setting'}
            size={32}
            color={color}
          />
        )
      }} />
    </Tab.Navigator>
  )
}

const ReduxTabHomeScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(TabHomeScreen)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxTabHomeScreen{...props} navigation={navigation} route={route} />
}