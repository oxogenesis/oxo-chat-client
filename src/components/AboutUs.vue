<template>
  <div>
    <outer-header/>

    <div class="aboutUs">
        <h1 class="bigTitle">企业简介<small>COMPANY PROFILE</small></h1>
        <div class="aboutCompony">
          <p class="detailTitle"><strong>公司概况</strong></p>
          <p class="detail">
            公司成立于xx年x月，是经xx批准成立的xx分公司，是xx网络股份有限公司在xx地区设立的办事处。注册资金xx万元人民币  ，流动资金xxx万元人民币。
            公司成立于xx年x月，是经xx批准成立的xx分公司，是xx网络股份有限公司在xx地区设立的办事处。注册资金xx万元人民币  ，流动资金xxx万元人民币。
            公司成立于xx年x月，是经xx批准成立的xx分公司，是xx网络股份有限公司在xx地区设立的办事处。注册资金xx万元人民币  ，流动资金xxx万元人民币。
            公司成立于xx年x月，是经xx批准成立的xx分公司，是xx网络股份有限公司在xx地区设立的办事处。注册资金xx万元人民币  ，流动资金xxx万元人民币。
            公司成立于xx年x月，是经xx批准成立的xx分公司，是xx网络股份有限公司在xx地区设立的办事处。注册资金xx万元人民币  ，流动资金xxx万元人民币。
            公司成立于xx年x月，是经xx批准成立的xx分公司，是xx网络股份有限公司在xx地区设立的办事处。注册资金xx万元人民币  ，流动资金xxx万元人民币。
          </p>
          <p class="detailTitle"><strong>系统简介</strong></p>
          <p class="detail">
            公司成立于xx年x月，是经xx批准成立的xx分公司，是xx网络股份有限公司在xx地区设立的办事处。注册资金xx万元人民币  ，流动资金xxx万元人民币。
            公司成立于xx年x月，是经xx批准成立的xx分公司，是xx网络股份有限公司在xx地区设立的办事处。注册资金xx万元人民币  ，流动资金xxx万元人民币。
            公司成立于xx年x月，是经xx批准成立的xx分公司，是xx网络股份有限公司在xx地区设立的办事处。注册资金xx万元人民币  ，流动资金xxx万元人民币。
            公司成立于xx年x月，是经xx批准成立的xx分公司，是xx网络股份有限公司在xx地区设立的办事处。注册资金xx万元人民币  ，流动资金xxx万元人民币。
            公司成立于xx年x月，是经xx批准成立的xx分公司，是xx网络股份有限公司在xx地区设立的办事处。注册资金xx万元人民币  ，流动资金xxx万元人民币。
            公司成立于xx年x月，是经xx批准成立的xx分公司，是xx网络股份有限公司在xx地区设立的办事处。注册资金xx万元人民币  ，流动资金xxx万元人民币。
          </p>
        </div>
        <div>
          <router-link class="link" to="/"><i class="el-icon-back"></i>返回首页</router-link>
        </div>
    </div>

    <outer-footer/>
  </div>
  
</template>

<script>

import OuterHeader from './section/OuterHeader'
import OuterFooter from './section/OuterFooter'

export default {
  data() {
    return {}
  },
  components: {
    OuterFooter,
    OuterHeader
  }
}

</script>

<style scoped>
  .aboutUs{
    width: 1000px;
    margin: 30px auto;
    color: #333;
  }
  .bigTitle small {
    font-size: 14px;
    color: #999;
    font-weight: 400;
    display: block;
    padding-top: 8px;
    text-transform: Uppercase;
  }
  .aboutCompony {
    padding: 25px 36px;
    border: 1px solid #ccc;
    margin-bottom: 15px;
    text-align: left;
  }
  .detailTitle{
    padding: 10px 0;
    text-align: left;
    line-height: 30px;
    font-size: 20px;
  }
  .detail{
    text-indent: 2em;
    font-size: 16px;
    word-wrap: break-word;
    line-height: 30px;
  }
  .link{
    color: #409eff;
  }
</style>