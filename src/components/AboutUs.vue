<template>
  <div>
    <outer-header />
    <div class="aboutUs">
      <h1 class="bigTitle">关于<small>about</small></h1>
      <div class="aboutCompony">
        <p class="detail">
          <strong>https://github.com/oxogenesis/oxo-chat-client</strong><br>
          <strong>公告对标微博</strong><br>
          <strong>会话对标微信</strong><br>
          <strong>优势：</strong><br>
          1、账号本地生成，不存在中心可以限制、封禁账号<br>
          2、公告数据本地保存，不会发生删贴、敏感词过滤<br>
          3、会话-私聊，实现客户端到客户端加密，只有会话客户端能解密消息<br>
          4、会话-群聊，群主审核入群请求，群消息可在任意两个成员间加密同步<br>
          5、所有数据均由账号签名，无法伪造<br>
          6、可以自建数据中继服务器，进一步提升服务质量和私密性<br>
          <strong>缺点：</strong><br>
          1、没有中心，联系人的账号需要手动备注昵称<br>
          2、没有中心，群的唯一标识是<创始账号+群号>，群名称需要手动备注<br>
            3、两个客户端需要同时连接同一中继服务器才能，交换数据<br>
            （客户端具备扩展连接多个中继服务器的能力，但暂时没时间做）<br>
        </p>
      </div>
      <div>
        <router-link class="link" to="/"><i class="el-icon-back"></i>返回首页</router-link>
      </div>
    </div>
    <outer-footer />
  </div>
</template>
<script>
import OuterHeader from './section/OuterHeader'
import OuterFooter from './section/OuterFooter'

export default {
  data() {
    return {}
  },
  components: {
    OuterFooter,
    OuterHeader
  }
}

</script>
<style scoped>
.aboutUs {
  width: 1000px;
  margin: 30px auto;
  color: #333;
}

.bigTitle small {
  text-indent: 2em;
  font-size: 14px;
  color: #999;
  font-weight: 400;
  display: block;
  padding-top: 8px;
  text-transform: Uppercase;
}

.aboutCompony {
  padding: 25px 36px;
  border: 1px solid #ccc;
  margin-bottom: 15px;
  text-align: left;
}

.detailTitle {
  padding: 10px 0;
  text-align: left;
  line-height: 30px;
  font-size: 20px;
}

.detail {
  font-size: 16px;
  word-wrap: break-word;
  line-height: 30px;
}

.link {
  color: #409eff;
}

</style>
