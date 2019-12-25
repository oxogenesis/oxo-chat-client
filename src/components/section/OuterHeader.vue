<template>
    <div class="outer-header">
        <header>
            <p>oxo-chat 一款你用了就会爱上的便捷聊天软件</p>
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