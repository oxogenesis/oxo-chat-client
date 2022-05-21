import React, { useContext, useEffect, useState } from 'react'
import { View, ScrollView, RefreshControl, Text, Image, TouchableOpacity } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { Icon, WhiteSpace, Toast, Popover } from '@ant-design/react-native'
import { timestamp_format, AddressToName } from '../../lib/Util'
import Clipboard from '@react-native-clipboard/clipboard'
import { Flex } from '@ant-design/react-native'
import { styles } from '../../theme/style'
import { ThemeContext } from '../../theme/theme-context'

//公告列表
const BulletinRandomScreen = (props) => {
  const { theme } = useContext(ThemeContext)
  const random = props.avatar.get('RandomBulletin')
  const [refreshFlag, setRefreshFlag] = useState(false)
  const [show, setShow] = useState('0')

  const markBulletin = (hash) => {
    props.dispatch({
      type: actionType.avatar.MarkBulletin,
      hash: hash
    })
  }

  const unmarkBulletin = (hash) => {
    props.dispatch({
      type: actionType.avatar.UnmarkBulletin,
      hash: hash
    })
  }

  const quoteBulletin = (address, sequence, hash) => {
    props.dispatch({
      type: actionType.avatar.addQuote,
      address: address,
      sequence: sequence,
      hash: hash
    })
  }

  const copyToClipboard = () => {
    Clipboard.setString(random.Content)
    Toast.success('拷贝成功！', 1)
    setShow(Math.random())
  }

  const quote = () => {
    Toast.success('引用成功！', 1)
    setShow(Math.random())
  }

  const loadRandomBulletin = () => {
    props.dispatch({
      type: actionType.avatar.setRandomBulletinFlag,
      flag: true
    })
    props.dispatch({
      type: actionType.avatar.FetchRandomBulletin
    })
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      loadRandomBulletin()
    })
  })

  useEffect(() => {
    return props.navigation.addListener('blur', () => {
      props.dispatch({
        type: actionType.avatar.setRandomBulletinFlag,
        flag: false
      })
    })
  })

  //向下拉，从服务器请求更多公告
  const refreshing = () => {
    if (refreshFlag) {
      console.log("现在正在刷新")
    } else {
      console.log("下拉刷新")
      setRefreshFlag(true)
      loadRandomBulletin()
      setRefreshFlag(false)
    }
  }

  const handleCollection = () => {
    markBulletin(random.Hash)
    Toast.success('收藏成功！', 1)
    setShow(Math.random())
  }

  const cancelCollection = () => {
    unmarkBulletin(random.Hash)
    Toast.success('取消收藏！', 1)
    setShow(Math.random())
  }

  return (
    <View style={{
      ...styles.base_body,
      backgroundColor: theme.base_body
    }}>
      {
        random == null ?
          <Text style={{ color: theme.text2 }}>公告不存在，正在获取中，请稍后查看...</Text>
          :
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshFlag}
                onRefresh={() => refreshing()}
                colors={['red', 'green', 'blue']}
                title="正在加载中..."
              />
            }
          >
            <View style={{
              backgroundColor: theme.base_body
            }}>
              <Flex justify="start" align="start">
                <TouchableOpacity
                  onPress={() => props.navigation.push('AddressMark',
                    { address: random.Address })}
                >
                  <Image style={styles.img_md} source={require('../../assets/app.png')}></Image>
                </TouchableOpacity>

                <View style={{
                  marginLeft: 8
                }}>
                  <Text>
                    <View>
                      <Text style={{
                        ...styles.name2,
                        color: theme.link_color,
                      }}
                        onPress={() => props.navigation.push('AddressMark',
                          { address: random.Address })}
                      >{AddressToName(props.avatar.get('AddressMap'), random.Address)}&nbsp;&nbsp;</Text>
                    </View>
                    <Text>
                      <View style={{
                        borderWidth: 1,
                        borderColor: theme.split_line,
                        borderRadius: 6,
                        paddingLeft: 6,
                        paddingRight: 6,
                      }}>
                        <Text style={{
                          color: theme.text1,
                          fontSize: 18
                        }}>{`#${random.Sequence}`}</Text>
                      </View>
                    </Text>
                  </Text>
                  <Text style={styles.desc_view}>
                    {timestamp_format(random.Timestamp)}
                  </Text>

                  <View style={styles.content_view}>
                    <Text style={{
                      ...styles.content_text,
                      color: theme.text1
                    }}>
                      {random.Content}
                    </Text>
                  </View>
                  <WhiteSpace size='lg' />
                  <View style={styles.content_view}>
                    <Text style={styles.desc_view}>
                    </Text>
                    <Popover
                      key={show}
                      overlay={
                        <Popover.Item
                          style={{
                            backgroundColor: '#434343',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            borderRadius: 5,
                            borderColor: '#434343',
                          }}
                        >
                          {
                            random.IsMark == "TRUE" &&
                            <TouchableOpacity onPress={cancelCollection}>
                              <View style={styles.icon_view}>
                                <Icon
                                  color='red'
                                  name="star" size="md"
                                />
                                <Text style={styles.icon_text}>取消收藏</Text>
                              </View>
                            </TouchableOpacity>
                          }
                          {
                            random.IsMark == "FALSE" &&
                            <TouchableOpacity onPress={handleCollection}>
                              <View style={styles.icon_view}>
                                <Icon
                                  name='star'
                                  size="md"
                                  color='#fff'
                                />
                                <Text style={styles.icon_text}>收藏</Text>
                              </View>
                            </TouchableOpacity>

                          }

                          <TouchableOpacity onPress={() => {
                            quoteBulletin(random.Address,
                              random.Sequence,
                              random.Hash)
                            quote()
                          }
                          }
                          >
                            <View style={styles.icon_view}>
                              <Icon
                                name='link'
                                size="md"
                                color='#fff' />
                              <Text style={styles.icon_text}>引用</Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => {
                            props.navigation.push('AddressSelect', {
                              content: {
                                ObjectType: "Bulletin",
                                Address: random.Address,
                                Sequence: random.Sequence,
                                Hash: random.Hash
                              }

                            })
                            setShow(Math.random())
                          }

                          }>
                            <View style={styles.icon_view}>
                              <Icon
                                name='branches'
                                size="md"
                                color='#fff'

                              />
                              <Text style={styles.icon_text}>分享</Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => {
                            copyToClipboard()
                          }}>
                            <View style={styles.icon_view}>
                              <Icon
                                name='block'
                                color='#fff'
                                size="md"
                              />
                              <Text style={styles.icon_text}>拷贝</Text>
                            </View>
                          </TouchableOpacity>
                        </Popover.Item>
                      }
                    >
                      <Text style={{
                        fontSize: 24,
                        backgroundColor: theme.icon_view,
                        lineHeight: 20,
                        width: 32,
                        height: 25,
                        textAlign: 'center',
                        color: theme.text1
                      }}>...</Text>
                    </Popover>
                  </View>
                  <WhiteSpace />


                </View>
              </Flex>
            </View>

            {
              random.QuoteList != undefined &&
              <>
                {
                  random.QuoteList.length > 0 &&
                  <View style={{
                    ...styles.link_list,
                    backgroundColor: theme.tab_view
                  }}>
                    {
                      random.QuoteList.map((item, index) => (
                        <View
                          key={index}
                          style={{
                            borderWidth: 1,
                            borderColor: theme.split_line,
                            borderRadius: 6,
                            paddingLeft: 6,
                            paddingRight: 6,
                          }}>
                          <Text
                            style={{
                              color: theme.text1,
                              fontSize: 18
                            }}>
                            {`${AddressToName(props.avatar.get('AddressMap'), item.Address)}#${item.Sequence}`}
                          </Text>
                        </View>
                      ))
                    }
                  </View>
                }
              </>
            }
          </ScrollView>
      }
    </View>
  )
}


const ReduxBulletinRandomScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(BulletinRandomScreen)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxBulletinRandomScreen{...props} navigation={navigation} route={route} />
}