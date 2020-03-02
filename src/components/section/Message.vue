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
      <div v-if="message.is_file" class="[{'message-confirm':message.confirmed}, 'message-text']">
        Name:{{message.file.Name}}{{message.file.Ext}}<br>
        Size:{{message.file.Size}}<br>
        Chunk:{{message.file.Chunk}}<br>
        SHA1:{{message.file.SHA1}}<br>
        <h5 v-show="message.file_saved" class="message-quote-link" @click="openFile(message.file.SHA1)">[打开]</h5>
        <h5 v-show="message.file_saved" class="message-quote-link" @click="openDir(message.file.SHA1)">[打开文件夹]</h5>
        <h5 v-show="!message.file_saved" class="message-quote-link">{{message.file_percent}}</h5>
        <h5 v-show="!message.file_saved" class="message-quote-link" @click="fetchFile(message.is_private, message.address, message.file)">[获取]</h5>
      </div>
      <div v-else class="[{'message-confirm':message.confirmed}, 'message-text']" v-html="message.content"></div>
    </div>
  </li>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

const shell = window.require('electron').shell
const fs = window.require("fs")
const path = window.require("path")

export default {
  name: 'Message',
  data: function() {
    return {
      address: this.$store.state.OXO.Address
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
      return this.address == this.message.address ? 'myline' : '';
    },
    toolTipDir: function() {
      return this.address == this.message.address ? 'left' : 'right';
    }
  },
  mounted() {

  },
  methods: {
    openFile() {
      let sha1 = this.message.file.SHA1
      let tmpFile = `./data/tmp/${sha1}${this.message.file.Ext}`
      fs.copyFile(`./data/${this.address}/${sha1.substr(0,3)}/${sha1.substr(3,3)}/${sha1}`, tmpFile, (err) => {
        if (err) {
          throw err
        } else {
          shell.openItem(path.resolve(tmpFile))
        }
      })
    },
    openDir() {
      let sha1 = this.message.file.SHA1
      let tmpFile = `./data/tmp/${sha1}${this.message.file.Ext}`
      fs.copyFile(`./data/${this.address}/${sha1.substr(0,3)}/${sha1.substr(3,3)}/${sha1}`, tmpFile, (err) => {
        if (err) {
          throw err
        } else {
          shell.showItemInFolder(path.resolve(tmpFile))
        }
      })
    },
    fetchFile(is_private, address, file) {
      if (is_private) {
        this.$store.commit({
          type: 'FetchPrivateFile',
          file: file,
          address: address
        })
      } else {
        this.$store.commit({
          type: 'FetchGroupFile',
          file: file,
          address: address
        })
      }
    }
  }
}

</script>
<style scoped>
</style>
