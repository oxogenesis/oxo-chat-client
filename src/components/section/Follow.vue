<template>
  <li class="follow-list-item" :class="{ active: active }" @click="$emit('switch-bb-session', address)">
    <h5 class="follow-name">{{ name }}</h5>
    <div class="follow-time">
      {{ unread_count }}
    </div>
  </li>
</template>
<script>
export default {
  name: 'Follow',
  props: {
    active: Boolean,
    address: String,
    name: String,
    unread_count: Number
  }
}

</script>
