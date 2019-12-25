<template>
  <div class="session-section">
    <div class="session-head"><span>联系人列表</span></div>
    <ul class="session-list">
      <session v-for="(session,index) in getSessions" :key="index" :session="session" :active="session.session === getCurrentSession" @switch-session="switchSession">
      </session>
    </ul>
  </div>
</template>
<script>
import Session from './Session.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'SessionSection',
  components: { Session },
  data() {
    return {}
  },
  created() {},
  computed: {
    ...mapGetters({
      getSessions: 'getSessions',
      getCurrentSession: 'getCurrentSession'
    })
  },
  methods: {
    ...mapActions({
      switchSession: 'SwitchSession'
    })
  }
}

</script>
