import React, { useContext, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { Toast } from '@ant-design/react-native'
import { ThemeContext } from '../../theme/theme-context'
import Clipboard from '@react-native-clipboard/clipboard'
import AlertView from '../AlertView'

//地址标记
const AvatarSeedScreen = (props) => {

  const [seed, setSeed] = useState(props.avatar.get('Seed'))
  const [visible, showModal] = useState(false)
  const { theme } = useContext(ThemeContext)

  const copyToClipboard = () => {
    Toast.success('拷贝成功！', 1)
    Clipboard.setString(seed)
  }

  const copySeedAlert = () => {
    showModal(true)
  }

  const onClose = () => {
    showModal(false)
  }

  return (
    <View style={{
      backgroundColor: theme.base_view,
      height: '100%'
    }}>
      <TouchableOpacity onPress={() => { copySeedAlert() }}>
        <Text style={{ color: 'red', fontWeight: 'bold' }}>
          {props.avatar.get('Seed')}
        </Text>
      </TouchableOpacity>
      <Text style={{
        color: theme.text2
      }}>{`注意：查看种子，应回避具备视觉的生物或设备，应在私密可控环境下。`}</Text>
      <AlertView
        visible={visible}
        onClose={onClose}
        msg='确定要复制种子吗？'
        onPress={copyToClipboard}
      />
    </View>
  )
}

const ReduxAvatarSeedScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(AvatarSeedScreen)

export default ReduxAvatarSeedScreen