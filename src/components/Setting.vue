<template>
  <div>
    <header-section></header-section>
    <div class="settings">
      <el-tabs :tab-position="tabPosition" style="min-height: 400px;">
        <el-tab-pane label="账号">
          <AccountInfo/>
        </el-tab-pane>
        <el-tab-pane label="网络">
          <network/>
        </el-tab-pane>
        <el-tab-pane label="联系人">
          <contact/>
        </el-tab-pane>
        <el-tab-pane label="群组">
          <group/>
        </el-tab-pane>
      </el-tabs>
    </div>
    <footer-section></footer-section>
   
    
  <!-- <div>
    <header-section></header-section>
    <h1>设置</h1>
    <h2>Address : {{address}}</h2>
    <h2>Seed : {{seed}}</h2>
    <router-link to="/Network">网络</router-link><br>
    <router-link to="/Contact">联系人</router-link><br>
    <router-link to="/Group">群组</router-link><br>
  </div> -->
  </div>
</template>
<script>
import HeaderSection from './section/HeaderSection.vue'
import FooterSection from './section/FooterSection.vue'
import network from './Network.vue'
import contact from './Contact.vue'
import group from './Group.vue'
import AccountInfo from './AccountInfo.vue'
//import { mapActions, mapMutations, mapGetters } from 'vuex'

export default {
  data() {
    return {
      // address: this.$store.state.OXO.Address,
      // seed: this.$store.state.OXO.Seed,
      tabPosition: 'left'
    }
  },
  components: {
    HeaderSection,
    FooterSection,
    network,
    contact,
    group,
    AccountInfo
  }
}

</script>
<style scoped>
  .settings{ 
    width: 1000px;
    margin: 30px auto;
  }

  .settings >>> .el-tabs--left .el-tabs__header.is-left {
    width: 30%;
  }
  .settings >>> .el-tabs__item{
    text-align: left;
    background: #eee;
    color: #000;
    margin-bottom: 4px;
  }
  .settings >>> .el-tabs__item.is-active {
    color: #fff;
    background: #409eff;
  }
  .settings >>> .el-tabs__active-bar{
    background: none;
  }
  .settings >>> .el-tabs__nav-wrap:after{
    background: none;
  }
</style>
