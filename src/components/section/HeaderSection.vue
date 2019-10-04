<template>
  <div class="header-section">
    <span :class="getWSState">●</span>
    <router-link to="/Home">首页</router-link>
    <router-link to="/BBs">公告</router-link>
    <router-link to="/Chats">聊天</router-link>
    <router-link to="/Groups">群聊</router-link>
    <router-link to="/Setting">设置</router-link>
    <a href="#" @click="logout()">登出</a>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'HeaderSection',
  methods: {
    logout() {
      this.$router.push('/Main')
      this.$store.commit('ResetAccount')
    }
  },
  computed: {
    ...mapGetters({
      getWSState: 'getWSState',
      getPopUp: 'getPopUp'
    })
  },
  watch: {
    'getPopUp': function() {
      if (this.$store.state.OXO.PopUp != '') {
        alert(this.$store.state.OXO.PopUp)
        this.$store.state.OXO.PopUp = ''
      }
    }
  }
}

</script>