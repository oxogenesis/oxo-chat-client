import React, { useContext } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { ThemeContext } from '../../theme/theme-context'
import styles from './style'

const BaseList = ({ data = [] }) => {
  const { theme } = useContext(ThemeContext)

  const imgMap = (type, backgroundColor) => {
    if (type === 'sys') {
      return <View style={{
        ...styles.img,
        backgroundColor: backgroundColor
      }}><Image style={{
        width: 32,
        height: 32
      }} source={require(`../../assets/sys.png`)}></Image></View>

    } else if (type === 'add') {
      return <View style={{
        ...styles.img,
        backgroundColor: backgroundColor
      }}><Image style={{
        width: 32,
        height: 32
      }} source={require(`../../assets/add.png`)}></Image></View>
    } else {
      return <Image style={styles.img1} source={require(`../../assets/app.png`)}></Image>
    }
  }

  return (
    <View>
      {
        data.map((item, index) => (
          <TouchableOpacity key={index} onPress={item.onpress}>
            <View style={{
              ...styles.item,
              backgroundColor: theme.base_body,
              borderColor: theme.line,
              flexDirection: 'row'
            }}>
              {
                imgMap(item.img, item.backgroundColor)
              }
              <Text style={{
                color: theme.text1,
                ...styles.text,
                flex: 0.6
              }}>{item.title}</Text>
              {
                item.desc && <Text style={{
                  color: theme.text2,
                  lineHeight: 55,
                  textAlign: 'right',
                  flex: 0.4
                }}>{item.desc}</Text>
              }
            </View>


          </TouchableOpacity>
        ))
      }
    </View>
  )
}

export default BaseList