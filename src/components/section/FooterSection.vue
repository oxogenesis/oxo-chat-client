<template>
  <div class="inner-footer">
    <footer>
      <p>版本 0.1.1</p>
      <p>@copyright 2019-2020</p>
    </footer>
  </div>
</template>
<script>
export default {
  name: "InnerFooter"
}

</script>
<style scoped>
.inner-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
}

.inner-footer footer {
  height: 50px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4rem;
}

.inner-footer footer p {
  color: #000;
  text-align: center;
  font-size: 14px;
  line-height: 30px;
  max-width: 280px;
}

</style>
