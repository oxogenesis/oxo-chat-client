<template>

  <div>
    <div class="bulletin-section">
      <div v-if="getQuotes.length">
        <div class="quotes-list">
          引用：
          <el-tag
            v-for="quote in getQuotes"
            :key="quote.Address"
            closable
            @close="removeQuote(quote.Hash)">
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
            <el-button size="mini" type="primary" @click="publishBulletin()">发布</el-button>
          </el-form-item>
        </el-form>
      </div>
     

      <ul class="bulletin-list" ref="list">
        <bulletin v-for="(bulletin,index) in getBulletins" :bulletin="bulletin"
                  :key="index"
                  :paShowEdit = "false">
        </bulletin>
      </ul>

      <el-dialog
        ref="quote-list"
        title="当前引用列表"
        :visible.sync="dialogVisible"
        width="50%"
        @close='hideQuote()'>
        <ul class="quote-dialist">
          <bulletin v-for="(bulletin,index) in displayQuotes" 
                    :bulletin="bulletin"
                    :key="index"
                    :paShowEdit = "showEdit"
                    @changeShowEdit = "changeShowEdit">
          </bulletin>
        </ul>
      </el-dialog>
    </div>
  </div>

  <!-- <div class="bulletin-section">
    <div v-if="getQuotes.length">
      引用：<span @click="clearQuotes()">(清空)</span><br>
      <ul>
        <li v-for="quote in getQuotes">
          {{ getNameByAddress(quote.Address)}}#{{quote.Sequence}} <span @click="removeQuote(quote.Hash)">(X)</span>
        </li>
      </ul>
    </div>
    <textarea class="bulletin-composer" v-model="content"></textarea>
    <input type="button" value="发布" @click="publishBulletin()" /><br>
    <ul class="bulletin-list" ref="list">
      <bulletin v-for="bulletin in getBulletins" :bulletin="bulletin">
      </bulletin>
    </ul>
    <ul v-if="displayQuotes.length" class="bulletin-list" ref="quote-list">
      <li class="bulletin-list-item">
        <h5 class="bulletin-quote-link" @click="hideQuote()">关闭</h5>
      </li>
      <bulletin v-for="bulletin in displayQuotes" :bulletin="bulletin">
      </bulletin>
    </ul>
  </div> -->
</template>
<script>
import Bulletin from './Bulletin.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'BulletinSection',
  components: { Bulletin },
  data() {
    return {
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
    dialogVisible: function(){
      return this.displayQuotes.length;
    }
  },
  created() {},
  methods: {
    publishBulletin() {
      if (this.content.trim() == "") {
        //alert("消息不能为空...")
        this.$message({
          showClose: true,
          message: '消息不能为空!',
          type: 'warning'
        });
        return
      }
      this.content = this.content.replace(/\r/ig, "").replace(/\n/ig, "<br>");

      this.$store.dispatch({
        type: 'PublishBulletin',
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
    changeShowEdit: function (onoff) {
      this.showEdit = onoff;
    },
    ...mapActions({
      switchBBSession: 'SwitchBBSession'
    })
  }
  /*
  ,
  watch: {
    'session.lastBulletin': function () {
      this.$nextTick(() => {
        const ul = this.$refs.list
        ul.scrollTop = ul.scrollHeight
      })
    }
  }
  */
}

</script>
<style scoped>
  .bulletin-composer{
    padding: 0;
    margin: 0;
  }
  .bulletin-composer >>> .el-textarea__inner{
    resize: none;
  }
  .bulletin-section >>> .el-form-item{
    margin-bottom: 4px;
  }
  .quotes-list{
    padding-bottom: 4px;
    text-align: left;
  }
  .quotes-list >>> .el-tag{
    margin-bottom: 5px;
    margin-right: 5px; 
  }
  .quote-dialist{
    max-height: 400px;
    overflow-y: auto;
  }
</style>
