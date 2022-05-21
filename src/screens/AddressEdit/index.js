import React, { useContext, useState } from 'react'
import { View, Text, TextInput } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { WhiteSpace, Button } from '@ant-design/react-native'
import { styles } from '../../theme/style'
import { ThemeContext } from '../../theme/theme-context'
import { AddressToName } from '../../lib/Util'

//地址标记
const AddressEditScreen = (props) => {
  const [address, setAddress] = useState(props.route.params.address)
  const [name, setName] = useState(AddressToName(props.avatar.get('AddressMap'), props.route.params.address))
  const [error_msg, setMsg] = useState('')
  const { theme } = useContext(ThemeContext)

  const saveAddressName = () => {
    let address = address
    let newName = name.trim()
    if (name == '') {
      setMsg('name could not be blank...')
      return
    }
    props.dispatch({
      type: actionType.avatar.saveAddressName,
      address: address,
      name: newName
    })
    props.navigation.goBack()
  }

  return (
    <View style={{
      ...styles.base_view,
      backgroundColor: theme.base_body
    }}>
      <Text style={{
        color: theme.text1
      }}>地址：{address}</Text>
      <WhiteSpace size='lg' />
      <TextInput
        placeholderTextColor={theme.text2}
        style={{
          ...styles.input_view,
          color: theme.text1
        }}
        placeholder="昵称"
        value={name}
        multiline={false}
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
        onPress={saveAddressName}
      >保存</Button>
    </View>
  )
}

const ReduxAddressEditScreen = connect((state) => {
  return {
    master: state.master,
    avatar: state.avatar
  }
})(AddressEditScreen)

//export default AddressEditScreen
export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxAddressEditScreen{...props} navigation={navigation} route={route} />
}