<template>
  <div class="message-section" id="message-section">
    <h3 v-if="getCurrentSession[0] == 'o'" class="message-session-heading">{{ getNameByAddress(getCurrentSession) }}</h3>
    <h3 v-if="getCurrentSession != '' && getCurrentSession[0] != 'o'" class="message-session-heading">群:{{ this.$store.state.OXO.Groups[getCurrentSession] }}</h3>
    <ul class="message-list" ref="list">
      <message v-for="(message,index) in this.$store.state.OXO.Messages" 
        :key="index"
        :message="message">
      </message>
    </ul>
    <div class="message-composer-wrapper">
      <div @keydown="addKeyBoaderEvent($event)">
        <el-input type="textarea" placeholder="按enter发送，shift+enter换行"  class="message-composer" v-model="content" ref="sendTextarea"></el-input>
      </div>
      <div class="message-composer-bottom">
        <img id="img" v-bind:src="imgSrc" width="494" onclick="this.src=''">
        <el-button class="btnsend" size="mini" type="primary" @click="sendMessage()"  ref="btnSend">{{btnSendText}}</el-button>
      </div>
    </div>
  </div>

  <!-- <div class="message-section" id="message-section">
    <h3 v-if="getCurrentSession[0] == 'o'" class="message-session-heading">{{ getNameByAddress(getCurrentSession) }}</h3>
    <h3 v-if="getCurrentSession != '' && getCurrentSession[0] != 'o'" class="message-session-heading">群:{{ this.$store.state.OXO.Groups[getCurrentSession] }}</h3>
    <ul class="message-list" ref="list">
      <message v-for="message in this.$store.state.OXO.Messages" :message="message">
      </message>
    </ul>
    <textarea class="message-composer" v-model="content"></textarea>
    <img id="img" v-bind:src="imgSrc" width="494" onclick="this.src=''">
    <input type="button" @click="sendMessage()" ref="btnSend" /><br>
  </div> -->
</template>
<script>
import Message from './Message.vue'
import { mapActions, mapGetters } from 'vuex'
import { DHSequence } from '../../utils/oxo.js'

