<style src="../css/chat.css"></style>
<template>
  <div>
    <header-section></header-section>
    <h1>聊天</h1>
    <div class="chatapp">
      <session-section></session-section>
      <message-section></message-section>
    </div>
  </div>
</template>
<script>
import HeaderSection from './section/HeaderSection.vue'
import SessionSection from './section/SessionSection.vue'
import MessageSection from './section/MessageSection.vue'

export default {
  data() {
    return {
      address: this.$store.state.OXO.Address
    }
  },
  components: {
    HeaderSection,
    SessionSection,
    MessageSection
  },
  created() {
    this.$store.dispatch({
      type: 'LoadSessions',
      session: this.$route.params.session
    })
  },
  methods: {}
}

</script>
