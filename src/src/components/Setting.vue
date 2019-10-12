<template>
  <div>
    <header-section></header-section>
    <h1>设置</h1>
    <h2>Address : {{address}}</h2>
    <h2>Seed : {{seed}}</h2>
    <router-link to="/Network">网络</router-link><br>
    <router-link to="/Contact">联系人</router-link><br>
    <router-link to="/Group">群组</router-link><br>
  </div>
</template>
<script>
import HeaderSection from './section/HeaderSection.vue'
import { mapActions, mapMutations, mapGetters } from 'vuex'

export default {
  data() {
    return {
      address: this.$store.state.OXO.Address,
      seed: this.$store.state.OXO.Seed
    }
  },
  components: {
    HeaderSection
  }
}

</script>
