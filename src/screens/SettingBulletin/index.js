import React, { useContext, useState } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { BulletinAddressSession, BulletinHistorySession, BulletinMarkSession } from '../../lib/Const'
import { actionType } from '../../redux/actions/actionType'
import { List, WhiteSpace } from '@ant-design/react-native'
import { ThemeContext } from '../../theme/theme-context'
import BaseList from '../BaseList'
import AlertView from '../AlertView'

const Item = List.Item
//设置
const SettingBulletinScreen = (props) => {
  const { theme } = useContext(ThemeContext)
  const [visible, showModal] = useState(false)

  const clearBulletinCacheAlert = () => {
    showModal(true)
  }

  const clearBulletinCache = () => {
    props.dispatch({
      type: actionType.avatar.clearBulletinCache
    })
  }

  const onClose = () => {
    showModal(false)
  }

  return (
    <View style={{
      height: '100%',
      backgroundColor: theme.base_view
    }}>
      <WhiteSpace size='lg' />

      <BaseList data={[
        {
          title: '我的公告', onpress: () => {
            props.navigation.push('BulletinList',
              { session: BulletinAddressSession, address: props.avatar.get('Address') })
          }
        },
        { title: '收藏公告', onpress: () => { props.navigation.push('BulletinList', { session: BulletinMarkSession }) } },
        { title: '浏览历史', onpress: () => { props.navigation.push('BulletinList', { session: BulletinHistorySession }) } },
      ]} />
      <WhiteSpace size='lg' />
      <BaseList data={[
        { title: '设置缓存', onpress: () => { props.navigation.navigate('BulletinCache') } },
        { title: '清空缓存', onpress: clearBulletinCacheAlert },
      ]} />
      <AlertView
        visible={visible}
        onClose={onClose}
        msg='确定要清除所有缓存公告吗？'
        onPress={clearBulletinCache}
      />
    </View >
  )
}


const ReduxSettingBulletinScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(SettingBulletinScreen)

export default ReduxSettingBulletinScreen