<template>
    <div class="outer-header">
        <header>
            <p>我选择做系统的主人，而不是系统的用户</p>
        </header>
    </div>
</template>
<script>
export default {
    name: "OuterHeader"
}
</script>
<style scoped>
    .outer-header header{
        height: 50px;
        background: #409eff;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .outer-header header p{
        color: #fff;
        text-align: center;
        font-size: 16px;
        line-height: 40px;
        font-family: "宋体";
    }
</style>