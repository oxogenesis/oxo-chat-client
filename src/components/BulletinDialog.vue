<template>
  <li>
    <h5 class="bulletin-author-name">{{ getNameByAddress(bulletin.address) }}#{{ bulletin.sequence }}</h5>
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
      <h5 v-show="!bulletin.file_saved" class="bulletin-quote-link">{{bulletin.file_percent}}</h5>
      <h5 v-show="!bulletin.file_saved" class="bulletin-quote-link" @click="fetchFile(bulletin.file, bulletin.relay_address)">[获取]</h5>
    </div>
    <div v-else class="bulletin-text" v-html="bulletin.content">
    </div>
  </li>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

const shell = window.require('electron').shell
const fs = window.require("fs")
const path = window.require("path")

export default {
  name: 'BulletinDialog',
  data: function() {
    return {}
  },
  props: {
    bulletin: Object,
    address: String
  },
  methods: {
    loadBulletin(hash) {
      this.$store.commit({
        type: 'LoadBulletin',
        hash: hash
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
    fetchFile(file, relay_address) {
      this.$store.commit({
        type: 'FetchBulletinFile',
        file: file,
        relay_address: relay_address
      })
    },
    ...mapActions({})
  },
  computed: {
    ...mapGetters({
      getNameByAddress: 'getNameByAddress',
      displayBulletins: 'displayBulletins'
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
