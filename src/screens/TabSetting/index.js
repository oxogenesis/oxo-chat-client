import React, { useContext, useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { Button, WhiteSpace, Radio } from '@ant-design/react-native'
import { ThemeContext } from '../../theme/theme-context'
import BaseList from '../BaseList'
import { styles } from '../../theme/style'

const RadioItem = Radio.RadioItem
//设置

const TabSettingScreen = (props) => {
  const { theme, toggle } = useContext(ThemeContext)

  const setTheme = (type) => {
    toggle(type)

    props.dispatch({
      type: actionType.avatar.changeTheme,
      theme: type
    })
  }

  const onSwitchChange = (value) => {
    if (value) {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  return (
    <View style={{
      ...styles.base_view,
      backgroundColor: theme.base_view,
    }}>
      <WhiteSpace size='lg' />
      <BaseList data={[{ title: '账号设置', onpress: () => { props.navigation.navigate('SettingMe') } }]} />
      <WhiteSpace size='lg' />
      <BaseList data={[
        { title: '网络设置', onpress: () => { props.navigation.navigate('SettingNetwork') } },
        { title: '地址管理', onpress: () => { props.navigation.navigate('SettingAddress') } },
        { title: '公告设置', onpress: () => { props.navigation.navigate('SettingBulletin') } },
        { title: '随便看看', onpress: () => { props.navigation.push('BulletinRandom') } },
      ]} />
      <WhiteSpace size='lg' />

      <BaseList data={[
        {
          title: '切换主题',
          type: 'switch',
          checked: props.avatar.get('Theme') === 'dark',
          onChange: onSwitchChange,
        },
      ]} />
      <WhiteSpace size='lg' />
      <Button style={{
        ...styles.btn_high,
        backgroundColor: theme.base_body,
        borderColor: theme.line,
      }} onPress={() => {
        props.dispatch({
          type: actionType.avatar.disableAvatar
        })
        props.navigation.navigate('AvatarList')
      }}>
        <Text style={{ color: 'red' }}>切换账户</Text>
      </Button>

      <WhiteSpace size='lg' />
      <Button style={{
        ...styles.btn_high,
        backgroundColor: theme.base_body,
        borderColor: theme.line,
      }} onPress={() => {
        props.navigation.navigate('About')
      }}>
        <Text style={{ color: theme.text1 }}>关于</Text>
      </Button>
    </View >
  )
}

const ReduxTabSettingScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(TabSettingScreen)

export default ReduxTabSettingScreen