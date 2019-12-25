<template>
  <li class="bulletin-list-item">
    <h5 class="bulletin-author-name">{{ getNameByAddress(bulletin.address) }}#{{ bulletin.sequence }}</h5>
    <h5 class="bulletin-quote-link" @click="addQuote(bulletin)">[引用]</h5>
    <h5 v-if="bulletin.quote_size" class="bulletin-quote-showlink" @click="loadQuote(bulletin)">[显示引用]</h5>
    <div class="bulletin-time">
      {{ bulletin.timestamp | time }}
    </div>
    <div class="bulletin-text" v-html="bulletin.content"></div>
  </li>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Bulletin',
  data: function() {
    return {
      address: this.bulletin.address,
      input_names: "",
      showEdit: false
    }
  },
  props: {
    bulletin: Object,
    refresh: Function,
    paShowEdit: Boolean
  },
  methods: {
    addQuote(bulletin) {
      console.log(`addQuote:bulletin`)
      console.log(bulletin)
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
