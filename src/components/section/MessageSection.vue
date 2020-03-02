<template>
  <div class="message-section" id="message-section">
    <h3 v-if="getCurrentSession[0] == 'o'" class="message-session-heading">{{ getNameByAddress(getCurrentSession) }}</h3>
    <h3 v-if="getCurrentSession != '' && getCurrentSession[0] != 'o'" class="message-session-heading">群:{{ this.$store.state.OXO.Groups[getCurrentSession] }}</h3>
    <ul class="message-list" ref="list">
      <message v-for="(message,index) in this.$store.state.OXO.Messages" :key="index" :message="message">
      </message>
    </ul>
    <div class="message-composer-wrapper">
      <div @keydown="addKeyBoaderEvent($event)">
        <el-input type="textarea" placeholder="按enter发送，shift+enter换行" class="message-composer" v-model="content" ref="sendTextarea"></el-input>
      </div>
      <div class="message-composer-bottom">
        <el-button class="btnSendText" size="mini" type="primary" @click="sendTextMessage()" ref="btnSendText">{{btnSendText}}</el-button>
        <el-button v-show="showSendFile" class="btnSendFile" size="mini" type="primary" @click="sendFileMessage()" ref="btnSendFile">{{btnSendFile}}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import Message from './Message.vue'
import { mapActions, mapGetters } from 'vuex'
import { DHSequence } from '../../utils/oxo.js'

const remote = window.require('electron').remote
const dialog = remote.dialog
const fs = window.require("fs")
const path = window.require("path")

