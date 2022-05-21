import React, { useContext, useState } from 'react'
import { View, Text, TextInput, FlatList } from 'react-native'

import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { styles } from '../../theme/style'
import { ThemeContext } from '../../theme/theme-context'
import AlertView from '../AlertView'

import { Button, WhiteSpace } from '@ant-design/react-native'

//网络设置
const SettingNetworkScreen = (props) => {
  const [host_input, setHost] = useState('')
  const [error_msg, setMsg] = useState('')
  const [visible, showModal] = useState(false)
  const [host1, setHostData] = useState()
  const { theme } = useContext(ThemeContext)

  const addHost = () => {
    let host_input1 = host_input.trim()
    let regx = /^ws[s]?:\/\/.+/
    let rs = regx.exec(host_input1)
    if (rs == null) {
      setMsg('地址格式无效...')
    } else {
      props.dispatch({
        type: actionType.avatar.addHost,
        host: host_input1
      })
      setHost('')
      setMsg('')
    }
  }

  const changeCurrentHost = (host) => {
    props.dispatch({
      type: actionType.avatar.changeCurrentHost,
      host: host
    })
  }

  const delHostAlert = (host) => {
    showModal(true)
    setHostData(host)
  }

  const delHost = (host) => {
    props.dispatch({
      type: actionType.avatar.delHost,
      host: host
    })
  }

  const onClose = () => {
    showModal(false)
  }

  return (
    <View style={{
      ...styles.base_view,
      backgroundColor: theme.base_view,
      padding: 0,
    }}>
      {
        !props.avatar.get('ConnStatus') && <View style={{
          alignItems: 'center',
          backgroundColor: theme.off_line_view,
          height: 55,
          lineHeight: 55,
        }} >
          <Text style={{
            lineHeight: 55,
            fontSize: 16,
            color: theme.off_line_text
          }}>
            当前网络不可用，请检查你的网络设置
          </Text>
        </View>
      }

      <WhiteSpace size='md' />
      <View style={{
        paddingLeft: 6,
        paddingRight: 6
      }}>
        <TextInput
          placeholder="ws://或者wss://"
          value={host_input}
          onChangeText={setHost}
          placeholderTextColor={theme.text2}
          style={{
            ...styles.input_view,
            color: theme.text1,
            backgroundColor: theme.base_body
          }}
        />
        <WhiteSpace size='md' />
        {
          error_msg.length > 0 &&
          <View>
            <Text style={{ color: 'red' }}>{error_msg}</Text>
            <WhiteSpace size='lg' />
          </View>
        }
        <Button type='primary' style={{
          height: 55
        }} onPress={addHost}>设置</Button>
        <WhiteSpace size='md' />
        <FlatList
          data={props.avatar.get('HostList')}
          keyExtractor={item => item.Address}
          ListEmptyComponent={
            <Text style={{
              paddingLeft: 12,
              color: theme.text2,
              borderBottomWidth: 1,
              borderColor: theme.line,
              paddingBottom: 12,
            }}>
              暂未设置服务器地址...
            </Text>
          }
          renderItem={
            ({ item }) => {
              return (
                <View style={{
                  flexDirection: "row",
                  paddingTop: 5,
                  height: 55,
                  borderBottomWidth: 1,
                  borderColor: theme.line,
                  backgroundColor: theme.base_body,
                  paddingLeft: 6,
                  paddingRight: 6
                }} >
                  <View style={{
                    flex: 0.7,
                  }} >
                    <Text style={{
                      lineHeight: 55,
                      color: theme.text1,
                    }}>{item.Address}</Text>
                  </View>
                  {
                    item.Address == props.avatar.get('CurrentHost') ?
                      <View style={{ flex: 0.25 }} >
                        <Text style={{
                          lineHeight: 45,
                          color: 'green',
                          textAlign: 'right'
                        }}>
                          当前正在使用
                        </Text>
                      </View>
                      :
                      <>
                        <View style={{ flex: 0.25 }} >
                          <Text style={{
                            textAlign: 'right'
                          }}>
                            <Button type='primary' onPress={() => changeCurrentHost(item.Address)} style={{
                              height: 40,
                              marginTop: 4,
                              width: 70,
                            }}>使用</Button>
                          </Text>
                        </View>
                        <View style={{ flex: 0.25 }} >
                          <Text style={{
                            textAlign: 'right'
                          }}>
                            <Button onPress={() => delHostAlert(item.Address)} type='warning' style={{
                              height: 40,
                              marginTop: 4,
                              width: 70,
                            }}>删除</Button>
                          </Text>
                        </View>
                      </>
                  }
                </View>
              )
            }
          }
        >
        </FlatList >
      </View>
      <AlertView
        visible={visible}
        onClose={onClose}
        msg={`你确定要删除${host1}吗?`}
        onPress={() => delHost(host1)}
      />
    </View>
  )

}


const ReduxSettingNetworkScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(SettingNetworkScreen)

export default ReduxSettingNetworkScreen