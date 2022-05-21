import React, { useContext } from 'react'
import { View, Text } from 'react-native'
import { ThemeContext } from '../../theme/theme-context'
import { Modal } from '@ant-design/react-native'

const AlertView = ({ visible, title, msg, onClose, onPress }) => {
  const { theme } = useContext(ThemeContext)

  const footerButtons = [
    { text: '取消', onPress: onClose },
    { text: '确认', onPress: onPress },
  ]

  return (
    <Modal
      title={<Text style={{ color: theme.text1 }}>{title || '提示'}</Text>}
      transparent
      onClose={onClose}
      visible={visible}
      footer={footerButtons}
      style={{ backgroundColor: theme.base_body }}
    >
      <View style={{ paddingVertical: 20 }}>
        <Text style={{ textAlign: 'center', color: theme.text1 }}>{msg}</Text>
      </View>
    </Modal>
  )
}

export default AlertView