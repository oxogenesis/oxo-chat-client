<template>
  <div>
    <div class="groupMember">
      <header-section></header-section>
      <div class="groupMembody">
        <h1 class="bigTitle">群组成员</h1>
        <dl class="dllist">
          <dt class="dl_title">当前群组</dt>
          <dd><strong>群组名：{{this.$store.state.OXO.CurrentGroup.name}}</dd>
          <dd><strong>群号：</strong>{{this.$store.state.OXO.CurrentGroup.session}}</dd>
          <dd><strong>创建时间：</strong>{{this.$store.state.OXO.CurrentGroup.timestamp | time}}</dd>
        </dl>
        <dl class="dllist">
          <dt class="dl_title">当前成员列表：</dt>
          <dd>
            <ul>
              <li v-for="(member,index) in this.$store.state.OXO.CurrentGroupMembers"
                  :key="index">
                {{getNameByAddress(member.address)}}
                <span class="time-span">{{member.joined_at | time}}</span>
                <el-button v-if="getCurrentGroupAddress != member.address && getCurrentGroupAddress == getAddress"  @click="removeGroupMember(member.address)"  type="primary">移除</el-button>
              </li>
            </ul>
          </dd>
          <dd>
            <el-link type="primary" icon="el-icon-back" href="#/Setting">返回</el-link>
          </dd>
        <dl>
      </div>
      <footer-section/>
    </div>
    
  </div>
  <!-- <div>
    <header-section></header-section>
    <h1>设置</h1>
    <router-link to="/Group">群组</router-link><br>
    <h1>{{this.$store.state.OXO.CurrentGroup.name}}</h1>
    {{this.$store.state.OXO.CurrentGroup.session}}<br>
    @{{this.$store.state.OXO.CurrentGroup.timestamp | time}}<br>
    <ul>
      <li v-for="(member,index) in this.$store.state.OXO.CurrentGroupMembers"
          :key="index">
        {{getNameByAddress(member.address)}}
        @{{member.joined_at | time}}
        <input v-if="getCurrentGroupAddress != member.address && getCurrentGroupAddress == getAddress" type="button" value="移除" @click="removeGroupMember(member.address)" />
        <br>
      </li>
    </ul>
    <footer-section/>
  </div> -->

</template>
<script>
import HeaderSection from './section/HeaderSection.vue'
import FooterSection from './section/FooterSection.vue'
import { mapActions, mapMutations, mapGetters } from 'vuex'

export default {
  data() {
    return {
      group: {},
      members: []
    }
  },
  components: {
    HeaderSection,
    FooterSection
  },
  computed: {
    ...mapGetters({
      getAddress: 'getAddress',
      getCurrentGroupAddress: 'getCurrentGroupAddress',
      getNameByAddress: 'getNameByAddress'
    })
  },
  created() {
    this.$store.commit({
      type: 'LoadGroupMember',
      group_hash: this.$route.params.group_hash
    })
  },
  methods: {
    removeGroupMember(member_address) {
      this.$store.commit({
        type: 'RemoveGroupMember',
        group_hash: this.$route.params.group_hash,
        member_address: member_address
      })
    }
  }
}

</script>
<style scoped>
  .groupMembody{
    width: 1000px;
    margin: 30px auto;
    word-break: break-word;
  }
  .dllist{
    padding-bottom: 10px; 
    text-align: left;
    line-height: 34px;
    border-bottom: 1px solid #eee;
  }
  .dl_title{
    font-weight: bold;
    line-height: 34px;
  }
  .dl_item{
    line-height: 36px;
    font-size: 16px;
    line-height: 28px;
  }
  .time-span{
    color: #aad;
    font-size: 12px;
  }
  .groupMembody dd{
    word-break: break-all;
  }
</style>
