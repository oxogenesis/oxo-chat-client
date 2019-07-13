<template>
  <div class="bulletin-section">
    <div v-if="getQuotes.length">
      引用：<span @click="clearQuotes()">(清空)</span><br>
      <ul>
        <li v-for="quote in getQuotes">
          {{ quote.Name ? quote.Name : quote.Address}}#{{quote.Sequence}} <span @click="removeQuote(quote.Hash)">(X)</span>
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
  </div>
</template>
<script>
import Bulletin from './Bulletin.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'BulletinSection',
  components: { Bulletin },
  data() {
    return {
      content: ''
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
    })
  },
  created() {},
  methods: {
    publishBulletin() {
      if (this.content.trim() == "") {
        alert("消息不能为空...")
        return
      }

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
    }
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
