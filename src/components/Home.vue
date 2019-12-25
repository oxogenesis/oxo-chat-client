<template>
  <div>
    <header-section></header-section>
    <div class="homeApp">
      Address: {{address}}<br>
    </div>
    <footer-section></footer-section>
  </div>
</template>
<script>
import HeaderSection from './section/HeaderSection.vue'
import FooterSection from './section/FooterSection.vue'

export default {
  data() {
    return {
      address: this.$store.state.OXO.Address
    }
  },
  components: {
    HeaderSection,
    FooterSection
  },
  created() {
    if (this.$store.state.OXO.Init == true) {
      this.$store.dispatch('Loading', this.address)
      this.$store.dispatch('KeepConn')
      this.$store.state.OXO.Init = false
    }
  },
  methods: {}
}

</script>
<style scoped>
.homeApp {
  font-family: 'Microsoft YaHei', 'Muli', 'Helvetica Neue', helvetica, arial;
  max-width: 1000px;
  margin: 30px auto;
}

</style>
