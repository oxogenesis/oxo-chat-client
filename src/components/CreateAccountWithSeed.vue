<template>
  <div>
    <router-link to="/">首页</router-link><br>
    种子: <input type="text" name="seed" id="input_seed" /><br>
    口令: <input type="password" name="password" id="input_password" /><br>
    口令确认: <input type="password" name="confirm" id="input_confirm" /><br>
    <input type="button" value="创建" @click="CreateAccount()" /><br>
  </div>
</template>
<script>
const remote = window.require('electron').remote
const dialog = remote.dialog
const fs = window.require("fs")
const oxoKeyPairs = require("oxo-keypairs")
const crypto = require("crypto")

export default {
  methods: {
    CreateAccount() {
      let seed = document.querySelector('input#input_seed').value;
      let password = document.querySelector('input#input_password').value
      let confirm = document.querySelector('input#input_confirm').value
      if (password != "") {
        if (password == confirm) {
          try {
            let keypair = oxoKeyPairs.deriveKeypair(seed)
            let address = oxoKeyPairs.deriveAddress(keypair.publicKey)

            let salt = crypto.randomBytes(16).toString('hex')
            console.log('salt:', salt)
            let key = this.oxo_api.halfSHA512(salt + password).toString('hex').slice(0, 32)
            console.log('key:', key)
            let iv = crypto.randomBytes(8).toString('hex')
            console.log('iv:', iv)
            let msg = { "seed": seed }
            let crypted = this.oxo_api.encrypt(key, iv, JSON.stringify(msg))
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
                  alert('账号创建成功，种子文件保存成功！')
                }
              })
            });
          } catch (e) {
            alert('种子无效...');
          }
        } else {
          alert("口令与口令确认不相同...")
        }
      } else {
        alert("口令不能为空...")
      }
    }
  }
}

</script>
