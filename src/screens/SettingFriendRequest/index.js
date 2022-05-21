import React, { useContext } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { timestamp_format, AddressToName } from '../../lib/Util'
import { List, WhiteSpace } from '@ant-design/react-native'
import EmptyView from '../EmptyView'
import { ThemeContext } from '../../theme/theme-context'
import BaseAvatarList from '../BaseAvatarList'

const Item = List.Item

//好友申请
const SettingFriendRequestScreen = props => {
  const { theme } = useContext(ThemeContext)
  const data = props.avatar.get('FriendRequests')
  const lists = data.map(item => ({
    title: `${AddressToName(props.avatar.get('AddressMap'), item.Address)}`,
    desc: timestamp_format(item.Timestamp),
    onpress: () => props.navigation.push('AddressMark', { address: item.Address })
  }))

  return (
    <View style={{
      height: '100%',
      backgroundColor: theme.base_view
    }}>

      <WhiteSpace size='lg' />
      {
        data.length > 0 ? <View>
          <BaseAvatarList data={lists} />
        </View> : <EmptyView />
      }
    </View >
  )
}

const ReduxSettingFriendRequestScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(SettingFriendRequestScreen)

export default ReduxSettingFriendRequestScreen