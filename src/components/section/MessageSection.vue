<template>
  <div class="message-section">
    <h3 v-if="getCurrentSession[0] == 'o'" class="message-session-heading">{{ getNameByAddress(getCurrentSession) }}</h3>
    <h3 v-if="getCurrentSession[0] != 'o'" class="message-session-heading">群:{{ this.$store.state.OXO.Groups[getCurrentSession] }}</h3>
    <ul class="message-list" ref="list">
      <message v-for="message in this.$store.state.OXO.Messages" :message="message">
      </message>
    </ul>
    <textarea class="message-composer" v-model="content"></textarea>
    <input type="button" @click="btnSend()" ref="btnSend" /><br>
  </div>
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
      lastMessage: null
    }
  },
  props: {},
  computed: {
    ...mapGetters({
      currentChatKey: 'currentChatKey',
      getNameByAddress: 'getNameByAddress',
      getMessages: 'getMessages',
      getWSState: 'getWSState',
      getCurrentSession: 'getCurrentSession'
    })
  },
  created() {},
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
        this.$refs.btnSend.value = '协商密钥'
      } else {
        this.$refs.btnSend.value = '发送'
      }
    } else {
      //group-chat
      this.$refs.btnSend.value = '发送'
    }

    if (this.$store.state.OXO.WSState == 1) {
      this.$refs.btnSend.disabled = false
    } else {
      this.$refs.btnSend.disabled = true
    }
  },
  methods: {
    btnSend() {
      let timestamp = Date.now()
      if (this.$store.state.OXO.CurrentSession[0] == 'o') {
        //private-chat
        if (this.$refs.btnSend.value == '协商密钥') {
          this.$store.commit('Handshake', this.$store.state.OXO.CurrentSession)
          alert("如果10秒内无响应，说明对方不在线...")
        } else if (this.$refs.btnSend.value == '发送') {
          if (this.content.trim() == "") {
            alert("消息不能为空...")
            return
          }

          //check handshake
          let division = this.$store.state.OXO.DefaultDivision
          let sequence = DHSequence(division, timestamp, this.$store.state.OXO.Address, this.$store.state.OXO.CurrentSession)

          if (sequence != this.$store.state.OXO.CurrentChatKeySequence || this.$store.state.OXO.CurrentChatKey == "") {
            //如果会话密钥为空
            //或会话时间区间编号不符
            //则再次协商会话密钥
            this.$refs.btnSend.value = '协商密钥'
            this.$store.commit('Handshake', this.$store.state.OXO.CurrentSession)
          } else {
            this.$store.dispatch({
              type: 'DeliverMessage',
              timestamp: timestamp,
              chatKey: this.$store.state.OXO.CurrentChatKey,
              address: this.$store.state.OXO.CurrentSession,
              content: this.content
            })
            this.content = ''
          }
        }
      } else {
        //group-chat
        if (this.content.trim() == "") {
          alert("消息不能为空...")
          return
        }

        this.$store.dispatch({
          type: 'DeliverGroupMessage',
          timestamp: timestamp,
          group_hash: this.$store.state.OXO.CurrentSession,
          content: this.content
        })
        this.content = ''
      }
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
          this.$refs.btnSend.value = '协商密钥'
        } else {
          this.$refs.btnSend.value = '发送'
        }
      } else {
        this.$refs.btnSend.value = '发送'
      }
    },
    'currentChatKey': function() {
      if (this.$store.state.OXO.CurrentChatKey == '') {
        this.$refs.btnSend.value = '协商密钥'
      } else {
        this.$refs.btnSend.value = '发送'
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