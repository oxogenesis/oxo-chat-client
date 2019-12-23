<style src="../css/bulletin.css"></style>
<template>
  <div>
    <header-section></header-section>
    <div class="bulletin-board-app">
      <follow-section></follow-section>
      <bulletin-section></bulletin-section>
    </div>
    <footer-section></footer-section>
</template>
<script>
import HeaderSection from './section/HeaderSection.vue'
import FollowSection from './section/FollowSection.vue'
import BulletinSection from './section/BulletinSection.vue'
import FooterSection from './section/FooterSection.vue'

export default {
  data() {
    return {
      address: this.$store.state.OXO.Address
    }
  },
  components: {
    HeaderSection,
    FooterSection,
    FollowSection,
    BulletinSection
    
  },
  created() {
    this.$store.dispatch({
      type: 'LoadBBs'
    })
    
    if (this.$store.state.OXO.Follows.includes(this.$route.params.address)) {
      this.$store.dispatch('SwitchBBSession', this.$route.params.address)
    } else {
      this.$store.dispatch({
        type: 'SyncAllBulletin'
      })
    }
  },
  methods: {}
}

</script>
