<template>

  <div>
    <outer-header/>

    <div class="login-box">
      <div class="login-inner">
        <h1 class="login-head">使用口令创建账号</h1>
        <div class="login-body">

          <el-form size="mini" label-width="100px"   @submit.native.prevent>
            <el-form-item label="口令：">
              <el-input  type="password" name="password" v-model="input_password"></el-input>
            </el-form-item>
            <el-form-item label="口令确认：">
              <el-input type="password" name="confirm" v-model="input_confirm" @keyup.enter.native="CreateAccount()"></el-input>
            </el-form-item>
            <el-form-item label-width="0" >
              <el-button type="primary" @click="CreateAccount()">创建</el-button>
              <router-link to="/" id="backup">
                <el-button type="primary">返回</el-button>
              </router-link>
            </el-form-item>
          </el-form>

        </div>
      </div>
    </div>

    <outer-footer/>
  </div>

      <!-- <router-link to="/">首页</router-link><br>
      口令: <input type="password" name="password" id="input_password" /><br>
      口令确认: <input type="password" name="confirm" id="input_confirm" /><br>
      <input type="button" value="创建" @click="CreateAccount()" /><br> -->

</template>
<script>
import { halfSHA512, encrypt } from '../utils/oxo.js'
import OuterHeader from './section/OuterHeader'
import OuterFooter from './section/OuterFooter'

const remote = window.require('electron').remote
const dialog = remote.dialog
const fs = window.require("fs")
const oxoKeyPairs = require("oxo-keypairs")
const crypto = require("crypto")


export default {
  name: "CreateAccountNew",
  data() {
    return {
      input_password: "",
      input_confirm: ""
    }
  },
  components:{
    OuterFooter,
    OuterHeader
  },
  methods: {
    CreateAccount() {
      // let password = document.querySelector('input#input_password').value.trim()
      // let confirm = document.querySelector('input#input_confirm').value.trim()
      let password = this.input_password.trim();
      let confirm = this.input_confirm.trim();
      let self = this;
      if (password != "") {
        if (password == confirm) {
          let seed = oxoKeyPairs.generateSeed(password, 'secp256k1')
          let keypair = oxoKeyPairs.deriveKeypair(seed)
          let address = oxoKeyPairs.deriveAddress(keypair.publicKey)

          let salt = crypto.randomBytes(16).toString('hex')
          console.log('salt:', salt)
          let key = halfSHA512(salt + password).toString('hex').slice(0, 32)
          console.log('key:', key)
          let iv = crypto.randomBytes(8).toString('hex')
          console.log('iv:', iv)
          let msg = { "seed": seed }
          let crypted = encrypt(key, iv, JSON.stringify(msg))
          console.log("crypted:", crypted)

          let save = { "salt": salt, "iv": iv, "ct": crypted }
          console.log("crypted:", JSON.stringify(save))

          dialog.showSaveDialog({
            title: "保存种子文件"
          }, filename => {
            fs.writeFile(filename, JSON.stringify(save), function(err) {
              if (err) {
                console.log('写文件操作失败')
              } else {
                //alert('账号创建成功，种子文件保存成功！')
                self.$message({
                  showClose: true,
                  message: '账号创建成功，种子文件保存成功！',
                  type: 'success'
                });

                setTimeout(() => {
                  document.getElementById("backup").click();
                }, 1000);
                
              }
            })
          });
        } else {
          //alert("口令与口令确认不相同...")
          self.$message({
            showClose: true,
            message: '口令与口令确认不相同',
            type: 'warning'
          });
        }
      } else {
        //alert("口令不能为空...")
        self.$message({
          showClose: true,
          message: '口令不能为空',
          type: 'warning'
        });
      }
    }
  }
}

</script>
<style scoped>
  #backup >>> a{
    color: #fff; 
  }
  #backup{
    margin-left: 30px;
  }
</style>