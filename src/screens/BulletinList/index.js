import React, { useContext, useEffect } from 'react'
import { View, Text, ScrollView, Image } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { BulletinAddressSession, BulletinHistorySession, BulletinMarkSession } from '../../lib/Const'
import { timestamp_format, AddressToName } from '../../lib/Util'
import { Flex, WhiteSpace } from '@ant-design/react-native'
import { styles } from '../../theme/style'
import { ThemeContext } from '../../theme/theme-context'
import EmptyView from '../EmptyView'


//公告列表

const BulletinListScreen = (props) => {
  const { theme } = useContext(ThemeContext)

  const loadBulletinList = (flag) => {
    if (props.route.params.session == BulletinMarkSession) {
      props.navigation.setOptions({ title: '收藏公告' })
    } else if (props.route.params.session == BulletinHistorySession) {
      props.navigation.setOptions({ title: '公告浏览历史' })
    } else if (props.route.params.session == BulletinAddressSession) {
      if (props.route.params.address == props.avatar.get('Address')) {
        props.navigation.setOptions({ title: '我的公告' })
      } else {
        props.navigation.setOptions({ title: `公告：${AddressToName(props.avatar.get('AddressMap'), props.route.params.address)}` })
      }
    }

    props.dispatch({
      type: actionType.avatar.LoadBulletinList,
      bulletin_list_flag: flag,
      session: props.route.params.session,
      address: props.route.params.address
    })
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      loadBulletinList(true)
    })
  })

  return (
    <ScrollView
      style={{
        backgroundColor: theme.base_body
      }}
      automaticallyAdjustContentInsets={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
      {
        props.avatar.get('BulletinList').length > 0 ? props.avatar.get('BulletinList').map((item, index) => (
          <View
            key={index}
            style={{
              ...styles.list_border,
              borderBottomColor: theme.split_line
            }}>
            <Flex justify="start" align="start">
              <Image style={styles.img_md} source={require('../../assets/app.png')}></Image>
              <View style={{
                marginLeft: 8,
              }}>
                <Text style={{
                  marginBottom: 6
                }}>
                  {
                    props.avatar.get('Address') == item.Address ? <View>
                      <Text style={{
                        ...styles.name2,
                        color: theme.link_color,
                      }}
                      >{AddressToName(props.avatar.get('AddressMap'), item.Address)}&nbsp;&nbsp;</Text>
                    </View> : <View>
                      <Text style={{
                        ...styles.name2,
                        color: theme.link_color,
                      }}
                        onPress={() => props.navigation.push('AddressMark', { address: item.Address })}
                      >{AddressToName(props.avatar.get('AddressMap'), item.Address)}&nbsp;</Text>
                    </View>
                  }
                  <Text onPress={() => props.navigation.push('Bulletin', { hash: item.Hash })}>
                    <View style={{
                      borderWidth: 1,
                      borderColor: theme.split_line,
                      borderRadius: 6,
                      paddingLeft: 6,
                      paddingRight: 6,

                    }}>
                      <Text style={{
                        color: theme.text1,
                        fontSize: 16
                      }}>{item.Sequence}</Text>
                    </View>
                  </Text>
                </Text>


                <View style={styles.content_view}>
                  <WhiteSpace size='lg' />
                  <Text style={{
                    ...styles.format_text1,
                    color: theme.text2
                  }}>{timestamp_format(item.Timestamp)}</Text>
                  {
                    item.QuoteSize != 0 && <Text style={{
                      ...styles.format_text2,
                      color: theme.text2
                    }}>
                      来自：◀{item.QuoteSize}</Text>
                  }
                </View>
                <View style={styles.content_view}>
                  <Text style={{
                    ...styles.content_text,
                    color: theme.text1
                  }}
                    onPress={() => props.navigation.push('Bulletin', { hash: item.Hash })}
                  >{item.Content}</Text>
                </View>
              </View>
            </Flex>
          </View>
        )) : <EmptyView />
      }
    </ScrollView >
  )
}

const ReduxBulletinListScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(BulletinListScreen)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxBulletinListScreen{...props} navigation={navigation} route={route} />
}