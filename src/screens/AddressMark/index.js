import React, { useContext, useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { BulletinAddressSession } from '../../lib/Const'
import Clipboard from '@react-native-clipboard/clipboard'
import { Button, List, WhiteSpace, Toast } from '@ant-design/react-native'
import { styles } from '../../theme/style'
import { ThemeContext } from '../../theme/theme-context'
import AlertView from '../AlertView'
import BaseList from '../BaseList'

const Item = List.Item
const Brief = Item.Brief
//地址标记
const AddressMarkScreen = (props) => {
  const [isFriend, setFriend] = useState(undefined)
  const [isFollow, setFollow] = useState(undefined)
  const { theme } = useContext(ThemeContext)
  const [visible1, showModal1] = useState(false)
  const [visible2, showModal2] = useState(false)
  const [visible3, showModal3] = useState(false)
  const [visible4, showModal4] = useState(false)
  const [visible5, showModal5] = useState(false)

  const delAddressMark = () => {
    if (props.avatar.get('CurrentAddressMark').IsFollow || props.avatar.get('CurrentAddressMark').IsFriend) {
      showModal1(true)
    } else {
      props.dispatch({
        type: actionType.avatar.delAddressMark,
        address: props.avatar.get('CurrentAddressMark').Address
      })
      props.navigation.goBack()
    }
  }

  const onClose = () => {
    showModal1(false)
    showModal2(false)
    showModal3(false)
    showModal4(false)
    showModal5(false)
  }

  const addFriend = () => {
    props.dispatch({
      type: actionType.avatar.addFriend,
      address: props.avatar.get('CurrentAddressMark').Address
    })
  }

  const delFriendAlert = () => {
    showModal2(true)
  }

  const delFriend = () => {
    setFriend(false)
    props.dispatch({
      type: actionType.avatar.delFriend,
      address: props.avatar.get('CurrentAddressMark').Address
    })
  }

  const addFollow = () => {
    props.dispatch({
      type: actionType.avatar.addFollow,
      address: props.avatar.get('CurrentAddressMark').Address
    })
  }

  const delFollowAlert = () => {
    showModal3(true)
    setFollow(false)
  }

  const delFollow = () => {
    props.dispatch({
      type: actionType.avatar.delFollow,
      address: props.avatar.get('CurrentAddressMark').Address
    })
  }

  const loadAddressMark = () => {
    props.dispatch({
      type: actionType.avatar.setCurrentAddressMark,
      address: props.route.params.address
    })
  }

  const copyToClipboard = () => {
    Clipboard.setString(props.avatar.get('CurrentAddressMark').Address)
    Toast.success('拷贝成功！', 1)
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      loadAddressMark()
    })
  })

  const onSwitchChange = async value => {
    if (value) {
      await addFriend()
      setFriend(value)
    } else {
      showModal4(true)
    }
  }

  const onSwitchChangeFollow = async value => {
    if (value) {
      await addFollow()
      setFollow(value)
    } else {
      showModal5(true)
    }
  }

  const current = props.avatar.get('CurrentAddressMark')
  const { Name, Address, IsMark, IsFriend, IsFollow } = current || {}
  const currentFriend = isFriend === undefined ? IsFriend : isFriend
  const currentFollow = isFollow === undefined ? IsFollow : isFollow

  return (
    <View style={{
      height: '100%',
      backgroundColor: theme.base_view
    }}>
      <WhiteSpace size='lg' />
      {
        current &&
        <>
          <BaseList data={[
            { title: Address, icon: 'block', onpress: copyToClipboard },
            { title: Name, onpress: () => props.navigation.navigate('AddressEdit', { address: Address }) },
          ]} />

          <WhiteSpace size='lg' />

          {
            IsMark && <BaseList data={[
              {
                title: '添加好友',
                type: 'switch',
                checked: currentFriend,
                onChange: onSwitchChange,
              },
              {
                title: '关注公告',
                type: 'switch',
                checked: currentFollow,
                onChange: onSwitchChangeFollow,
              },
            ]} />
          }

          {
            currentFollow &&
            <BaseList data={[
              {
                title: '查看公告', onpress: () =>
                  props.navigation.push('BulletinList',
                    { session: BulletinAddressSession, address: Address })
              },
            ]} />
          }

          {
            IsMark && <WhiteSpace size='lg' />
          }

          {
            IsMark && <Button style={{
              height: 55,
              backgroundColor: theme.base_body,
              borderColor: theme.line,
            }}
              onPress={delAddressMark}
            ><Text style={{
              color: 'red',
            }}>删除</Text></Button>
          }
          {
            IsMark && <WhiteSpace size='lg' />
          }
          {
            IsMark && currentFriend && <Button
              style={{
                height: 55,
                backgroundColor: theme.base_body,
                borderColor: theme.line,
              }}
              onPress={() =>
                props.navigation.push('Session', { address: Address })}
            ><Text style={{
              color: '#389e0d'
            }}>开始聊天</Text></Button>
          }

          {
            !IsMark &&
            <Button
              style={styles.btn_high}
              type='primary'
              onPress={() => props.navigation.navigate('AddressAdd',
                { address: Address })}
            >
              标记地址
            </Button>
          }
        </>
      }
      <AlertView
        visible={visible1}
        onPress={onClose}
        onClose={onClose}
        title='错误'
        msg='删除账户标记前，请先解除好友并取消关注，谢谢。'
      />
      <AlertView
        visible={visible2}
        onClose={onClose}
        msg='解除好友关系后，历史聊天记录将会被删除，并拒绝接收该账户的消息。'
        onPress={delFriend}
      />
      <AlertView
        visible={visible3}
        onClose={onClose}
        msg="取消关注账户后，该账户的公告都将会被设置为缓存。"
        onPress={delFollow}
      />
      <AlertView
        visible={visible4}
        onClose={onClose}
        msg='确定要删除好友吗？'
        onPress={delFriendAlert}
      />
      <AlertView
        visible={visible5}
        onClose={onClose}
        msg="确定要取消关注吗？"
        onPress={delFollowAlert}
      />
    </View>
  )

}

const ReduxAddressMarkScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(AddressMarkScreen)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxAddressMarkScreen{...props} navigation={navigation} route={route} />
}