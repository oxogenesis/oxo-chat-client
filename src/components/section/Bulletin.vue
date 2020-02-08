<template>
  <li class="bulletin-list-item">
    <h5 class="bulletin-author-name">{{ getNameByAddress(bulletin.address) }}#{{ bulletin.sequence }}</h5>
    <h5 class="bulletin-quote-link" @click="addQuote(bulletin)">[引用]</h5>
    <h5 v-if="bulletin.quote_size" class="bulletin-quote-showlink" @click="loadQuote(bulletin)">[显示引用]</h5>
    <div class="bulletin-time">
      {{ bulletin.timestamp | time }}
    </div>
    <div v-if="bulletin.is_file" class="bulletin-text">
      Name:{{bulletin.file.Name}}{{bulletin.file.Ext}}<br>
      Size:{{bulletin.file.Size}}<br>
      Chunk:{{bulletin.file.Chunk}}<br>
      SHA1:{{bulletin.file.SHA1}}<br>
      <h5 v-show="bulletin.file_saved" class="bulletin-quote-link" @click="openFile(bulletin.file.SHA1)">[打开]</h5>
      <h5 v-show="bulletin.file_saved" class="bulletin-quote-link" @click="openDir(bulletin.file.SHA1)">[打开文件夹]</h5>
      <h5 v-show="!bulletin.file_saved" class="bulletin-quote-link" @click="fetchFile(bulletin.file, bulletin.relay1_address)">[获取]</h5>
    </div>
    <div v-else class="bulletin-text" v-html="bulletin.content"></div>
  </li>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

const shell = window.require('electron').shell
const fs = window.require("fs")
const path = window.require("path")

export default {
  name: 'Bulletin',
  data: function() {
    return {
      input_names: "",
      showEdit: false
    }
  },
  props: {
    bulletin: Object,
    refresh: Function,
    paShowEdit: Boolean,
    address: String
  },
  methods: {
    addQuote(bulletin) {
      this.$store.commit({
        type: 'AddQuote',
        address: bulletin.address,
        sequence: bulletin.sequence,
        hash: bulletin.hash
      })
    },
    loadQuote(bulletin) {
      this.$store.commit({
        type: 'LoadQuote',
        address: bulletin.address,
        hash: bulletin.hash
      })
    },
    openFile() {
      let sha1 = this.bulletin.file.SHA1
      let tmpFile = `./data/tmp/${sha1}${this.bulletin.file.Ext}`
      fs.copyFile(`./data/${this.address}/${sha1.substr(0,3)}/${sha1.substr(3,3)}/${sha1}`, tmpFile, (err) => {
        if (err) {
          throw err
        } else {
          shell.openItem(path.resolve(tmpFile))
        }
      });
    },
    openDir() {
      let sha1 = this.bulletin.file.SHA1
      let tmpFile = `./data/tmp/${sha1}${this.bulletin.file.Ext}`
      fs.copyFile(`./data/${this.address}/${sha1.substr(0,3)}/${sha1.substr(3,3)}/${sha1}`, tmpFile, (err) => {
        if (err) {
          throw err
        } else {
          shell.showItemInFolder(path.resolve(tmpFile))
        }
      });
    },
    fetchFile(file, relay1_address) {
      this.$store.commit({
        type: 'FetchFile',
        file: file,
        relay1_address: relay1_address
      })
    },
    ...mapActions({
      SwitchBBSession: 'SwitchBBSession'
    })
  },
  computed: {
    ...mapGetters({
      getNameByAddress: 'getNameByAddress',
      currentBBSession: 'currentBBSession',
      displayQuotes: 'displayQuotes'
    })
  }
}

</script>
<style scoped>
.bulletin-author-nameedit {
  display: flex;
}

.bulletin-author-nameedit .el-input {
  width: 200px;
}

.input_names {
  width: 100px;
  margin-right: 6px;
}

</style>
