<template>
  <li class="message-list-item">
    <h5 class="message-author-name">{{ getNameByAddress(message.address) }}#{{ message.sequence }}</h5>
    <div class="message-time">
      {{ message.timestamp | time }}-->{{ message.created_at | time }}
    </div>
    <div ref="content" :class="[{'message-confirm':message.confirmed}, 'message-text']"></div>
  </li>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

export default {
  name: 'Message',
  props: {
    message: Object
  },
  computed: {
    ...mapGetters({
      getNameByAddress: 'getNameByAddress'
    })
  },
  mounted() {
    let content = this.message.content
    console.log(this.message)
    console.log(content)
    if (content.length > 22 && content.substring(0, 22) == 'data:image/png;base64,') {
      let newImg = document.createElement("img")
      newImg.src = content
      newImg.width = 447
      this.$refs.content.appendChild(newImg)
    } else {
      this.$refs.content.innerHTML = content
    }
  }
}

</script>
