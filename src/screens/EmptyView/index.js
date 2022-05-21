import React, { useContext } from 'react'
import { View, Text, Image } from 'react-native'
import { ThemeContext } from '../../theme/theme-context'

const EmptyView = ({ massage = '暂无数据', pTop }) => {
  const { theme } = useContext(ThemeContext)
  return (
    <View style={{
      alignItems: 'center',
      paddingTop: pTop || 150,
    }}>
      <Image source={require('../../assets/empty.png')}></Image>
      <Text style={{
        fontSize: 28,
        marginTop: 50,
        color: theme.text2
      }}>{massage}</Text>
    </View>
  )
}

export default EmptyView