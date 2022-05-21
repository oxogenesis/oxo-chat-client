import React, { useContext } from 'react'
import { Text } from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { RNCamera } from 'react-native-camera'
import { ParseQrcodeAddress } from '../../lib/OXO'
import { ThemeContext } from '../../theme/theme-context'

const AddressScanScreen = (props) => {

  const { theme } = useContext(ThemeContext)

  const onSuccess = (e) => {
    let result = ParseQrcodeAddress(e.data)
    if (result != false) {
      props.navigation.replace('AddressAddFromQrcode', { qrcode: result })
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

export default AddressScanScreen