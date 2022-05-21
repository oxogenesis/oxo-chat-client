import React, { useContext, useState, useEffect, useRef } from 'react'
import { Button, Flex, Toast } from '@ant-design/react-native'
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, FlatList, KeyboardAvoidingView } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { timestamp_format, AddressToName } from '../../lib/Util'
import { DefaultDivision } from '../../lib/Const'
import { DHSequence } from '../../lib/OXO'
import { actionType } from '../../redux/actions/actionType'
import { connect } from 'react-redux'
import Clipboard from '@react-native-clipboard/clipboard'
import { styles } from '../../theme/style'
import { ThemeContext } from '../../theme/theme-context'

//聊天会话界面
const SessionScreen = (props) => {
  const flatRef = useRef(null)
  const { theme } = useContext(ThemeContext)
  const [address, setAddress] = useState(props.route.params.address)
  const [name, setName] = useState('')
  const [message_input, setMsgInput] = useState('')
  const [refreshFlag, setRefreshFlag] = useState(false)

  const sendMessage = () => {
    let timestamp = Date.now()
    let newMessage_input = message_input.trim()
    if (message_input == "") {
      Toast.success('消息不能为空...', 1)
    } else {
      let ecdh_sequence = DHSequence(DefaultDivision, timestamp, props.avatar.get("Address"), address)
      let current_session = props.avatar.get("CurrentSession")
      if (ecdh_sequence != current_session.EcdhSequence) {
        Toast.success('握手未完成...', 1)
      } else {
        props.dispatch({
          type: actionType.avatar.SendFriendMessage,
          address: address,
          message: newMessage_input,
          timestamp: timestamp
        })
        flatRef.current.scrollToEnd()
        setMsgInput('')
      }
    }
  }

  const loadMessageList = (flag) => {
    props.dispatch({
      type: actionType.avatar.LoadCurrentMessageList,
      session_flag: flag,
      address: props.route.params.address
    })
  }

  const copyToClipboard = (content) => {
    Clipboard.setString(content)
    Toast.success('拷贝成功！', 1)
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      let name = AddressToName(props.avatar.get('AddressMap'), props.route.params.address)
      setAddress(props.route.params.address)
      setName(name)
      props.navigation.setOptions({ title: name })
      props.dispatch({
        type: actionType.avatar.LoadCurrentSession,
        address: props.route.params.address
      })

      let message_input = ''
      if (props.route.params.content != null) {
        message_input = JSON.stringify(props.route.params.content)
        // console.log(message_input)
      }
      setAddress(props.route.params.address)
      setName(name)
      setMsgInput(message_input)

      loadMessageList(true)

      flatRef.current.scrollToEnd()
    })
  })

  useEffect(() => {
    return props.navigation.addListener('blur', () => {
      props.dispatch({
        type: actionType.avatar.setCurrentSession
      })
    })
  })

  //向下拉，加载更到本地消息
  const refreshing = () => {
    if (refreshFlag) {
      console.log("现在正在刷新")
    } else {
      console.log("下拉加载")
      setRefreshFlag(true)
      loadMessageList(false)
      setRefreshFlag(false)
    }
  }

  const handleContentSizeChange = () => {
    flatRef.current.scrollToEnd()
  }

  const handleFocus = () => {
    setTimeout(() => {
      flatRef.current.scrollToEnd()
    }, 1000)
  }

  const data = props.avatar.get("CurrentMessageList")
  return (
    <View
      // behavior={Platform.OS == "ios" ? "padding" : "height"}
      // keyboardVerticalOffset={0}
      style={{
        ...styles.base_body2,
        backgroundColor: theme.base_view,
      }}>
      <FlatList
        style={{
          marginBottom: 60,
          padding: 6
        }}
        ref={flatRef}
        data={data}
        keyExtractor={item => item.Hash}
        refreshing={refreshFlag}
        onRefresh={refreshing}
        onContentSizeChange={handleContentSizeChange}
        renderItem={({ item }) => {
          if (item.SourAddress == address) {
            return (
              <View key={item.Hash}>
                <Flex justify="start" align="start">
                  <View>
                    <Image style={styles.img_md} source={require('../../assets/app.png')}></Image>
                  </View>
                  <View
                    style={styles.view1}
                  >
                    <Text>
                      <View>
                        <Text style={{
                          ...styles.text1,
                          color: theme.link_color,
                        }}
                        >{name}&nbsp;</Text>
                      </View>

                      <View style={{
                        borderWidth: 1,
                        borderColor: theme.border_color,
                        borderRadius: 6,
                        paddingLeft: 6,
                        paddingRight: 6,
                      }}>
                        <Text style={{
                          color: theme.text1,
                          fontSize: 16
                        }}>{item.Sequence}</Text>
                      </View>

                      <View>
                        <Text style={{
                          ...styles.date_text,
                          color: item.Confirmed ? '#434343' : theme.text2
                        }}>&nbsp;@{timestamp_format(item.Timestamp)}</Text>
                      </View>
                    </Text>
                    <View style={{
                      ...styles.mess_content,
                      borderTopLeftRadius: 0,
                      backgroundColor: item.Confirmed ? '#73d13d' : theme.base_body,
                    }}>
                      <View style={styles.text3}>
                        {
                          item.IsObject ?
                            <Text style={{
                              ...styles.text4,
                              color: theme.text1
                            }} onPress={() => props.navigation.push('Bulletin', {
                              address: item.ObjectJson.Address,
                              sequence: item.ObjectJson.Sequence,
                              hash: item.ObjectJson.Hash,
                              to: props.route.params.address
                            })}>
                              {`${AddressToName(props.avatar.get('AddressMap'), item.ObjectJson.Address)}#${item.ObjectJson.Sequence}`}

                            </Text>
                            : <TouchableOpacity onPress={() => { copyToClipboard(item.Content) }}>
                              <Text style={{
                                color: item.Confirmed ? '#141414' : theme.text1
                              }}>{item.Content}</Text>
                            </TouchableOpacity>
                        }
                      </View>
                    </View>
                  </View>
                </Flex>
              </View>
            )
          }

          return (
            <View
              key={item.Hash}>
              <Flex justify="end" align="start">
                <View style={styles.view1}>
                  <Text style={{
                    ...styles.view5,
                  }}>
                    <View>
                      <Text style={{
                        color: theme.link_color
                      }}
                      >{props.avatar.get('Name')}&nbsp;</Text>
                    </View>

                    <View style={{
                      borderWidth: 1,
                      borderColor: theme.border_color,
                      borderRadius: 6,
                      paddingLeft: 6,
                      paddingRight: 6,
                    }}>
                      <Text style={{
                        color: theme.text1,
                        fontSize: 16
                      }}>{item.Sequence}</Text>
                    </View>

                    <View>
                      <Text style={{
                        ...styles.date_text,
                        textAlign: 'right',
                        color: item.Confirmed ? '#434343' : theme.text2
                      }}>&nbsp;@{timestamp_format(item.Timestamp)}</Text>
                    </View>
                  </Text>
                  <View style={{
                    ...styles.mess_content,
                    marginRight: 12,
                    borderTopRightRadius: 0,
                    ...styles.my_mess,
                    backgroundColor: item.Confirmed ? '#73d13d' : theme.base_body,
                  }}>
                    <View style={styles.text3}>
                      {
                        item.IsObject ?
                          <Text style={styles.text4} onPress={() => props.navigation.push('Bulletin', {
                            address: item.ObjectJson.Address,
                            sequence: item.ObjectJson.Sequence,
                            hash: item.ObjectJson.Hash,
                            to: props.route.params.address
                          })}>
                            {`${AddressToName(props.avatar.get('AddressMap'), item.ObjectJson.Address)}#${item.ObjectJson.Sequence}`}
                          </Text>
                          : <TouchableOpacity onPress={() => { copyToClipboard(item.Content) }}>
                            <Text style={{
                              color: item.Confirmed ? '#141414' : theme.text1
                            }}>{item.Content}</Text>
                          </TouchableOpacity>
                      }
                    </View>
                  </View>
                </View>
                <View>
                  <Image style={{
                    width: 50,
                    height: 50,
                    borderRadius: 5,
                  }} source={require('../../assets/app.png')}></Image>
                </View>
              </Flex>

            </View>
          )
        }}
      />

      <View style={styles.send_view}>
        {
          props.avatar.get("CurrentSession").AesKey ?
            <Button
              style={{ flex: 0.2, ...styles.btn_high, borderRadius: 0 }}
              type='primary'
              onPress={() => sendMessage()}

            >发送</Button>
            :
            <Button
              style={{ flex: 0.2, ...styles.btn_high, borderRadius: 0 }}
              disabled={true}
            >发送</Button>
        }
        <TextInput
          placeholderTextColor={theme.text2}
          style={{
            ...styles.input_view,
            color: theme.text1,
            flex: 1,
            borderRadius: 0,
            backgroundColor: theme.base_body
          }}
          placeholder="消息"
          value={message_input}
          multiline={true}
          onFocus={handleFocus}
          onChangeText={text => setMsgInput(text)}
        />
      </View>
    </View>
  )
}

const ReduxSessionScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(SessionScreen)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxSessionScreen{...props} navigation={navigation} route={route} />
}