import React, { useContext, useState, useEffect } from 'react'
import { View, Text, TextInput } from 'react-native'
import { Button, WhiteSpace } from '@ant-design/react-native'
import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { MasterKeyDerive } from '../../lib/OXO'
import { ThemeContext } from '../../theme/theme-context'
import { styles } from '../../theme/style'

//Unlock界面
const UnlockScreen = (props) => {
  const { theme } = useContext(ThemeContext)
  const [master_key, setKey] = useState('')
  const [error_msg, setMsg] = useState('')

  const unlock = () => {
    MasterKeyDerive(master_key)
      .then(result => {
        if (result) {
          props.dispatch({
            type: actionType.master.setMasterKey,
            master_key: master_key
          })
          setKey('')
          setMsg('')
          props.navigation.navigate('AvatarList')
        } else {
          setKey('')
          setMsg('invalid MasterKey...')
        }
      })
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      if (props.master.get('MasterKey') != null) {
        // 强制安全退出：加载此页面，置空MasterKey
        props.dispatch({
          type: actionType.master.setMasterKey,
          MasterKey: null
        })
      }
      setKey('')
      setMsg('')
    })
  })


  return (
    <View style={{
      ...styles.base_view,
      backgroundColor: theme.base_view
    }}>
      <TextInput
        placeholderTextColor={theme.text1}
        style={{
          ...styles.input_view,
          color: theme.text1,
          borderColor: theme.border_color
        }}
        secureTextEntry={true}
        placeholder="口令"
        value={master_key}
        onChangeText={text => setKey(text)}
      />

      <WhiteSpace size='lg' />
      {
        error_msg.length > 0 &&
        <View>
          <Text style={styles.required_text}>{error_msg}</Text>
          <WhiteSpace size='lg' />
        </View>
      }
      <Button style={styles.btn_high} type='primary' onPress={unlock}><Text>解锁</Text></Button>
    </View>
  )
}

const ReduxUnlockScreen = connect((state) => {
  return {
    master: state.master
  }
})(UnlockScreen)

export default ReduxUnlockScreen