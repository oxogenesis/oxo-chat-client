<template>
  <div class="message-section">
    <h3 class="message-session-heading">{{ getNameByAddress(currentChatSession) }}</h3>
    <ul class="message-list" ref="list">
      <message v-for="message in getMessages" :message="message">
      </message>
    </ul>
    <textarea class="message-composer" v-model="content"></textarea>
    <input type="button" @click="btnSend()" value="发送" ref="btnSend" /><br>
  </div>
</template>
<script>
import Message from './Message.vue'
import { mapActions, mapGetters } from 'vuex'

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
      currentGroupSession: 'currentGroupSession',
      getGroupMessages: 'getGroupMessages',
      getWSState: 'getWSState'
    })
  },
  created() {},
  mounted() {
    this.$refs.list.addEventListener('scroll', () => {
      if (this.$refs.list.scrollTop == 0) {
        this.$store.commit({
          type: 'LoadMoreGroupMessage'
        })
      }
    }, false)

    if (this.$store.state.OXO.WSState == 1) {
      this.$refs.btnSend.disabled = false
    } else {
      this.$refs.btnSend.disabled = true
    }
  },
  methods: {
    btnSend() {
      if (this.content.trim() == "") {
        alert("消息不能为空...")
        return
      }
      
      let timestamp = Date.now()

      this.$store.dispatch({
        type: 'DeliverGroupMessage',
        timestamp: timestamp,
        group_hash: this.$store.state.OXO.CurrentGroupSession,
        content: this.content
      })
      this.content = ''
    }
  },
  watch: {
    'getGroupMessages': function() {
      let newLastMessage = this.$store.state.OXO.GroupMessages[this.$store.state.OXO.GroupMessages.length - 1]
      if (this.lastMessage != newLastMessage) {
        this.lastMessage = newLastMessage
        this.$nextTick(() => {
          const ul = this.$refs.list
          ul.scrollTop = ul.scrollHeight
        })
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
