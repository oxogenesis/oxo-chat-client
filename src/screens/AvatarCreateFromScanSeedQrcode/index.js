import React, { useContext } from 'react'
import { Text } from 'react-native'
import { connect } from 'react-redux'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { RNCamera } from 'react-native-camera'
import { ParseQrcodeSeed, AvatarCreateWithSeed } from '../../lib/OXO'
import { ThemeContext } from '../../theme/theme-context'

const AvatarCreateFromScanSeedQrcode = (props) => {
  const { theme } = useContext(ThemeContext)

  const onSuccess = (e) => {
    let result = ParseQrcodeSeed(e.data)
    if (result != false) {
      AvatarCreateWithSeed(result.Name, result.Seed, props.master.get('MasterKey'))
        .then(result => {
          if (result) {
            props.navigation.replace('AvatarList')
          }
        })
    }
  }

  return (
    <QRCodeScanner
      onRead={(e) => (onSuccess(e))}
      reactivate={true}
      reactivateTimeout={1500}
      flashMode={RNCamera.Constants.FlashMode.auto}
      showMarker={true}
      topContent={
        <Text style={{
          flex: 1,
          fontSize: 18,
          padding: 32,
          color: theme.base_body,
          backgroundColor: theme.base_body
        }}>
          .................................................................................................................................
        </Text>
      }
      bottomContent={
        <Text style={{
          flex: 1,
          fontSize: 18,
          padding: 32,
          color: theme.base_body,
          backgroundColor: theme.base_body
        }}>
          .................................................................................................................................
        </Text>
      }
    />
  )
}

const ReduxAvatarCreateFromScanSeedQrcode = connect((state) => {
  return {
    master: state.master
  }
})(AvatarCreateFromScanSeedQrcode)

export default ReduxAvatarCreateFromScanSeedQrcode