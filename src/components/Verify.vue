<template>
  <div>
    <outer-header />
    <div class="login-box">
      <el-form size="mini" align='left' label-width="100px" @submit.native.prevent>
        <el-form-item label="JSON：">
          <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 20}" name="json" v-model="input_json"></el-input>
        </el-form-item>
        <el-form-item label="账号：">
          <el-input type="text" name="json" v-model="address"></el-input>
        </el-form-item>
        <el-form-item label="结果：">
          <el-input type="text" name="json" v-model="result"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <router-link class="link" to="/"><i class="el-icon-back"></i>返回首页</router-link>
      </div>
    </div>
    <outer-footer />
  </div>
</template>
<script>
import { verifySignature } from '../utils/oxo.js'
import OuterHeader from './section/OuterHeader'
import OuterFooter from './section/OuterFooter'

const oxoKeyPairs = require("oxo-keypairs")

export default {
  name: "Verify",
  data: function() {
    return {
      input_json: "",
      address: "",
      result: ""
    }
  },
  components: {
    OuterFooter,
    OuterHeader
  },
  methods: {},
  watch: {
    'input_json': function() {
      if (this.input_json.trim() == "") {
        this.address = ""
        this.result = ""
        return
      }
      let self = this;
      try {
        let tmp_json = JSON.parse(self.input_json)
        let pk = tmp_json["PublicKey"]
        self.address = oxoKeyPairs.deriveAddress(pk)
        let sig = tmp_json["Signature"]
        delete tmp_json["Signature"]
        let msg = JSON.stringify(tmp_json)
        self.result = verifySignature(msg, sig, pk)
      } catch (e) {
        self.address = ""
        self.result = false
      }
    }
  }
}

</script>
<style scoped>
#backup>>>a {
  color: #fff;
}

#backup {
  margin-left: 30px;
}

</style>
