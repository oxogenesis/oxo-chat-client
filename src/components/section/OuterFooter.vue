<template>
  <div class="outer-footer">
    <footer>
      <p>版本 0.1.1</p>
      <p>@copyright 2019-2020</p>
      <p>
        <router-link class="links" to="AboutUs">关于</router-link>
        <router-link class="links" to="Verify">校验Json</router-link>
      </p>
    </footer>
  </div>
</template>
<script>
export default {
  name: "OuterFooter"
}

</script>
<style scoped>
.outer-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
}

.outer-footer footer {
  height: 50px;
  background: #409eff;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.outer-footer footer p {
  color: #fff;
  text-align: center;
  font-size: 14px;
  line-height: 30px;
  max-width: 280px;
}

.links {
  color: #fff;
  text-align: center;
  font-size: 16px;
  line-height: 30px;
  cursor: pointer;
  padding: 0 10px;
}

.links:hover {
  color: #eee;
}

</style>
