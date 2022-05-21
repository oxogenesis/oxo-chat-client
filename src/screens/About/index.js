import React, { useContext, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { Toast } from '@ant-design/react-native'
import { ThemeContext } from '../../theme/theme-context'
import Clipboard from '@react-native-clipboard/clipboard'
import AlertView from '../AlertView'

//地址标记
const AboutScreen = (props) => {

  const { theme } = useContext(ThemeContext)

  const copyChatClient = () => {
    Toast.success('拷贝成功！', 1)
    Clipboard.setString('https://github.com/oxogenesis/oxo-chat-client')
  }

  const copyChatServer = () => {
    Toast.success('拷贝成功！', 1)
    Clipboard.setString('https://github.com/oxogenesis/oxo-chat-server')
  }

  const copyWiki = () => {
    Toast.success('拷贝成功！', 1)
    Clipboard.setString('https://github.com/oxogenesis/oxo-chat-client/wiki')
  }

  const copyWallet = () => {
    Toast.success('拷贝成功！', 1)
    Clipboard.setString('https://github.com/oxogenesis/oxo-chat-wallet')
  }

  return (
    <View style={{
      backgroundColor: theme.base_view,
      height: '100%'
    }}>
      <TouchableOpacity onPress={() => { copyChatClient() }}>
        <Text style={{ color: theme.text2, fontWeight: 'bold' }}>
          {`客户端源码：https://github.com/oxogenesis/oxo-chat-client`}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { copyChatServer() }}>
        <Text style={{ color: theme.text2, fontWeight: 'bold' }}>
          {`服务端源码：https://github.com/oxogenesis/oxo-chat-server`}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { copyWiki() }}>
        <Text style={{ color: theme.text2, fontWeight: 'bold' }}>
          {`wiki：https://github.com/oxogenesis/oxo-chat-client/wiki`}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { copyWallet() }}>
        <Text style={{ color: theme.text2, fontWeight: 'bold' }}>
          {`钱包：https://github.com/oxogenesis/oxo-wallet`}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const ReduxAboutScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(AboutScreen)

export default ReduxAboutScreen