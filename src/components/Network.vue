<template>
  <div>
    <div class="network">
        <h1 class="setting_title">网络</h1>
        <dl class="dllist">
          <dd class="dl_item"><strong>当前服务器地址：</strong>{{currentHost}}</dd>
        </dl>
        <el-form size="mini">
          <el-row :gutter="20">
            <el-col style="margin-bottom: 10px;">
              <el-input v-model="input_address" size="mini"></el-input>
            </el-col>
            <el-col style="margin-bottom: 10px;">
              <el-button size="mini" type="primary" @click="setHost()">设置</el-button>
            </el-col>
          </el-row>
        </el-form>
        <ul class="ullist">
          <li class="ullist-item" v-for="(host, index) in getHosts"
              :key="index">
            {{host.address}}@{{host.updated_at | time}}
            <el-button size="mini" type="primary" @click="setHost(host.address)">使用</el-button>
            <el-button size="mini" type="danger"  @click="removeHost(host.address)">删除</el-button>
          </li>
        </ul>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <span>查看seed的时候，请确认周围环境安全</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="centerDialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="showSeed()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 
        <strong>当前服务器地址: </strong>{{currentHost}}
        <input type="text" id="input_address" /><br>
        <input type="button" value="设置" @click="setHost()" /><br>
        <ul>
          <li v-for="host in getHosts">
            {{host.address}}@{{host.updated_at | time}}
            <input type="button" value="使用" @click="setHost(host.address)" />
            <input type="button" value="删除" @click="removeHost(host.address)" />
          </li>
        </ul>
     -->
  </div>

</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'

export default {
  name:"network",
  data() {
    return {
      address: this.$store.state.OXO.Address,
      seed: this.$store.state.OXO.Seed,
      input_address: ""
    }
  },
  computed: {
    currentHost: function() {
      return this.$store.state.OXO.CurrentHost;
    },
    ...mapGetters({
      getHosts: 'getHosts'
    })
  },
  methods: {
    setHost(address) {
      let self = this;
      if (address != null) {
        this.$store.commit({
          type: 'SetHost',
          address: address
        })
      } else {
        //address = document.querySelector('input#input_address').value.trim()
        address = this.input_address.trim();
        let regx = /^ws[s]?:\/\/.+/
        let rs = regx.exec(address)
        if (rs == null) {
          //alert('服务器地址格式不对，应该以ws://或wss://开头')
          self.$message({
            showClose: true,
            message: '服务器地址格式不对，应该以ws://或wss://开头!',
            type: 'error'
          });
        } else {
          this.$store.commit({
            type: 'SetHost',
            address: address
          })
          // document.querySelector('input#input_address').value = ''
          this.input_address = "";
        }
      }
    },
    removeHost(address) {
      this.$store.commit({
        type: 'RemoveHost',
        address: address
      })
    }
  }
}

</script>
<style scoped>
  .net_title{
    font-size: 30px;
    border-bottom: 1px solid #33333336;
    padding-bottom: 10px;
  }
  .network{
    text-align: left;
    padding-left: 20px; 
  }
  .dllist{
    padding-bottom: 10px; 
  }
  .dl_title{
    line-height: 34px;
    font-weight: bold;
  }
  .dl_item{
    line-height: 36px;
  }
  .ullist-item{
    margin-bottom: 10px;
  }
</style>