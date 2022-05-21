import React, { useContext } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { AddressToName } from '../../lib/Util'
import EmptyView from '../EmptyView'
import { List, WhiteSpace } from '@ant-design/react-native'
import { ThemeContext } from '../../theme/theme-context'
import BaseAvatarList from '../BaseAvatarList'
const Item = List.Item

//关注设置
const SettingFollowScreen = props => {
  const { theme } = useContext(ThemeContext)

  const lists = props.avatar.get('Follows').map(item => ({
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
        props.avatar.get('Follows').length > 0 ? <View>
          <BaseAvatarList data={lists} />
        </View> : <EmptyView />
      }
    </View >
  )
}

const ReduxSettingFollowScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(SettingFollowScreen)

export default ReduxSettingFollowScreen