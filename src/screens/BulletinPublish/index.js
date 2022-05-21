import React, { useContext, useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { AddressToName } from '../../lib/Util'
import { Button, List, WhiteSpace } from '@ant-design/react-native'
import { styles } from '../../theme/style'
import { ThemeContext } from '../../theme/theme-context'

//发布公告页面
const Item = List.Item
const BulletinPublishScreen = props => {
  const { theme } = useContext(ThemeContext)
  const [content, setContent] = useState('')
  const [error_msg, setMsg] = useState('')

  const publishBulletin = () => {
    let newContent = content.trim()
    if (newContent == '') {
      setMsg('公告不能为空...')
      return
    }
    props.dispatch({
      type: actionType.avatar.PublishBulletin,
      content: newContent
    })
    setContent('')
    setMsg('')
    props.navigation.goBack()
  }

  return (
    <View style={{
      ...styles.base_body1,
      backgroundColor: theme.base_view
    }}>
      <View style={{
        padding: 6
      }}>
        <TextInput
          placeholder="内容"
          value={content}
          multiline={true}
          onChangeText={text => setContent(text)}
          placeholderTextColor={theme.text2}
          numberOfLines={4}
          style={{
            ...styles.input_view,
            color: theme.text1,
            height: 200,
            textAlignVertical: 'top'
          }}
        />
        {
          error_msg.length > 0 &&
          <View>
            <Text style={styles.required_text}>{error_msg}</Text>
            <WhiteSpace size='lg' />
          </View>
        }
        <WhiteSpace size='lg' />
      </View>

      {
        props.avatar.get('QuoteList').map((item, index) => (
          <View key={item.Hash}>

            <Text style={{
              ...styles.link_list_text,
              color: theme.link_color,
              borderColor: theme.line,
            }} onPress={() => props.navigation.push('Bulletin', { hash: item.Hash })}>
              {AddressToName(props.avatar.get('AddressMap'), item.Address)}#{item.Sequence}
              {props.avatar.get('CurrentBulletin').QuoteList.length - 1 !== index && ','}
            </Text>
            <WhiteSpace size='lg' />
            <View style={{
              padding: 6,
            }}>
              <Text
                onPress={() => props.dispatch({
                  type: actionType.avatar.delQuote,
                  hash: item.Hash
                })}
                style={{
                  ...styles.cancel_text,
                  color: theme.link_color
                }}>取消引用</Text>
            </View>
            <WhiteSpace size='lg' />
          </View>
        ))
      }
      <View style={styles.base_view_a}>
        <Button
          style={styles.btn_high}
          type='primary'
          onPress={() => publishBulletin()}
        >发布</Button>
      </View>
    </View>
  )
}

const ReduxBulletinPublishScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(BulletinPublishScreen)

export default ReduxBulletinPublishScreen