<template>
  <div class="follow-section">
    <div class="follow-head">
      <span>联系人列表</span>
    </div>
    <ul class="follow-list">
      <follow
        v-for="(follow,index) in this.$store.state.OXO.BBSessions"
        :key="index"
        :address="follow.address"
        :name="follow.name"
        :active="follow.address === currentBBSession"
        @switch-bb-session="switchBBSession"
        >
      </follow>
    </ul>
  </div>
</template>

<script>
import Follow from './Follow.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'FollowSection',
  components: { Follow },
  data () {
    return {
    }
  },
  created() {
  },
  computed: {
    ...mapGetters({
      currentBBSession: 'currentBBSession'
    })
  },
  methods: {
    ...mapActions({
      switchBBSession: 'SwitchBBSession'
    })
  }
}
</script>
