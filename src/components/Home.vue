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
    console.log(`Init:${this.$store.state.OXO.Init}`)
    if(this.$store.state.OXO.Init == true) {
      this.$store.dispatch('InitDB', this.address)
      this.$store.dispatch('ToConn')
      this.$store.state.OXO.Init = false
    }
  },
  methods: {
  }
}

</script>