export default {
  name: 'MessageSection',
  components: { Message },
  data() {
    return {
      content: '',
      lastMessage: null,
      btnSendText: "",
      myAddress: this.$store.state.OXO.Address
    }
  },
  props: {},
  updated: function () {
    let len = this.$store.state.OXO.Messages.length, newLastMessage = {};
    if(len>0){
      newLastMessage = this.$store.state.OXO.Messages[len - 1];
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
    messageData: function(){
      return this.$store.state.OXO.Messages;
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
        // this.$refs.btnSend.value = '协商密钥'
        this.btnSendText = '协商密钥'
      } else {
        // this.$refs.btnSend.value = '发送'
        this.btnSendText =  '发送'
      }
    } else {
      //group-chat
      // this.$refs.btnSend.value = '发送'
      this.btnSendText =  '发送'
    }

    if (this.$store.state.OXO.WSState == 1) {
      this.$refs.btnSend.disabled = false
    } else {
      this.$refs.btnSend.disabled = true
    }

    document.addEventListener('paste', function(e) {
      if (!(e.clipboardData && e.clipboardData.items)) {
        return
      }
      for (let i = 0, len = e.clipboardData.items.length; i < len; i++) {
        let item = e.clipboardData.items[i]
        if (item.kind === "file") {
          let file = item.getAsFile()
          let reader = new FileReader()
          reader.onloadend = function(e) {
            let img = document.querySelector("#img")
            img.src = e.target.result
          }
          reader.readAsDataURL(file)
        }
      }
    })
  },
  methods: {
    //enter或者ctr+enter提交，shift+enter换行
    addKeyBoaderEvent(event){
      let sendTextarea = this.$refs.sendTextarea,
          self = this;
      if (event.shiftKey && event.keyCode == 13) {
          return false;
      } else if (event.ctrlKey && event.keyCode == 13) {
          event.returnValue = false;
          self.sendMessage();
          return false;
      } else if (event.keyCode == 13) {
          event.returnValue = false;
          this.sendMessage();
          return false;
      }
    },
    sendMessage() {
      if (this.$store.state.OXO.CurrentSession == '') {
        return
      }

      let timestamp = Date.now()
      let img = document.querySelector("#img")
      let self = this;
      if (this.$store.state.OXO.CurrentSession[0] == 'o') {
        //private-chat
        // if (this.$refs.btnSend.value == '协商密钥') {
        if(this.btnSendText == '协商密钥') {
          this.$store.commit('Handshake', this.$store.state.OXO.CurrentSession)
          //alert("如果10秒内无响应，说明对方不在线...")
          self.$message({
            showClose: true,
            message: '如果10秒内无响应，说明对方不在线'
          });
        //} else if (this.$refs.btnSend.value == '发送') {
          } else if (this.btnSendText == '发送') {
          //check handshake
          let division = this.$store.state.OXO.DefaultDivision
          let sequence = DHSequence(division, timestamp, this.$store.state.OXO.Address, this.$store.state.OXO.CurrentSession)

          if (sequence != this.$store.state.OXO.CurrentChatKeySequence || this.$store.state.OXO.CurrentChatKey == "") {
            //如果会话密钥为空
            //或会话时间区间编号不符
            //则再次协商会话密钥
            // this.$refs.btnSend.value = '协商密钥'
            this.btnSendText = '协商密钥'
            this.$store.commit('Handshake', this.$store.state.OXO.CurrentSession)
          } else {
            //优先发送图片
            if (img.src != '') {
              this.$store.dispatch({
                type: 'DeliverMessage',
                timestamp: timestamp,
                chatKey: this.$store.state.OXO.CurrentChatKey,
                address: this.$store.state.OXO.CurrentSession,
                content: img.src
              })
              img.src = ''

              return
            }

            if (this.content.trim() == "") {
              //alert("消息不能为空...")
              self.$message({
                showClose: true,
                message: '消息不能为空!',
                type: 'warning'
              });
            } else {
              let promise = this.$store.dispatch({
                type: 'DeliverMessage',
                timestamp: timestamp,
                chatKey: this.$store.state.OXO.CurrentChatKey,
                address: this.$store.state.OXO.CurrentSession,
                content: this.content
              })
              promise.then(()=>{
                this.content = '';
                const ul = this.$refs.list
                ul.scrollTop = ul.scrollHeight;
              })
            }
          }
        }
      } else {
        //group-chat

        //优先发送图片
        if (img.src != '') {
          this.$store.dispatch({
            type: 'DeliverGroupMessage',
            timestamp: timestamp,
            group_hash: this.$store.state.OXO.CurrentSession,
            content: img.src
          })
          img.src = ''
          return
        }
        
        if (this.content.trim() == "") {
          //alert("消息不能为空...")
          self.$message({
            showClose: true,
            message: '消息不能为空!',
            type: 'warning'
          });
        } else {

          let promise = this.$store.dispatch({
            type: 'DeliverGroupMessage',
            timestamp: timestamp,
            group_hash: this.$store.state.OXO.CurrentSession,
            content: this.content
          })
          promise.then(()=>{
            this.content = '';
            const ul = this.$refs.list
            ul.scrollTop = ul.scrollHeight;
          })
        
        }
      }

    }
  },
  watch: {
    'getMessages': function() {
      let newLastMessage = this.$store.state.OXO.Messages[this.$store.state.OXO.Messages.length - 1];
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
          // this.$refs.btnSend.value = '协商密钥'
          this.btnSendText = '协商密钥'
        } else {
          //this.$refs.btnSend.value = '发送'
          this.btnSendText =  '发送'
        }
      } else {
        // this.$refs.btnSend.value = '发送'
          this.btnSendText =  '发送'
      }
    },
    'currentChatKey': function() {
      if (this.$store.state.OXO.CurrentChatKey == '') {
        // this.$refs.btnSend.value = '协商密钥'
        this.btnSendText =  '协商密钥'
      } else {
        // this.$refs.btnSend.value = '发送'
        this.btnSendText = '发送'
      }
    },
    'getWSState': function() {
      if (this.$store.state.OXO.WSState == 1) {
        this.$refs.btnSend.disabled = false
      } else {
        this.$refs.btnSend.disabled = true
      }
    }
  }
}

</script>
