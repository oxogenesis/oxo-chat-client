<template>
  <div>
    <div class="bulletin-section">
      <div v-if="getQuotes.length">
        <div class="quotes-list">
          引用：
          <el-tag v-for="quote in getQuotes" :key="quote.Address" closable @close="removeQuote(quote.Hash)">
            {{ getNameByAddress(quote.Address) }}#{{quote.Sequence}}
          </el-tag>
          <el-button size="mini" type="primary" @click="clearQuotes()">清空</el-button>
        </div>
      </div>
      <div>
        <el-form @submit.native.prevent>
          <el-form-item>
            <el-input type="textarea" class="bulletin-composer" v-model="content"></el-input>
          </el-form-item>
          <el-form-item align="right">
            <el-button size="mini" type="primary" @click="publishTextBulletin()">发布</el-button>
            <el-button size="mini" type="primary" @click="publishFileBulletin()">发布文件</el-button>
          </el-form-item>
        </el-form>
      </div>
      <ul class="bulletin-list" ref="list">
        <bulletin v-for="(bulletin,index) in getBulletins" :bulletin="bulletin" :address="address" :key="index" :paShowEdit="false">
        </bulletin>
      </ul>
      <el-dialog ref="quote-list" title="当前引用列表" :visible.sync="dialogVisible" width="50%" @close='hideQuote()'>
        <ul class="quote-dialist">
          <bulletin v-for="(bulletin,index) in displayQuotes" :bulletin="bulletin" :address="address" :key="index" :paShowEdit="showEdit" @changeShowEdit="changeShowEdit">
          </bulletin>
        </ul>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Bulletin from './Bulletin.vue'
import { mapActions, mapGetters } from 'vuex'

const remote = window.require('electron').remote
const dialog = remote.dialog
const fs = window.require("fs")
const path = window.require("path")

export default {
  name: 'BulletinSection',
  components: { Bulletin },
  data() {
    return {
      address: this.$store.state.OXO.Address,
      content: '',
      showEdit: true
    }
  },
  props: {},
  computed: {
    ...mapGetters({
      getNameByAddress: 'getNameByAddress',
      currentBBSession: 'currentBBSession',
      getBulletins: 'getBulletins',
      getQuotes: 'getQuotes',
      displayQuotes: 'displayQuotes'
    }),
    dialogVisible: function() {
      return this.displayQuotes.length;
    }
  },
  created() {},
  methods: {
    publishTextBulletin() {
      if (this.content.trim() == "") {
        this.$message({
          showClose: true,
          message: '消息不能为空!',
          type: 'warning'
        });
        return
      }
      this.content = this.content.replace(/\r/ig, "").replace(/\n/ig, "<br>");

      this.$store.dispatch({
        type: 'PublishTextBulletin',
        content: this.content
      })
      this.content = ''
    },
    clearQuotes() {
      this.$store.commit({
        type: 'ClearQuotes'
      })
    },
    removeQuote(hash) {
      this.$store.commit({
        type: 'RemoveQuote',
        hash: hash
      })
    },
    hideQuote() {
      this.$store.commit({
        type: 'HideQuote'
      })
    },
    changeShowEdit: function(onoff) {
      this.showEdit = onoff;
    },
    publishFileBulletin() {
      let self = this
      dialog.showOpenDialog({
        title: "浏览文件"
      }, filename => {
        try {
          let stats = fs.statSync(filename[0])
          //console.log(stats)
          if (stats.isFile() && stats.size > 0) {
            let fileToPublish = filename[0]
            //console.log(fileToPublish)

            let stats = fs.statSync(fileToPublish)
            if (stats.isFile() && stats.size > 0) {
              let pathJson = path.parse(fileToPublish)
              if (pathJson["ext"] == '.exe') {
                self.$message({
                  showClose: true,
                  message: '不能发布可执行文件',
                  type: 'warning'
                })
              } else {
                self.$store.dispatch({
                  type: 'PublishFileBulletin',
                  fileToPublish: fileToPublish,
                  pathJson: pathJson,
                  size: stats.size
                })
              }
            } else {
              self.$message({
                showClose: true,
                message: '不是文件或者文件为空',
                type: 'warning'
              })
            }
          }
        } catch (e) {
          console.log(e)
        }
      })
    }
  }
}

</script>
<style scoped>
.bulletin-composer {
  padding: 0;
  margin: 0;
}

.bulletin-composer>>>.el-textarea__inner {
  resize: none;
}

.bulletin-section>>>.el-form-item {
  margin-bottom: 4px;
}

.quotes-list {
  padding-bottom: 4px;
  text-align: left;
}

.quotes-list>>>.el-tag {
  margin-bottom: 5px;
  margin-right: 5px;
}

.quote-dialist {
  max-height: 400px;
  overflow-y: auto;
}

</style>
