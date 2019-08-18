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
    <input type="button" value="申请加入" @click="joinGroup()" /><br>
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
        {{getNameByAddress(request.address)}}:{{getNameByAddress(request.group_address)}} :{{request.group_hash}}:{{request.group_name}}:{{request.subaction}}
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
      address: this.$store.state.OXO.Address,
      seed: this.$store.state.OXO.Seed
    }
  },
  components: {
    HeaderSection
  },
  computed: {
    ...mapGetters({
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
    joinGroup() {
      let group_address = document.querySelector('input#input_group_address').value
      let group_hash = document.querySelector('input#input_group_hash').value
      let group_name = document.querySelector('input#input_group_name2').value
      if (group_address == "" || group_hash == "" || group_name == "") {
        alert("群组Hash、创建者账号、群组名均不能为空...")
        return
      } else {
        this.$store.commit({
          type: 'JoinGroup',
          group_address: group_address,
          group_hash: group_hash,
          group_name: group_name
        })
      }
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
