import React, { useContext, useState, useEffect } from 'react'
import { View, Text, TextInput } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { Button, WhiteSpace } from '@ant-design/react-native'
import { ThemeContext } from '../../theme/theme-context'
import { styles } from '../../theme/style'

//登录界面
const AddressAddScreen = (props) => {
  const [name, setName] = useState(undefined)
  const [address, setAddress] = useState(undefined)
  const [error_msg, setMsg] = useState('')
  const { theme } = useContext(ThemeContext)

  const addAddressMark = () => {
    let newAddress = address.trim()
    let newName = name.trim()
    if (newAddress == '' || newName == '' || newAddress == newName) {
      setMsg('地址或昵称不能为空，地址与昵称不能相同...')
      return
    } else if (newAddress == props.avatar.get('Address')) {
      setMsg('不能标记自己...')
      return
    }
    props.dispatch({
      type: actionType.avatar.addAddressMark,
      address: newAddress,
      name: newName
    })
    props.navigation.goBack()
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      if (props.route.params && props.route.params.address) {
        setAddress(props.route.params.address)
      }
    })
  })


  return (
    <View style={{
      ...styles.base_view,
      backgroundColor: theme.base_view
    }}>
      <TextInput
        placeholderTextColor={theme.text2}
        style={{
          ...styles.input_view,
          color: theme.text1
        }}
        placeholder="地址"
        value={address}
        onChangeText={text => setAddress(text)}
      />
      <WhiteSpace size='lg' />
      <TextInput
        placeholderTextColor={theme.text2}
        style={{
          ...styles.input_view,
          color: theme.text1
        }}
        placeholder="昵称"
        value={name}
        onChangeText={text => setName(text)}
      />
      <WhiteSpace size='lg' />
      {
        error_msg.length > 0 &&
        <View>
          <Text style={styles.required_text}>{error_msg}</Text>
          <WhiteSpace size='lg' />
        </View>
      }
      <Button
        style={styles.btn_high}
        type='primary'
        onPress={addAddressMark}
      >
        标记
      </Button>
    </View>
  )
}

const ReduxAddressAddScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(AddressAddScreen)

export default ReduxAddressAddScreen