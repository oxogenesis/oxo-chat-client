<template>
  <div class="message-section">
    <h3 class="message-session-heading">{{ getNameByAddress(currentChatSession) }}</h3>
    <ul class="message-list" ref="list">
      <message v-for="message in getMessages" :message="message">
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
      getNameByAddress: 'getNameByAddress',
      currentChatSession: 'currentChatSession',
      currentChatKeySequence: 'currentChatKeySequence',
      currentChatKey: 'currentChatKey',
      getMessages: 'getMessages',
      getWSState: 'getWSState'
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

    if (this.$store.state.OXO.CurrentChatKey == '') {
      this.$refs.btnSend.value = '协商密钥'
    } else {
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
      if (this.$refs.btnSend.value == '协商密钥') {
        this.$store.commit('Handshake', this.$store.state.OXO.CurrentChatSession)
        alert("如果10秒内无响应，说明对方不在线...")
      } else if (this.$refs.btnSend.value == '发送') {
        if (this.content.trim() == "") {
          alert("消息不能为空...")
          return
        }

        //check handshake
        let timestamp = Date.now()
        let division = this.$store.state.OXO.DefaultDivision
        let sequence = DHSequence(division, timestamp, this.$store.state.OXO.Address, this.$store.state.OXO.CurrentChatSession)

        if (sequence != this.$store.state.OXO.CurrentChatKeySequence || this.$store.state.OXO.CurrentChatKey == "") {
          //如果会话密钥为空
          //或会话时间区间编号不符
          //则再次协商会话密钥
          this.$refs.btnSend.value = '协商密钥'
          this.$store.commit('Handshake', this.$store.state.OXO.CurrentChatSession)
        } else {
          this.$store.dispatch({
            type: 'DeliverMessage',
            timestamp: timestamp,
            chatKey: this.$store.state.OXO.CurrentChatKey,
            address: this.$store.state.OXO.CurrentChatSession,
            content: this.content
          })
          this.content = ''
        }
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
    'currentChatKey': function() {
      console.log('this.$store.state.OXO.CurrentChatKey')
      console.log(this.$store.state.OXO.CurrentChatKey)
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
