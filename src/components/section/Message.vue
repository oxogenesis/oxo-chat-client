<template>
  <li :class="['message-list-item', myline]">
    <div class="message-item-head">
      <h5 class="message-author-name">{{ getNameByAddress(message.address) }}#{{ message.sequence }}</h5>
      <div class="message-time">
        <el-tooltip effect="light" :placement="toolTipDir">
          <div slot="content"> 发送：{{ message.timestamp | time }}
            <template v-if="myline==''"><br>接收：{{ message.created_at | time }}</template>
            <template v-else><br> 确认：{{ message.created_at | time }}</template>
          </div>
          <i class="el-icon-alarm-clock"></i>
        </el-tooltip>
      </div>
    </div>
    <div class="message-textWrapper">
      <div :class="[{'message-confirm':message.confirmed}, 'message-text']">{{message.content}}</div>
    </div>
  </li>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

export default {
  name: 'Message',
  data: function() {
    return {
      myAddress: this.$store.state.OXO.Address
    }
  },
  props: {
    message: Object
  },
  computed: {
    ...mapGetters({
      getNameByAddress: 'getNameByAddress'
    }),
    myline: function() {
      return this.myAddress == this.message.address ? 'myline' : '';
    },
    toolTipDir: function() {
      return this.myAddress == this.message.address ? 'left' : 'right';
    }
  },
  mounted() {
    /*
    //what the fuck!
    console.log(`mounted#${this.message.sequence}#${this.message.content}`)
    let content = this.message.content
    if (content.length > 22 && content.substring(0, 22) == 'data:image/png;base64,') {
      let newImg = document.createElement("img")
      newImg.src = content
      newImg.width = 447
      this.$refs.content.appendChild(newImg)
    } else {
      content = content.replace(/\r/ig, "").replace(/\n/ig, "<br>");
      this.$refs.content.innerHTML = content;
    }
    */
  }
}

</script>
<style scoped>
</style>
