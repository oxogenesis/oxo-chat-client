import React, { useContext } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { List, WhiteSpace } from '@ant-design/react-native'
import { ThemeContext } from '../../theme/theme-context'
import BaseList from '../BaseList'

const Item = List.Item
//设置
const SettingAddressScreen = props => {
  const { theme } = useContext(ThemeContext)
  return (
    <View style={{
      backgroundColor: theme.base_view,
      height: '100%'
    }}>
      <WhiteSpace size='lg' />
      <BaseList data={[
        { title: '好友管理', onpress: () => { props.navigation.navigate('SettingFriend') } },
        { title: '好友申请', onpress: () => { props.navigation.navigate('SettingFriendRequest') } },
        { title: '关注管理', onpress: () => { props.navigation.navigate('SettingFollow') } },
      ]} />
    </View>
  )
}

const ReduxSettingAddressScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(SettingAddressScreen)

export default ReduxSettingAddressScreen