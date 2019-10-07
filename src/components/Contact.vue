<template>
  <div>
    <header-section></header-section>
    <h1>联系人</h1>
    账号: <input type="text" name="address" id="input_address" /><br>
    备注名: <input type="text" name="name" id="input_name" /><br>
    <input type="button" value="备注" @click="addContact()" /><br>
    <input type="button" value="修改" @click="renameContact()" /><br>
    备注账号：<br>
    <ul>
      <li v-for="contact in getContacts">
        {{contact.name}}({{contact.address}})<br>
        @{{contact.updated_at | time}}
        <input v-if="contact.address != getAddress" type="button" value="加为好友" @click="addFriend(contact.address)" />
        <input v-if="contact.address != getAddress" type="button" value="加为关注" @click="addFollow(contact.address)" />
        <input type="button" value="删除" @click="removeContact(contact.address)" />
      </li>
    </ul>
    关注：<br>
    <ul>
      <li v-for="follow in this.$store.state.OXO.Follows">
        <router-link :to="{name:'BBs',params:{address:follow}}">{{getNameByAddress(follow)}}</router-link>
        <input type="button" value="删除" @click="removeFollow(follow)" />
      </li>
    </ul>
    好友：<br>
    <ul>
      <li v-for="friend in this.$store.state.OXO.Friends">
        <router-link :to="{name:'Sessions',params:{session:friend}}">{{getNameByAddress(friend)}}</router-link>
        <input type="button" value="删除" @click="removeFriend(friend)" />
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
      getContacts: 'getContacts',
      getAddress: 'getAddress'
    })
  },
  methods: {
    addContact() {
      let address = document.querySelector('input#input_address').value.trim()
      let name = document.querySelector('input#input_name').value
      if (address == "" || name == "") {
        alert("账号和备注名均不能为空...")
        return
      } else {
        this.$store.commit({
          type: 'AddContact',
          address: address,
          name: name
        })
      }
    },
    renameContact() {
      let address = document.querySelector('input#input_address').value.trim()
      let name = document.querySelector('input#input_name').value
      if (address == "" || name == "") {
        alert("账号和备注名均不能为空...")
        return
      } else {
        this.$store.commit({
          type: 'RenameContact',
          address: address,
          name: name
        })
      }
    },
    ...mapMutations({
      removeContact: 'RemoveContact',
      addFriend: 'AddFriend',
      removeFriend: 'RemoveFriend',
      addFollow: 'AddFollow',
      removeFollow: 'RemoveFollow'
    })
  }
}

</script>
