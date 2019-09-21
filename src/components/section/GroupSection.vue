<template>
  <div class="session-section">
    <ul class="session-list">
      <group v-for="session in this.$store.state.OXO.GroupSessions" :group_hash="session.hash" :group_name="session.name" :unread_count="session.unread_count" :active="session.group_hash === currentGroupSession" @switch-group-session="switchGroupSession">
      </group>
    </ul>
  </div>
</template>
<script>
import Group from './Group.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'GroupSection',
  components: { Group },
  data() {
    return {}
  },
  created() {
  },
  computed: {
    ...mapGetters({
      currentGroupSession: 'currentGroupSession'
    })
  },
  methods: {
    ...mapActions({
      switchGroupSession: 'SwitchGroupSession'
    })
  }
}

</script>
