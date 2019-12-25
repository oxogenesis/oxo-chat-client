<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
import 'font-awesome/css/font-awesome.min.css'  //字体
import 'element-ui/lib/theme-chalk/index.css'

export default {
  name: 'oxo-chat-client'
}

</script>
<style>
 /*清除浏览器默认样式 start*/
  body, ol, ul, dl, li, dt, dd, h1, h2, h3, h4, h5, h6, p, th, td, dl, dd, form, fieldset, legend, input, textarea,select{
      margin: 0;
      padding: 0;
  }
  article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {
      display: block
  }
  body {
      color: #282828;
      -webkit-tap-highlight-color: transparent;
  }
  h1, h2, h3, h4, h5 {
      font-weight: normal;
  }
  a {
      color: #333;
      text-decoration: none;
      transition: color .2s ease-out;
  }
  a:hover {
      text-decoration: none;
  }
  ol, ul, dl, li, dt, dd {
      list-style: none
  }
  img {
      border: 0;
      vertical-align: middle
  }
  a img {
      border: 0
  }
  table {
      border-collapse: collapse;
      border-spacing: 0
  }
  input, textarea {
      outline: none;
  }
  input, textarea {
      -webkit-appearance: none;
      border-radius: 0;
      -webkit-border-radius: 0;
      -moz-border-radius: 0;
      outline: none;
      padding: 0px;
      margin: 0;
  }
  /*清除浮动*/
  .clearfloat{
      zoom:1
  }
  .clearfix:after{
      display:block;
      clear:both;
      content:"";
  }
  .floatleft{
      float: left;
  }
  .floatright{
      float: right;
  }
  /*居中*/
  .center{margin: 0 auto}
  /***************end*******************/
  
#app {
  font-family: 'Microsoft YaHei', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding-bottom: 60px;
}

#app .connected{
  color:green;
}
#app .disconnected{
  color:red;
}

/*登录框*/
.login-box{
    width: 640px;
    margin: 100px auto;
    background: #eee;
}
.login-inner{
    padding: 20px 30px;
}
.login-head{
    font-size: 30px;
    line-height: 60px;
    height: 60px;
    border-bottom: 1px solid #3333334f;
    padding-bottom: 20px;
}
.login-body{
    padding: 30px 10px;
}
/*设置*/
.setting_title{
    font-size: 22px;
    line-height: 30px;
    border-bottom: 1px solid #33333336;
    padding-bottom: 10px;
    margin-bottom: 10px;
}

.chosedNav{
    color: #409eff;
    font-weight: 500;
}

.bigTitle{
    font-size: 24px;
    line-height: 30px;
    text-align: left;
}

</style>
