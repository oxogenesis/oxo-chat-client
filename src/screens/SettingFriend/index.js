import React, { useContext } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { AddressToName } from '../../lib/Util'
import { List, WhiteSpace } from '@ant-design/react-native'
import EmptyView from '../EmptyView'
import { ThemeContext } from '../../theme/theme-context'
import BaseAvatarList from '../BaseAvatarList'

const Item = List.Item
//好友设置

const SettingFriendScreen = (props) => {
  const { theme } = useContext(ThemeContext)
  const lists = props.avatar.get('Friends').map(item => ({
    title: `${AddressToName(props.avatar.get('AddressMap'), item)}`,
    onpress: () => props.navigation.push('AddressMark', { address: item })
  }))

  return (
    <View style={{
      height: '100%',
      backgroundColor: theme.base_view
    }}>
      <WhiteSpace size='lg' />
      {
        props.avatar.get('Friends').length > 0 ? <View>
          <BaseAvatarList data={lists} />
        </View> : <EmptyView />
      }
    </View >
  )
}

const ReduxSettingFriendScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(SettingFriendScreen)

export default ReduxSettingFriendScreen