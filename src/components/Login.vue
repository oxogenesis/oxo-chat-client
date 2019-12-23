<template>

<div>
    <el-form class="loginForm" size="mini" align='left' label-width="100px" @submit.native.prevent>
      <el-form-item label="种子文件："  >
        <el-button style="width: 100%;" size="mini" @click="importSeed()">选择文件<span style="padding-left: 10px;" id="seed_path"></span></el-button>
      </el-form-item>
      <el-form-item label="口令：">
        <el-input type="password" v-model="input_password" autocomplete="off" @keyup.enter.native="login()"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="width: 100%;" size="mini" type="primary" @click="login()">解锁账号</el-button>
      </el-form-item>
    </el-form>

  </div>
  
    <!-- <router-link to="/">首页</router-link><br>
    种子文件: <input type="button" value="浏览" @click="importSeed()" /><span id="seed_path"></span><br>
    口令: <input type="password" name="password" id="input_password" /><br>
    <input type="button" value="解锁账号" @click="login()" /><br> -->
</template>
<script>
const remote = window.require('electron').remote
const dialog = remote.dialog
const fs = window.require("fs")

let seedfile = null

export default {
  name: "Login",
  data: function(){
    return {
      input_password: ""
    }
  },
  methods: {
    importSeed() {
      let self = this;
      dialog.showOpenDialog({
        title: "浏览种子文件"
      }, filename => {
        try {
          fs.readFile(filename[0], 'utf8', function(err, data) {
            if (err) {
              document.querySelector('#seed_path').innerHTML = ""
              //alert("文件不存在...")
              self.$message({
                showClose: true,
                message: '文件不存在!',
                type: 'warning'
              });
            } else {
              document.querySelector('#seed_path').innerHTML = filename[0]
              seedfile = data.toString()
            }
          })
        } catch (e) {
          console.log(e)
        }
      })
    },
    login() {
      let self = this;
      try {
        // let password = document.querySelector('input#input_password').value.trim()
         let password = this.input_password.trim()
        let json = JSON.parse(seedfile)
        let key = this.oxo_api.halfSHA512(json["salt"] + password).toString('hex').slice(0, 32)
        let result = this.oxo_api.decrypt(key, json["iv"], json["ct"])
        json = JSON.parse(result)
        if (json != null) {
          this.$store.commit('InitAccount', json["seed"])
          this.$router.push('/Home')
        }
      } catch (e) {
        //alert("<种子无效>或<口令错误>...")
        self.$message({
          showClose: true,
          message: '种子无效或口令错误!',
          type: 'error'
        });
      }
    }
  }
}

</script>
