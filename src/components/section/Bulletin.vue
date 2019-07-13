<template>
  <li class="bulletin-list-item">
    <h5 class="bulletin-author-name">{{ bulletin.name }}#{{ bulletin.sequence }}</h5>
    <h5 class="bulletin-quote-link" @click="addQuote(bulletin)">[引用]</h5>
    <h5 v-if="bulletin.quote_size" class="bulletin-quote-link" @click="loadQuote(bulletin)">[显示引用]</h5>
    <div class="bulletin-time">
      {{ bulletin.timestamp | time }}
    </div>
    <div class="bulletin-text">{{ bulletin.content }}</div>
  </li>
</template>
<script>
export default {
  name: 'Bulletin',
  props: {
    bulletin: Object
  },
  methods: {
    addQuote(bulletin) {
    console.log(`addQuote:bulletin`)
    console.log(bulletin)
      this.$store.commit({
        type: 'AddQuote',
        name: bulletin.name,
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
    }
  }
}

</script>
