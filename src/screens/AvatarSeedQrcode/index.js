import React, { useContext, useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import QRCode from 'react-native-qrcode-svg'
import { WhiteSpace, Button } from '@ant-design/react-native'
import { styles } from '../../theme/style'
import { ThemeContext } from '../../theme/theme-context'
import AlertView from '../AlertView'

//地址标记
const AvatarSeedQrcodeScreen = (props) => {
  const { theme } = useContext(ThemeContext)
  const [qrcode, seQrcode] = useState('xxx')
  const [visible, showModal] = useState(false)

  const viewSeedAlert = () => {
    showModal(true)
  }

  const onClose = () => {
    showModal(false)
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      let json = { "Name": props.avatar.get('Name'), "Seed": props.avatar.get('Seed') }
      seQrcode(JSON.stringify(json))
    })
  })

  return (
    <View style={{
      ...styles.base_body,
      backgroundColor: theme.base_body
    }}>
      <View style={{ alignItems: 'center' }}>
        <QRCode
          value={qrcode}
          size={350}
          logo={require('../../assets/app.png')}
          logoSize={50}
          backgroundColor={theme.QR_code_view}
          color={theme.QR_code_text}
          logoBackgroundColor='grey'
        />
      </View>
      <WhiteSpace size='lg' />
      <Text style={{
        color: theme.text2
      }}>{`注意：查看种子二维码，应回避具备视觉的生物或设备，应在私密可控环境下。`}</Text>
      <WhiteSpace size='lg' />
      <Button type='primary' onPress={viewSeedAlert}>查看种子</Button>
      <AlertView
        visible={visible}
        onClose={onClose}
        msg="查看种子，应回避具备视觉的生物或设备，应在私密可控环境下。
  确定要查看种子吗？"
        onPress={() => props.navigation.navigate('AvatarSeed')}
      />
    </View >
  )
}

const ReduxAvatarSeedQrcodeScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(AvatarSeedQrcodeScreen)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxAvatarSeedQrcodeScreen{...props} navigation={navigation} route={route} />
}