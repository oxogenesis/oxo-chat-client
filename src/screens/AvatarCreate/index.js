import React, { useContext, useState } from 'react'
import { View, Text, TextInput } from 'react-native'
import { Button, WhiteSpace } from '@ant-design/react-native'
import { AvatarCreateNew } from '../../lib/OXO'
import { connect } from 'react-redux'
import { styles } from '../../theme/style'
import { ThemeContext } from '../../theme/theme-context'

//口令创建账户
const AvatarCreateScreen = (props) => {
  const { theme } = useContext(ThemeContext)
  const [name, setName] = useState('')
  const [error_msg, setMsg] = useState('')

  const createAvatar = () => {
    if (name == '') {
      setMsg('昵称不能为空...')
      return
    }
    AvatarCreateNew(name, props.master.get('MasterKey'))
      .then(result => {
        if (result) {
          setMsg('')
          setName('')
          props.navigation.navigate('AvatarList')
        }
      })
  }

  return (
    <View style={{
      ...styles.base_view,
      backgroundColor: theme.base_view
    }}>
      <WhiteSpace />
      <TextInput
        placeholder="昵称"
        placeholderTextColor={theme.text2}
        style={{
          ...styles.input_view,
          color: theme.text1,
        }}
        value={name}
        onChangeText={text => setName(text)}
      />
      <WhiteSpace size='lg' />
      {
        error_msg.length > 0 &&
        <View>
          <Text style={{ color: 'red' }}>{error_msg}</Text>
          <WhiteSpace size='lg' />
        </View>
      }
      <Button style={{
        height: 55
      }} type='primary' onPress={() => createAvatar()}>
        生成
      </Button>
    </View>
  )

}

const ReduxAvatarCreateScreen = connect((state) => {
  return {
    master: state.master
  }
})(AvatarCreateScreen)

export default ReduxAvatarCreateScreen