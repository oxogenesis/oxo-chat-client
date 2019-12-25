<template>
  <div>
    <div class="network">
      <h1 class="setting_title">账号</h1>
      <dl class="dllist">
        <dd class="dl_item addressWrap">
          <div class="address">
            <strong>Address：</strong> <span>{{address}}</span>
            <input v-model="address" id="copyAddr">
          </div>
          <el-link type="primary" @click="copyAddress('copyAddr')">点击复制</el-link>
        </dd>
        <dd class="dl_item">
          <strong>Seed：</strong> <span>{{encrypedSeed}}</span>
          <input v-model="encrypedSeed" id="copySeeds">
          <el-link type="primary" v-show="!encryped" @click="copyAddress('copySeeds')">点击复制</el-link>
          <el-button size="mini" type="primary" @click="clickSeedBtn()">{{seedBtnText}}</el-button>
        </dd>
      </dl>
    </div>
    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
      <span>查看seed的时候，请确认周围环境安全</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="centerDialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="showSeed()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'

export default {
  name: "AccountInfo",
  data() {
    return {
      address: this.$store.state.OXO.Address,
      seed: this.$store.state.OXO.Seed,
      encryped: true, //加密
      centerDialogVisible: false
    }
  },
  computed: {
    ...mapGetters({
      getHosts: 'getHosts'
    }),
    seedBtnText: function() {
      if (this.encryped) {
        return "显示"
      } else {
        return "隐藏"
      }
    },
    encrypedSeed: function() {
      let len = this.seed.length,
        str = "*".repeat(len - 2),
        tmpStr = this.seed.substr(0, 2) + str;

      if (this.encryped) {
        return tmpStr;
      } else {
        return this.seed;
      }

    }
  },
  methods: {
    clickSeedBtn: function() {
      if (this.encryped) {
        this.centerDialogVisible = true;
      } else {
        this.encryped = true;
      }
    },
    showSeed() {
      this.encryped = false;
      this.centerDialogVisible = false;
    },
    copyAddress: function(idName) {
      var copyAddr = document.getElementById(idName);
      copyAddr.select();
      document.execCommand("copy");
      this.$message({
        message: '复制成功！',
        type: 'success'
      });
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

.addressWrap {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.address {
  margin-right: 10px;
}

#copyAddr,
#copySeeds {
  opacity: 0;
  position: absolute;
  left: -9999px;
}

</style>