export default {
  name: 'MessageSection',
  components: { Message },
  data() {
    return {
      content: '',
      lastMessage: null,
      btnSendText: "",
      btnSendFile: "",
      showSendFile: false,
      myAddress: this.$store.state.OXO.Address
    }
  },
  props: {},
  updated: function() {
    let len = this.$store.state.OXO.Messages.length,
      newLastMessage = {}
    if (len > 0) {
      newLastMessage = this.$store.state.OXO.Messages[len - 1]
    }
    if (this.lastMessage != newLastMessage) {
      this.lastMessage = newLastMessage
      const ul = this.$refs.list
      ul.scrollTop = ul.scrollHeight
    }
  },
  computed: {
    ...mapGetters({
      currentChatKey: 'currentChatKey',
      getNameByAddress: 'getNameByAddress',
      getMessages: 'getMessages',
      getWSState: 'getWSState',
      getCurrentSession: 'getCurrentSession'
    }),
    messageData: function() {
      return this.$store.state.OXO.Messages
    }
  },
  mounted() {
    this.$refs.list.addEventListener('scroll', () => {
      if (this.$refs.list.scrollTop == 0) {
        this.$store.commit({
          type: 'LoadMoreMessage'
        })
      }
    }, false)

    if (this.$store.state.OXO.CurrentSession[0] == 'o') {
      //private-chat
      if (this.$store.state.OXO.CurrentChatKey == '') {
        this.btnSendText = '协商密钥'
        this.showSendFile = false
      } else {
        this.btnSendText = '发送'
        this.btnSendFile = '发送文件'
        this.showSendFile = true
      }
    } else {
      //group-chat
      this.btnSendText = '发送'
      this.btnSendFile = '发送文件'
    }

    if (this.$store.state.OXO.WSState == 1) {
      this.$refs.btnSendText.disabled = false
      this.$refs.btnSendFile.disabled = false
    } else {
      this.$refs.btnSendText.disabled = true
      this.$refs.btnSendFile.disabled = true
    }
  },
  methods: {
    //enter或者ctr+enter提交，shift+enter换行
    addKeyBoaderEvent(event) {
      let sendTextarea = this.$refs.sendTextarea,
        self = this
      if (event.shiftKey && event.keyCode == 13) {
        return false
      } else if (event.ctrlKey && event.keyCode == 13) {
        event.returnValue = false
        self.sendTextMessage()
        return false
      } else if (event.keyCode == 13) {
        event.returnValue = false
        this.sendTextMessage()
        return false
      }
    },
    sendTextMessage() {
      if (this.$store.state.OXO.CurrentSession == '') {
        return
      }

      let timestamp = Date.now()
      let self = this
      if (this.$store.state.OXO.CurrentSession[0] == 'o') {
        //private-chat
        if (this.btnSendText == '协商密钥') {
          this.$store.commit('Handshake', this.$store.state.OXO.CurrentSession)
          self.$message({
            showClose: true,
            message: '如果10秒内无响应，说明对方不在线'
          })
        } else if (this.btnSendText == '发送') {
          //check handshake
          let division = this.$store.state.OXO.DefaultDivision
          let sequence = DHSequence(division, timestamp, this.$store.state.OXO.Address, this.$store.state.OXO.CurrentSession)

          if (sequence != this.$store.state.OXO.CurrentChatKeySequence || this.$store.state.OXO.CurrentChatKey == "") {
            //如果会话密钥为空
            //或会话时间区间编号不符
            //则再次协商会话密钥
            this.btnSendText = '协商密钥'
            this.showSendFile = false
            this.$store.commit('Handshake', this.$store.state.OXO.CurrentSession)
          } else {
            if (this.content.trim() == "") {
              self.$message({
                showClose: true,
                message: '消息不能为空!',
                type: 'warning'
              })
            } else {
              let promise = this.$store.dispatch({
                type: 'DeliverTextMessage',
                timestamp: timestamp,
                chatKey: this.$store.state.OXO.CurrentChatKey,
                address: this.$store.state.OXO.CurrentSession,
                content: this.content
              })
              promise.then(() => {
                this.content = ''
                const ul = this.$refs.list
                ul.scrollTop = ul.scrollHeight
              })
            }
          }
        }
      } else {
        //group-chat
        if (this.content.trim() == "") {
          self.$message({
            showClose: true,
            message: '消息不能为空!',
            type: 'warning'
          })
        } else {
          let promise = this.$store.dispatch({
            type: 'DeliverGroupTextMessage',
            timestamp: timestamp,
            group_hash: this.$store.state.OXO.CurrentSession,
            content: this.content
          })
          promise.then(() => {
            this.content = ''
            const ul = this.$refs.list
            ul.scrollTop = ul.scrollHeight
          })
        }
      }
    },
    sendFileMessage() {
      let self = this
      dialog.showOpenDialog({
        title: "浏览文件"
      }, filename => {
        try {
          let stats = fs.statSync(filename[0])
          //console.log(stats)
          if (stats.isFile() && stats.size > 0) {
            let fileToPublish = filename[0]
            //console.log(fileToPublish)

            let stats = fs.statSync(fileToPublish)
            if (stats.isFile() && stats.size > 0) {
              let pathJson = path.parse(fileToPublish)
              if (pathJson["ext"] == '.exe') {
                self.$message({
                  showClose: true,
                  message: '不能发生可执行文件',
                  type: 'warning'
                })
              } else {
                if (self.$store.state.OXO.CurrentSession == '') {
                  return
                }

                let timestamp = Date.now()
                if (self.$store.state.OXO.CurrentSession[0] == 'o') {
                  //private-chat
                  if (self.btnSendText == '协商密钥') {
                    self.showSendFile = false
                  } else if (self.btnSendText == '发送') {
                    //check handshake
                    let division = self.$store.state.OXO.DefaultDivision
                    let sequence = DHSequence(division, timestamp, self.$store.state.OXO.Address, self.$store.state.OXO.CurrentSession)

                    if (sequence != self.$store.state.OXO.CurrentChatKeySequence || self.$store.state.OXO.CurrentChatKey == "") {
                      //如果会话密钥为空
                      //或会话时间区间编号不符
                      //则再次协商会话密钥
                      self.btnSendText = '协商密钥'
                      self.showSendFile = false
                      self.$store.commit('Handshake', self.$store.state.OXO.CurrentSession)
                    } else {
                      let promise = self.$store.dispatch({
                        type: 'DeliverFileMessage',
                        timestamp: timestamp,
                        chatKey: self.$store.state.OXO.CurrentChatKey,
                        address: self.$store.state.OXO.CurrentSession,
                        fileToPublish: fileToPublish,
                        pathJson: pathJson,
                        size: stats.size
                      })
                      promise.then(() => {
                        self.content = ''
                        const ul = self.$refs.list
                        ul.scrollTop = ul.scrollHeight
                      })
                    }
                  }
                } else {
                  //group-chat
                  let promise = self.$store.dispatch({
                    type: 'DeliverGroupFileMessage',
                    timestamp: timestamp,
                    group_hash: self.$store.state.OXO.CurrentSession,
                    fileToPublish: fileToPublish,
                    pathJson: pathJson,
                    size: stats.size
                  })
                  promise.then(() => {
                    self.content = ''
                    const ul = self.$refs.list
                    ul.scrollTop = ul.scrollHeight
                  })
                }
              }
            } else {
              self.$message({
                showClose: true,
                message: '不是文件或者文件为空',
                type: 'warning'
              })
            }
          }
        } catch (e) {
          console.log(e)
        }
      })
    }
  },
  watch: {
    'getMessages': function() {
      let newLastMessage = this.$store.state.OXO.Messages[this.$store.state.OXO.Messages.length - 1]
      if (this.lastMessage != newLastMessage) {
        this.lastMessage = newLastMessage
        this.$nextTick(() => {
          const ul = this.$refs.list
          ul.scrollTop = ul.scrollHeight
        })
      }
    },
    'getCurrentSession': function() {
      if (this.$store.state.OXO.CurrentSession[0] == 'o') {
        if (this.$store.state.OXO.CurrentChatKey == '') {
          this.btnSendText = '协商密钥'
          this.showSendFile = false
        } else {
          this.btnSendText = '发送'
          this.btnSendFile = '发送文件'
          this.showSendFile = true
        }
      } else {
        this.btnSendText = '发送'
        this.btnSendFile = '发送文件'
      }
    },
    'currentChatKey': function() {
      if (this.$store.state.OXO.CurrentChatKey == '') {
        this.btnSendText = '协商密钥'
        this.showSendFile = false
      } else {
        this.btnSendText = '发送'
        this.btnSendFile = '发送文件'
        this.showSendFile = true
      }
    },
    'getWSState': function() {
      if (this.$store.state.OXO.WSState == 1) {
        this.$refs.btnSendText.disabled = false
        this.$refs.btnSendFile.disabled = false
      } else {
        this.$refs.btnSendText.disabled = true
        this.$refs.btnSendFile.disabled = true
      }
    }
  }
}

</script>
