<style src="../css/chat.css"></style>
<template>
  <div>
    <header-section></header-section>
    <h1>群聊</h1>
    <div class="chatapp">
      <group-section></group-section>
      <group-message-section></group-message-section>
    </div>
  </div>
</template>
<script>
import HeaderSection from './section/HeaderSection.vue'
import GroupSection from './section/GroupSection.vue'
import GroupMessageSection from './section/GroupMessageSection.vue'

export default {
  data() {
    return {
      address: this.$store.state.OXO.Address
    }
  },
  components: {
    HeaderSection,
    GroupSection,
    GroupMessageSection
  },
  created() {
    this.$store.dispatch({
      type: 'LoadGroups',
      group_hash: this.$route.params.group_hash
    })
  },
  methods: {}
}

</script>
