<template>
  <div>
    <header-section></header-section>
    <div class="settings">
      <el-tabs :tab-position="tabPosition" style="min-height: 400px;">
        <el-tab-pane label="账号">
          <AccountInfo />
        </el-tab-pane>
        <el-tab-pane label="网络">
          <Network />
        </el-tab-pane>
        <el-tab-pane label="联系人">
          <Contact />
        </el-tab-pane>
        <el-tab-pane label="群组">
          <Group />
        </el-tab-pane>
        <el-tab-pane label="公告">
          <Bulletin />
        </el-tab-pane>
      </el-tabs>
    </div>
    <footer-section></footer-section>
  </div>
</template>
<script>
import HeaderSection from './section/HeaderSection.vue'
import FooterSection from './section/FooterSection.vue'
import AccountInfo from './AccountInfo.vue'
import Network from './Network.vue'
import Contact from './Contact.vue'
import Group from './Group.vue'
import Bulletin from './Bulletin.vue'

export default {
  data() {
    return {
      tabPosition: 'left'
    }
  },
  components: {
    HeaderSection,
    FooterSection,
    AccountInfo,
    Network,
    Contact,
    Group,
    Bulletin
  }
}

</script>
<style scoped>
.settings {
  width: 1000px;
  margin: 30px auto;
}

.settings>>>.el-tabs--left .el-tabs__header.is-left {
  width: 30%;
}

.settings>>>.el-tabs__item {
  text-align: left;
  background: #eee;
  color: #000;
  margin-bottom: 4px;
}

.settings>>>.el-tabs__item.is-active {
  color: #fff;
  background: #409eff;
}

.settings>>>.el-tabs__active-bar {
  background: none;
}

.settings>>>.el-tabs__nav-wrap:after {
  background: none;
}

</style>
