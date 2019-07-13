<style src="../css/chat.css"></style>
<template>
  <div>
    <header-section></header-section>
    <h1>聊天</h1>
    <div class="chatapp">
      <friend-section></friend-section>
      <message-section></message-section>
    </div>
  </div>
</template>
<script>
import HeaderSection from './section/HeaderSection.vue'
import FriendSection from './section/FriendSection.vue'
import MessageSection from './section/MessageSection.vue'

export default {
  data() {
    return {
      address: this.$store.state.OXO.Address,
      currentChatKey: this.$store.state.OXO.CurrentChatKey
    }
  },
  components: {
    HeaderSection,
    FriendSection,
    MessageSection
  },
  created() {
    this.$store.dispatch({
      type: 'LoadChats',
      address: this.$route.params.address
    })
    //console.log(this.$store.state.OXO.ChatSessions)
  },
  methods: {}
}

</script>
