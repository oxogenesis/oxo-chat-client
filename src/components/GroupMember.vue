<template>
  <div>
    <header-section></header-section>
    <h1>设置</h1>
    <router-link to="/Group">群组</router-link><br>
    <h1>{{this.$store.state.OXO.CurrentGroup.name}}</h1>
    {{this.$store.state.OXO.CurrentGroup.hash}}<br>
    @{{this.$store.state.OXO.CurrentGroup.timestamp | time}}<br>
    <ul>
      <li v-for="member in this.$store.state.OXO.CurrenrGroupMembers">
        {{getNameByAddress(member.address)}}
        @{{member.joined_at | time}}
        <input v-if="getCurrentGroupAddress != member.address && getCurrentGroupAddress == getAddress" type="button" value="移除" @click="removeMember()" />
        <br>
      </li>
    </ul>
  </div>
</template>
<script>
import HeaderSection from './section/HeaderSection.vue'
import { mapActions, mapMutations, mapGetters } from 'vuex'

export default {
  data() {
    return {
      group: {},
      members: []
    }
  },
  components: {
    HeaderSection
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
    removeMember() {
      let group_name = document.querySelector('input#input_group_name1').value
      if (group_name == "") {
        alert("群组名不能为空...")
        return
      } else {
        this.$store.commit({
          type: 'CreateGroup',
          group_name: group_name
        })
      }
    }
  }
}

</script>
