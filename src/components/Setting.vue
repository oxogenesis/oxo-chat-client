<template>
  <div>
    <header-section></header-section>
    <h1>设置</h1>
    <router-link to="/Contact">联系人</router-link><br>
    <h2>Address : {{address}}</h2>
    <h2>Seed : {{seed}}</h2>
    <br>
    当前服务器地址: {{this.$store.state.OXO.CurrentHost}}<br>
    <input type="text" name="host" id="input_host" /><br>
    <input type="button" value="设置" @click="setHost()" /><br>
    <ul>
      <li v-for="host in getHosts">
        {{host}}
        <input type="button" value="使用" @click="setHost(host)" />
        <input type="button" value="删除" @click="removeHost(host)" />
      </li>
    </ul>
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
  },
  computed: {
    ...mapGetters({
      getHosts: 'getHosts'
    })
  },
  methods: {
    setHost(host) {
      if (host != null) {
        this.$store.dispatch({
          type: 'SetHost',
          host: host
        })
      } else {
        let input = document.querySelector('input#input_host').value.trim()
        let regx = /^ws[s]?:\/\/.+/
        let rs = regx.exec(input)
        if (rs == null) {
          alert('服务器地址格式不对，应该以ws://或wss://开头')
          return
        }
        this.$store.dispatch({
          type: 'SetHost',
          host: input
        })
        document.querySelector('input#input_host').value = ''
      }
    },
    removeHost(host) {
      this.$store.dispatch({
        type: 'RemoveHost',
        host: host
      })
    }
  }
}

</script>
