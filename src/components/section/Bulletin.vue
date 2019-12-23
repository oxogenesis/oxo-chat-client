<template>
  <li class="bulletin-list-item">
    <h5 class="bulletin-author-nameedit" v-show="showEdit">
      <input type="hidden" v-model="address" name="address">
      <el-input size="mini" v-model="input_names" name="input_names" class="input_names"></el-input>
      <el-button size="mini" type="primary" @click="addContact()">确定</el-button>
    </h5>
    <h5 v-show="!showEdit" class="bulletin-author-name" @click="editItem()">{{ getNameByAddress(bulletin.address) }}#{{ bulletin.sequence }}</h5>
    
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
  data: function () {
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
    editItem(){
      this.input_names = this.getNameByAddress(this.bulletin.address);
      //如果该数据是没有备注名的，则可以点击进行备注
      console.log("cxx", this.input_names);
      if(this.input_names === this.address){
        if(this.paShowEdit && this.paShowEdit){
          this.showEdit = true;
          this.$emit('changeShowEdit', false);
        }
      }
      
    },
    addContact() {
      let address = this.address.trim();
      let name = this.input_names;

      if (address == "" || name == "") {
        this.$message({
          showClose: true,
          message: '账号和备注名均不能为空',
          type: 'warning'
        });
        return;
      } else {
        this.$store.commit({
          type: 'AddContact',
          address: address,
          name: name
        });

        this.$nextTick(() => {
          this.showEdit = false;
          this.$emit('changeShowEdit', true);
        })
      }
    },
    // renameContact() {
    //   let address = this.address.trim();
    //   let name = this.input_names;
    //   let self = this;
    //   if (address == "" || name == "") {
    //     self.$message({
    //       showClose: true,
    //       message: '账号和备注名均不能为空',
    //       type: 'warning'
    //     });
    //     return;
    //   } else {
    //     this.$store.commit({
    //       type: 'RenameContact',
    //       address: address,
    //       name: name
    //     });

    //     setTimeout(()=>{
    //       this.showEdit = false;
    //       this.input_names = this.getNameByAddress(this.bulletin.address);
    //       this.SwitchBBSession(this.currentBBSession);
    //       this.$emit('changeShowEdit', true);
    //     },0)
       
    //   }
    // },
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
  .bulletin-author-nameedit{
    display: flex;
  }
  .bulletin-author-nameedit .el-input{
    width: 200px;
  }
  .input_names{
    width: 100px;
    margin-right: 6px;
  }
</style>