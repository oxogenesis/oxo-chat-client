<template>
  <div>
    <div class="group">
      <h1 class="setting_title">群组</h1>
      <el-form :label-position="labelPosition" label-width="80px" size="mini">
        <el-form-item label="群组名:">
          <el-input v-model="input_group_name1" name="group_name"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col style="margin-bottom: 10px;">
            <el-button size="mini" type="primary" @click="createGroup()">创建</el-button>
          </el-col>
        </el-row>
        <el-form-item label="创建者账号:">
          <el-input v-model="input_group_address" name="group_address"></el-input>
        </el-form-item>
        <el-form-item label="群号:">
          <el-input v-model="input_group_hash" name="group_hash"></el-input>
        </el-form-item>
        <el-form-item label="群组名:">
          <el-input v-model="input_group_name2" name="group_name"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col style="margin-bottom: 10px;">
            <el-button size="mini" type="primary" @click="joinRequest()">申请加入</el-button>
          </el-col>
        </el-row>
        <dl class="dllist">
          <dt class="dl_title">群组</dt>
        </dl>
        <ul class="group-list">
          <li v-for="(group,index) in getGroupSessions" :key="index">
            <div class="overTextEll group-name">
              <el-tooltip placement="left" effect="light">
                <div slot="content">{{group.name}}</div>
                <router-link :to="{name:'Sessions', params:{session:group.session}}">{{group.name}}</router-link>
              </el-tooltip>
            </div>
            (
            <span v-if="group.membership == 0">申请中</span>
            <span v-if="group.membership == 1">创建者</span>
            <span v-if="group.membership == 2">已加入</span>
            <span v-if="group.membership == 3">已退出</span>
            )：
            <span class="groupTime">{{group.timestamp | time}}</span>
            <el-button size="mini" type="primary" v-if="group.membership == 0 || group.membership == 3" @click="reRequest(1, group.address, group.session, group.name)">申请加入</el-button>
            <el-button size="mini" type="primary" v-if="group.membership == 2" @click="reRequest(0, group.address, group.session, group.name)">申请退出</el-button>
            <br>
            <div class="groupNumbers">
              <div class="overTextEll">
                <el-tooltip placement="left" effect="light">
                  <div slot="content">群号:{{group.session}}</div>
                  <span>群号:{{group.session}}</span>
                </el-tooltip>
              </div>
            </div>
            <router-link class="group-link" :to="{name:'GroupMember', params:{group_hash:group.session}}">成员列表</router-link>
          </li>
        </ul>
        <dl class="dllist">
          <dt class="dl_title">加入申请：</dt>
        </dl>
        <ul>
          <li v-for="(request,index) in this.$store.state.OXO.GroupRequests" :key="index">
            {{getNameByAddress(request.address)}}
            =>{{getGroupNameByHash(request.group_hash)}}
            @{{request.timestamp | time}}
            <el-button size="mini" type="primary" @click="permitJoin(request.address, request.group_hash, request.json)">同意</el-button>
            <br>
          </li>
        </ul>
      </el-form>
    </div>
  </div>
</template>
<script>
import HeaderSection from './section/HeaderSection.vue'
import GroupMember from './GroupMember.vue'
import { mapActions, mapMutations, mapGetters } from 'vuex'

//group
let GroupRequestActionCode = {
  "Join": 1,
  "Leave": 0
}

export default {
  name: "Group",
  data() {
    return {
      address: this.$store.state.OXO.Address,
      seed: this.$store.state.OXO.Seed,
      labelPosition: 'top',
      input_group_name1: "",
      input_group_address: "",
      input_group_hash: "",
      input_group_name2: "",

    }
  },
  components: {
    HeaderSection,
    GroupMember
  },
  computed: {
    ...mapGetters({
      getAddress: 'getAddress',
      getGroupNameByHash: 'getGroupNameByHash',
      getNameByAddress: 'getNameByAddress',
      getGroupSessions: 'getGroupSessions'
    })
  },
  methods: {
    createGroup() {
      let group_name = this.input_group_name1.trim();
      if (group_name == "") {
        this.$message({
          showClose: true,
          message: '群组名不能为空!',
          type: 'warning'
        });
        return;
      } else {
        this.$store.commit({
          type: 'CreateGroup',
          group_name: group_name
        })
      }
    },
    joinRequest() {
      let group_address = this.input_group_address.trim()
      let group_hash = this.input_group_hash.trim()
      let group_name = this.input_group_name2.trim()
      if (group_address == "" || group_hash == "" || group_name == "") {
        this.$message({
          showClose: true,
          message: '创建者账号、群号、群组名均不能为空!',
          type: 'warning'
        });
        return
      } else if (group_address == this.$store.state.OXO.Address) {
        this.$message({
          showClose: true,
          message: '你是这个群组的创始人!',
          type: 'warning'
        });
        return
      } else {
        this.$store.commit({
          type: 'GroupRequest',
          group_address: group_address,
          group_hash: group_hash,
          group_name: group_name,
          subaction: GroupRequestActionCode.Join
        })
      }
    },
    reRequest(subaction, group_address, group_hash, group_name) {
      this.$store.commit({
        type: 'GroupRequest',
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
      let address = this.input_address.trim()
      let name = this.input_name.trim()
      if (address == "" || name == "") {
        this.$message({
          showClose: true,
          message: '账号和备注名均不能为空!',
          type: 'warning'
        });
        return
      } else if (address == this.address) {
        this.$message({
          showClose: true,
          message: '不支持将自己作为联系人!',
          type: 'warning'
        });
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
        this.$message({
          showClose: true,
          message: '删除联系人，需先解除好友和关注!',
          type: 'warning'
        });
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
<style scoped>
.group {
  text-align: left;
  padding-left: 20px;
}

.group>>>.el-form-item__label {
  height: 34px;
  padding: 0;
}

.group>>>.el-form-item {
  margin-bottom: 10px;
}

.group>>>.el-input__inner {
  width: 100%;
}

.dllist {
  padding-bottom: 10px;
}

.dl_title {
  line-height: 34px;
  font-weight: bold;
}

.dl_item {
  line-height: 36px;
}

.groupTime {
  font-size: 12px;
  color: #938e8e;
  margin-left: 10px;
}

.group-list li {
  font-size: 16px;
  border-bottom: 1px solid #eee;
  margin-bottom: 5px;
  padding: 5px 0;
  line-height: 24px;
  word-break: break-word;
}

.group-link {
  color: #3a8ee6;
}

.group-list li a:hover {
  color: #3a8ee6;
  text-decoration: underline;
}


.overTextEll {
  display: inline-block;
  vertical-align: middle;
  max-width: 666px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 28px;
  line-height: 28px;
}

.group-name {
  max-width: 430px;
}

</style>
