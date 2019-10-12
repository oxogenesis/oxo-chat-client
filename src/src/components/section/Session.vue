<template>
  <li
    class="session-list-item"
    :class="{ active: active }"
    @click="$emit('switch-session', session.session)">
    <h5 v-if="session.type == 0" class="session-name">{{ getNameByAddress(session.session) }}</h5>
    <h5 v-if="session.type == 1" class="session-name">群:{{ session.name }}</h5>
    <div class="session-time">
      {{ session.unread_count }}
    </div>
  </li>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Session',
  props: {
    active: Boolean,
    session: Object
  },
  computed: {
    ...mapGetters({
      getNameByAddress: 'getNameByAddress'
    })
  }
}
</script>
