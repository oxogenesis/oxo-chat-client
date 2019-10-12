<template>
  <div>
    <header-section></header-section>
    <h1>首页</h1>
    Address: {{address}}<br>
  </div>
</template>
<script>
import HeaderSection from './section/HeaderSection.vue'

export default {
  data() {
    return {
      address: this.$store.state.OXO.Address
    }
  },
  components: {
    HeaderSection
  },
  created() {
    if(this.$store.state.OXO.Init == true) {
      this.$store.dispatch('Loading', this.address)
      this.$store.dispatch('KeepConn')
      this.$store.state.OXO.Init = false
    }
  },
  methods: {
  }
}

</script>
