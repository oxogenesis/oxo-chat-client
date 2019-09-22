<template>
  <li class="message-list-item">
    <h5 class="message-author-name">{{ getNameByAddress(message.address) }}#{{ message.sequence }}</h5>
    <div class="message-time">
      {{ message.timestamp | time }}-->{{ message.created_at | time }}
    </div>
    <div class="message-text">{{ message.content }}</div>
  </li>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'GroupMessage',
  props: {
    message: Object
  },
  computed: {
    ...mapGetters({
      getNameByAddress: 'getNameByAddress'
    })
  }
}

</script>
