<template>
  <li class="message-list-item">
    <h5 class="message-author-name">{{ message.name }}#{{ message.sequence }}</h5>
    <div class="message-time">
      {{ message.timestamp | time }}-->{{ message.created_at | time }}
    </div>
    <div :class="[{'message-confirm':message.confirmed}, 'message-text']">{{ message.content }}</div>
  </li>
</template>
<script>

export default {
  name: 'Message',
  props: {
    message: Object
  }
}

</script>
