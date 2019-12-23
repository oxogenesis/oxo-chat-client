<template>

  <div>
    <nav class="navwrap">
      <a class="navbar-brand" href="#">
          <img width="30px" height="30px" src="../../assets/app.png" alt="oxo-chat"/>
      </a>
      <div class="navbar navbar-collapse">
        <div class="navbox" id="navbox">
            <ul class="navbar-nav">
                <li :class="['nav-item', {'active': compareNavname('首页')}]" data-name="首页">
                  <router-link class="nav-link"  to="/Home">首页</router-link>
                </li>
                <li :class="['nav-item', {'active': compareNavname('公告')}]" data-name="公告">
                  <router-link class="nav-link"  to="/BBs">公告</router-link>
                </li>
                <li :class="['nav-item', {'active': compareNavname('会话')}]" data-name="会话">
                  <router-link class="nav-link"  to="/Sessions">会话</router-link>
                </li>
            </ul>
            <ul class="navbar-nav">
               <li class="nav-item">
                 <a class="nav-link">
                  <el-tooltip class="item" :content="address"  placement="bottom-start" effect="light">
                    <div>
                      <i :class="['el-icon-user-solid', getWSState]"></i> {{simplefiedAddress}}
                    </div>
                  </el-tooltip>
                 </a>
                </li>

                <li :class="['nav-item', {'active': compareNavname('设置')}]" data-name="设置">
                  <router-link class="nav-link" to="/Setting">
                    <i class="el-icon-s-tools"></i> 设置
                  </router-link>
                </li>
                <li :class="['nav-item', {'active': compareNavname('注销')}]" data-name="首页">
                  <a class="nav-link"  href="#" @click="logout()">
                    注销
                  </a>
                </li>
            </ul>
        </div>
      </div>
    </nav>
  </div>

  <!--<div class="header-section">
    <span :class="getWSState">●</span>
    <router-link to="/Home">首页</router-link>
    <router-link to="/BBs">公告</router-link>
    <router-link to="/Sessions">会话</router-link>
    <router-link to="/Setting">设置</router-link>
    <a href="#" @click="logout()">登出</a>
  </div> -->
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'HeaderSection',
  data() {
    return {
      address: this.$store.state.OXO.Address
    }
  },
  mounted: function () {
    
    let self = this;
    document.querySelectorAll("#navbox .nav-item").forEach((liItem)=>{
      liItem.addEventListener("click", function () {
        let choseStr = this.dataset.name || "";
        self.setHeader(choseStr);
      })
    })
  },
  methods: {
    logout() {
      this.$router.push('/Main')
      this.$store.commit('ResetAccount')
    },
    ...mapActions({
      setHeader: 'setHeader'
    }),
    compareNavname: function (str) {
      if(this.getNowChosedHeader == str){
        return true;
      }else{
        return false;
      }

    }
  },
  computed: {
    ...mapGetters({
      getWSState: 'getWSState',
      getPopUp: 'getPopUp',
      getNowChosedHeader: 'getNowChosedHeader'
    }),
    simplefiedAddress: function(){
      let len = this.address.length;
      if(len>16){
        return this.address.substr(0, 8) + "..." + this.address.substr(len-9, 8);
      }else{
        return this.address;
      }
     
    }
  },
  watch: {
    'getPopUp': function() {
      if (this.$store.state.OXO.PopUp != '') {
        //alert(this.$store.state.OXO.PopUp)
        this.$message({
          showClose: true,
          message: this.$store.state.OXO.PopUp,
          type: 'warning'
        });
        this.$store.state.OXO.PopUp = ''
      }
    }
  }
}

</script>
<style scoped>
  .navwrap{
    background-color: #f8f9fa;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
  }
  .navbar-brand{
    display: inline-block;
    padding-top: 0.3125rem;
    padding-bottom: 0.3125rem;
    margin-right: 1rem;
    font-size: 1.25rem;
    line-height: inherit;
    white-space: nowrap;
  }
  .navbar{
    flex-grow: 1;
    align-items: center;
  }
  .navbox{
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .navbar-collapse {
    flex-grow: 1;
    align-items: center;
  }
  .navbar-nav{
    display: flex;
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
  }
  .nav-link {
    display: block;
    padding: 0.5rem 1rem;
  }
  .active a{
    color: #409eff;
  }
</style>