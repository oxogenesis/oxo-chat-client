<template>
  <li
    class="session-list-item"
    :class="{ active: active }"
    @click="$emit('switch-group-session', group_hash)">
    <h5 class="session-name">{{ group_name }}</h5>
    <div class="session-time">
      {{ unread_count }}
    </div>
  </li>
</template>

<script>
export default {
  name: 'Group',
  props: {
    active: Boolean,
    group_hash: String,
    group_name: String,
    unread_count: Number
  }
}
</script>
