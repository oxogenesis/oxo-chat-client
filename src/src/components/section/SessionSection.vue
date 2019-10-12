<template>
  <div class="session-section">
    <ul class="session-list">
      <session
        v-for="session in getSessions"
        :session="session"
        :active="session.session === getCurrentSession"
        @switch-session="switchSession"
        >
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
  data () {
    return {
    }
  },
  created() {
  },
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
