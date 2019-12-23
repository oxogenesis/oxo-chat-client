<style src="../css/chat.css"></style>
<template>
  <div>
    <header-section></header-section>
    <div class="chatapp">
      <session-section></session-section>
      <message-section></message-section>
    </div>
    <footer-section></footer-section>
  </div>
</template>
<script>
import HeaderSection from './section/HeaderSection.vue'
import FooterSection from './section/FooterSection.vue'
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
    FooterSection,
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
