<template>
  <div>
    <outer-header />
    <div class="login-box">
      <div class="login-inner">
        <h1 class="login-head">打开账户</h1>
        <div class="login-body">
          <div class="login-ways">
            <router-link to="/CreateAccountNew">用口令创建账户</router-link>
            <router-link to="/CreateAccountWithSeed">用种子创建账户</router-link>
          </div>
          <div>
            <Login />
          </div>
        </div>
      </div>
    </div>
    <outer-footer />
  </div>
</template>
<script>
import Login from './Login.vue'
import OuterHeader from './section/OuterHeader'
import OuterFooter from './section/OuterFooter'

export default {
  data() {
    return {}
  },
  methods: {},
  components: {
    Login,
    OuterFooter,
    OuterHeader
  }
}

</script>
<style scoped>
.login-ways {
  padding-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-ways a {
  color: #3b8ddf;
}

.login-ways a:first-child {
  margin-right: 50px;
}

</style>
