<template>
  <div>
    <header-section></header-section>
    <h1>设置</h1>
    当前服务器地址: {{this.$store.state.OXO.CurrentHost}}<br>
    <input type="text" id="input_address" /><br>
    <input type="button" value="设置" @click="setHost()" /><br>
    <ul>
      <li v-for="host in getHosts">
        {{host.address}}@{{host.updated_at | time}}
        <input type="button" value="使用" @click="setHost(host.address)" />
        <input type="button" value="删除" @click="removeHost(host.address)" />
      </li>
    </ul>
  </div>
</template>
<script>
import HeaderSection from './section/HeaderSection.vue'
import { mapActions, mapMutations, mapGetters } from 'vuex'

export default {
  data() {
    return {}
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
    setHost(address) {
      if (address != null) {
        this.$store.commit({
          type: 'SetHost',
          address: address
        })
      } else {
        address = document.querySelector('input#input_address').value.trim()
        let regx = /^ws[s]?:\/\/.+/
        let rs = regx.exec(address)
        if (rs == null) {
          alert('服务器地址格式不对，应该以ws://或wss://开头')
        } else {
          this.$store.commit({
            type: 'SetHost',
            address: address
          })
          document.querySelector('input#input_address').value = ''
        }
      }
    },
    removeHost(address) {
      this.$store.commit({
        type: 'RemoveHost',
        address: address
      })
    }
  }
}

</script>
