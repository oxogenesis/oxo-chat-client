<template>
  <li
    class="session-list-item"
    :class="{ active: active }"
    @click="$emit('switch-chat-session', address)">
    <h5 class="session-name">{{ name }}</h5>
    <div class="session-time">
      {{ unread_count }}
    </div>
  </li>
</template>

<script>
export default {
  name: 'Friend',
  props: {
    active: Boolean,
    address: String,
    name: String,
    unread_count: Number
  }
}
</script>
