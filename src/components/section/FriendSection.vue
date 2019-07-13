<template>
  <div class="session-section">
    <ul class="session-list">
      <friend
        v-for="session in this.$store.state.OXO.ChatSessions"
        :address="session.address"
        :name="session.name"
        :unread_count="session.unread_count"
        :active="session.address === currentChatSession"
        @switch-chat-session="switchChatSession"
        >
      </friend>
    </ul>
  </div>
</template>

<script>
import Friend from './Friend.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'FriendSection',
  components: { Friend },
  data () {
    return {
    }
  },
  created() {
  },
  computed: {
    ...mapGetters({
      currentChatSession: 'currentChatSession'
    })
  },
  methods: {
    ...mapActions({
      switchChatSession: 'SwitchChatSession'
    })
  }
}
</script>
