<template>
  <div>
    <div class="network">
      <h1 class="setting_title">网络（测试服务器：wss://ru.oxo-chat-server.com）</h1>
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
        <li class="ullist-item" v-for="(host, index) in getHosts" :key="index">
          {{host.address}}@{{host.updated_at | time}}
          <el-button size="mini" type="primary" @click="setHost(host.address)">使用</el-button>
          <el-button size="mini" type="danger" @click="removeHost(host.address)">删除</el-button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'

export default {
  name: "network",
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
        address = this.input_address.trim();
        let regx = /^ws[s]?:\/\/.+/
        let rs = regx.exec(address)
        if (rs == null) {
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
.net_title {
  font-size: 30px;
  border-bottom: 1px solid #33333336;
  padding-bottom: 10px;
}

.network {
  text-align: left;
  padding-left: 20px;
}

.dllist {
  padding-bottom: 10px;
}

.dl_title {
  line-height: 34px;
  font-weight: bold;
}

.dl_item {
  line-height: 36px;
}

.ullist-item {
  margin-bottom: 10px;
}

</style>
