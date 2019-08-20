<template>
  <div>
    <header-section></header-section>
    <h1>设置</h1>
    <h3>Address : {{address}}</h3>
    群组名: <input type="text" name="group_name" id="input_group_name1" /><br>
    <input type="button" value="创建" @click="createGroup()" /><br>
    <br>
    创建者账号: <input type="text" name="group_address" id="input_group_address" /><br>
    群组Hash: <input type="text" name="group_hash" id="input_group_hash" /><br>
    群组名: <input type="text" name="group_name" id="input_group_name2" /><br>
    <input type="button" value="申请加入" @click="joinRequest()" /><br>
    <br>
    群组：<br>
    <ul>
      <li v-for="group in this.$store.state.OXO.GroupSessions">
        <router-link :to="{name:'Groups', params:{hash:group}}">{{getNameByHash(group)}}</router-link>:{{group}}
      </li>
    </ul>
    <br>
    群组请求：<br>
    <ul>
      <li v-for="request in this.$store.state.OXO.GroupRequests">
        <span v-if="request.address != getAddress">{{getNameByAddress(request.address)}}</span><br>
        <span v-if="request.subaction == 1">申请加入</span><br>
        {{request.group_name}}<span v-if="request.group_address != getAddress">({{getNameByAddress(request.group_address)}})</span><br>
        @{{request.timestamp | time}}<br>
        <input v-if="request.address == getAddress" type="button" value="重发" @click="reRequest(request.subaction, request.group_address, request.group_hash, request.group_name)" />
        <input v-if="request.group_address == getAddress" type="button" value="同意" @click="permitJoin(request.address, request.group_hash, request.json)" />
        <br>
      </li>
    </ul>
  </div>
</template>
<script>
import HeaderSection from './section/HeaderSection.vue'
import { mapActions, mapMutations, mapGetters } from 'vuex'

//group
let GroupRequestActionCode = {
  "Join": 1,
  "Leave": 0
}

export default {
  data() {
    return {
      address: this.$store.state.OXO.Address,
      seed: this.$store.state.OXO.Seed
    }
  },
  components: {
    HeaderSection
  },
  computed: {
    ...mapGetters({
      getAddress: 'getAddress',
      getNameByAddress: 'getNameByAddress',
      getNameByHash: 'getNameByHash'
    })
  },
  methods: {
    createGroup() {
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
    },
    joinRequest() {
      let group_address = document.querySelector('input#input_group_address').value
      let group_hash = document.querySelector('input#input_group_hash').value
      let group_name = document.querySelector('input#input_group_name2').value
      if (group_address == "" || group_hash == "" || group_name == "") {
        alert("群组Hash、创建者账号、群组名均不能为空...")
        return
      } else if (group_address == this.$store.state.OXO.Address) {
        alert("你是这个群组的创始人...")
        return
      } else {
        this.$store.commit({
          type: 'GroupSubactionRequest',
          group_address: group_address,
          group_hash: group_hash,
          group_name: group_name,
          subaction: GroupRequestActionCode.Join
        })
      }
    },
    reRequest(subaction, group_address, group_hash, group_name) {
      this.$store.commit({
        type: 'GroupSubactionRequest',
        group_address: group_address,
        group_hash: group_hash,
        group_name: group_name,
        subaction: subaction
      })
    },
    permitJoin(address, group_hash, json) {
      this.$store.commit({
        type: 'PermitJoin',
        address: address,
        group_hash: group_hash,
        json: json
      })
    },
    renameGroup() {
      let address = document.querySelector('input#input_address').value
      let name = document.querySelector('input#input_name').value
      if (address == "" || name == "") {
        alert("账号和备注名均不能为空...")
        return
      } else if (address == this.address) {
        alert("不支持将自己作为联系人...")
        return
      } else {
        this.$store.commit({
          type: 'RenameContact',
          address: address,
          name: name
        })
      }
    },
    dismissGroup(hash) {
      let result = this.$store.commit({
        type: 'RemoveContact',
        address: address
      })
      if (result == false) {
        alert("删除联系人，需先解除好友和关注")
      }
    },
    ...mapMutations({
      addFriend: 'AddFriend',
      removeFriend: 'RemoveFriend',
      addFollow: 'AddFollow',
      removeFollow: 'RemoveFollow'
    })
  }
}

</script>
