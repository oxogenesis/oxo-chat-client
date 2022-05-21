import React, { useContext } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { List, WhiteSpace } from '@ant-design/react-native'
import { connect } from 'react-redux'
import { AddressToName } from '../../lib/Util'
import { ThemeContext } from '../../theme/theme-context'
import BaseAvatarList from '../BaseAvatarList'
const Item = List.Item

//设置
const AddressSelectScreen = props => {

  const { theme } = useContext(ThemeContext)

  const lists = props.avatar.get('Friends').map(item => ({
    title: AddressToName(props.avatar.get('AddressMap'), item),
    onpress: () => props.navigation.push('Session', { address: item, content: props.route.params.content })
  }))

  return (
    <ScrollView
      style={{ flex: 1, height: '100%', backgroundColor: theme.base_view }}
      automaticallyAdjustContentInsets={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
      <WhiteSpace />

      {
        props.avatar.get('Friends').length > 0 ?
          <View>
            <Text style={{
              paddingLeft: 12,
              color: theme.text2,
              borderColor: theme.line,
            }}>全部好友</Text>
            <WhiteSpace />
            <BaseAvatarList data={lists} />
          </View>
          :
          <View>
            <Text style={{
              paddingLeft: 12,
              color: theme.text2,
              borderColor: theme.line,
            }}>暂无好友...</Text>
          </View>
      }
    </ScrollView>
  )
}

const ReduxAddressSelectScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(AddressSelectScreen)

export default ReduxAddressSelectScreen