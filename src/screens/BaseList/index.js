import React, { useContext } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Icon, Switch } from '@ant-design/react-native'
import { ThemeContext } from '../../theme/theme-context'
import styles from './style'

const BaseList = ({ data }) => {
  const { theme } = useContext(ThemeContext)

  const renderContent = (item) => {
    if (item.type === 'radio') {
      return (
        <View style={styles.item_icon_view}>
          <Text style={styles.item_icon_text}>{item.desc && item.desc}
            {item.isShowIcon && <Icon color='#096dd9' name='check' size="md" />}
          </Text>
        </View>
      )
    }

    if (item.type === 'switch') {
      return (<View style={styles.item_switch}>
        <Switch style={{
          marginTop: 18
        }} checked={item.checked} onChange={item.onChange} />
      </View>)
    }

    return (
      <View style={styles.item_icon_view}>
        <Text style={styles.item_icon_text}>{item.desc && item.desc}<Icon name={item.icon || 'right'} size="xs" /></Text>
      </View>
    )
  }

  return (
    <View>
      {
        data.map((item, index) => (
          <TouchableOpacity key={index} onPress={item.onpress}>
            <View style={{
              ...styles.item,
              backgroundColor: theme.base_body,
              borderBottomColor: theme.line
            }}
            >
              <View style={styles.item_title_view}>
                <Text numberOfLines={1} style={{
                  ...styles.item_title_text,
                  color: theme.text1
                }}>{item.title}
                </Text>
              </View>
              {
                renderContent(item)
              }
            </View>
          </TouchableOpacity>
        ))
      }
    </View>
  )
}

export default BaseList