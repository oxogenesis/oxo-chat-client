<template>
  <div class="contactOuter">
    <div class="contact setting_wrap">
      <el-form :label-position="labelPosition" label-width="80px" size="mini">
        <h1 class="setting_title">联系人</h1>
        <el-form-item label="账号：">
          <el-input v-model="input_address" name="address"></el-input>
        </el-form-item>
        <el-form-item label="备注名：">
          <el-input v-model="input_name" name="name"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col style="margin-bottom: 10px;">
            <el-button size="mini" type="primary" @click="addContact()">备注</el-button>
          </el-col>
        </el-row>
        <dl class="dllist">
          <dt class="dl_title">备注账号：</dt>
          <dd class="dl_item" id="tableWrap">
            <el-table :data="tabledata" style="width: 100%" max-height="300">
              <el-table-column prop="name" label="备注名" width="200">
              </el-table-column>
              <el-table-column prop="address" label="账号" width="200">
              </el-table-column>
              <el-table-column label="创建时间" width="200">
                <template slot-scope="scope">
                  {{scope.row.updated_at | time}}
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="280">
                <template slot-scope="scope">
                  <el-button size="mini" v-if="scope.row.address != getAddress" type="primary" icon="el-icon-plus" @click="addFriend(scope.row.address)">好友</el-button>
                  <el-button size="mini" v-if="scope.row.address != getAddress" type="primary" icon="el-icon-plus" @click="addFollow(scope.row.address)">关注</el-button>
                  <el-button size="mini" type="primary" icon="el-icon-document-copy" @click="copyAccount(scope.row.address)">复制账号</el-button>
                  <el-button size="mini" type="primary" icon="el-icon-edit" @click="editContact(scope.row)">修改</el-button>
                  <el-button size="mini" type="danger" icon="el-icon-delete" @click="sureRemoveContact(scope.row.address)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </dd>
        </dl>
        <dl class="dllist">
          <dt class="dl_title">关注：</dt>
          <dd class="dl_item">
            <ul>
              <li v-for="(follow,index) in this.$store.state.OXO.Follows" :key="index">
                <el-tooltip content="Bottom center" placement="left" effect="light">
                  <div slot="content">
                    {{getNameByAddress(follow)}}
                  </div>
                  <div class="contact-name-wrap">
                    <div class="contact-name">
                      <router-link :to="{name:'BBs',params:{address:follow}}">{{getNameByAddress(follow)}}</router-link>
                    </div>
                  </div>
                </el-tooltip>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="sureRemoveFollow(follow)">删除</el-button>
              </li>
            </ul>
          </dd>
        </dl>
        <dl class="dllist">
          <dt class="dl_title">好友：</dt>
          <dd class="dl_item">
            <ul>
              <li v-for="(friend,index) in this.$store.state.OXO.Friends" :key="index">
                <el-tooltip content="Bottom center" placement="left" effect="light">
                  <div slot="content">
                    {{getNameByAddress(friend)}}
                  </div>
                  <div class="contact-name-wrap">
                    <div class="contact-name">
                      <router-link :to="{name:'Sessions',params:{session:friend}}">{{getNameByAddress(friend)}}</router-link>
                    </div>
                  </div>
                </el-tooltip>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="sureRemoveFriend(friend)">删除</el-button>
              </li>
            </ul>
          </dd>
        </dl>
      </el-form>
    </div>
    <el-dialog title="修改备注信息" :visible.sync="editDialogVisible" width="40%">
      <el-form label-width="80px" size="mini">
        <el-form-item label="账号：">
          <el-input disabled v-model="editItem.input_address" name="address"></el-input>
        </el-form-item>
        <el-form-item label="备注名：">
          <el-input v-model="editItem.input_name" name="name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="editDialogVisible = false">取消</el-button>
        <el-button size="mini" type="primary" @click="renameContact()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import HeaderSection from './section/HeaderSection.vue'
import { mapActions, mapMutations, mapGetters } from 'vuex'

export default {
  name: "contact",
  data() {
    return {
      address: this.$store.state.OXO.Address,
      seed: this.$store.state.OXO.Seed,
      labelPosition: 'top',
      input_address: "",
      input_name: "",
      editDialogVisible: false,
      editItem: {
        input_address: "",
        input_name: "",
      },
      deleteDialogVisible: false

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
    }),
    tabledata: function() {
      return this.getContacts;
    }
  },
  methods: {
    addContact() {
      let address = this.input_address.trim()
      let name = this.input_name

      if (address == "" || name == "") {
        this.$message({
          showClose: true,
          message: '账号和备注名均不能为空',
          type: 'warning'
        });
        return;
      } else {
        this.$store.commit({
          type: 'AddContact',
          address: address,
          name: name
        })

        this.input_address = "";
        this.input_name = "";
      }
    },
    renameContact() {
      let address = this.editItem.input_address.trim()
      let name = this.editItem.input_name
      let self = this;
      if (address == "" || name == "") {
        self.$message({
          showClose: true,
          message: '账号和备注名均不能为空',
          type: 'warning'
        });
        return;
      } else {
        this.$store.commit({
          type: 'RenameContact',
          address: address,
          name: name
        });
        this.editDialogVisible = false;
      }
    },
    editContact: function(editItem) {
      this.editDialogVisible = true;
      if (editItem) {
        this.editItem = {
          input_address: editItem.address,
          input_name: editItem.name
        }
      }

    },
    sureRemoveContact: function(params) {
      this.$confirm('确定要删除这条记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeContact(params);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    sureRemoveFollow: function(params) {

      this.$confirm('确定要删除这条记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeFollow(params);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    sureRemoveFriend: function(params) {
      this.$confirm('确定要删除这条记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeFriend(params);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    copyText: function(text, callback) { // text: 要复制的内容， callback: 回调
      var tag = document.createElement('input');
      tag.setAttribute('id', 'copyInput');
      tag.value = text;
      document.getElementsByTagName('body')[0].appendChild(tag);
      document.getElementById('copyInput').select();
      document.execCommand('copy');
      document.getElementById('copyInput').remove();
      if (callback) { callback(text) }
    },
    copyAccount: function(str) {
      this.copyText(str, () => {
        this.$message({
          message: '复制成功！',
          type: 'success'
        });
      });
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
<style scoped>
.contact {
  text-align: left;
  padding-left: 20px;
}

.contact>>>.el-form-item__label {
  height: 34px;
  padding: 0;
}

.contact>>>.el-form-item {
  margin-bottom: 10px;
}

.contact-name-wrap {
  display: inline-block;
  font-weight: normal;
  margin-right: 20px;
  line-height: 28px;
  width: 210px;
}

.contact-name {
  display: inline-block;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 28px;
  line-height: 28px;
  vertical-align: middle;
}

.contact-name a:hover {
  color: #409eff;
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

.contactOuter>>>.el-dialog__body {
  padding: 10px 20px;
}

#tableWrap .el-button {
  margin-bottom: 3px;
}

.el-button+.el-button {
  margin-left: 0;
}

.contactOuter>>>.el-table td,
.contactOuter>>>.el-table th {
  padding: 5px 0;
}

</style>
