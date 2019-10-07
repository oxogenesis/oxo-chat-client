<template>
  <div>
    <router-link to="/">首页</router-link><br>
    种子文件: <input type="button" value="浏览" @click="importSeed()" /><span id="seed_path"></span><br>
    口令: <input type="password" name="password" id="input_password" /><br>
    <input type="button" value="解锁账号" @click="login()" /><br>
  </div>
</template>
<script>
const remote = window.require('electron').remote
const dialog = remote.dialog
const fs = window.require("fs")

let seedfile = null

export default {
  methods: {
    importSeed() {
      dialog.showOpenDialog({
        title: "浏览种子文件"
      }, filename => {
        try {
          fs.readFile(filename[0], 'utf8', function(err, data) {
            if (err) {
              document.querySelector('#seed_path').innerHTML = ""
              alert("文件不存在...")
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
      try {
        let password = document.querySelector('input#input_password').value.trim()
        let json = JSON.parse(seedfile)
        let key = this.oxo_api.halfSHA512(json["salt"] + password).toString('hex').slice(0, 32)
        let result = this.oxo_api.decrypt(key, json["iv"], json["ct"])
        json = JSON.parse(result)
        if (json != null) {
          this.$store.commit('InitAccount', json["seed"])
          this.$router.push('/Home')
        }
      } catch (e) {
        alert("<种子无效>或<口令错误>...")
      }
    }
  }
}

</script>
