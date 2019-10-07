<template>
  <div>
    <header-section></header-section>
    <h1>设置</h1>
    <router-link to="/Group">群组</router-link><br>
    <h1>{{this.$store.state.OXO.CurrentGroup.name}}</h1>
    {{this.$store.state.OXO.CurrentGroup.session}}<br>
    @{{this.$store.state.OXO.CurrentGroup.timestamp | time}}<br>
    <ul>
      <li v-for="member in this.$store.state.OXO.CurrentGroupMembers">
        {{getNameByAddress(member.address)}}
        @{{member.joined_at | time}}
        <input v-if="getCurrentGroupAddress != member.address && getCurrentGroupAddress == getAddress" type="button" value="移除" @click="removeGroupMember(member.address)" />
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
