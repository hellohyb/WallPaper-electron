<script setup lang="ts">
import Navbar from './components/Navbar.vue'
// import Home from './components/Home.vue'
// import Remd from './components/Remd.vue';
</script>

<template>
    <Navbar></Navbar>
    <keep-alive>
      <router-view/>
    </keep-alive>
</template>

<style lang="less">
::-webkit-scrollbar{
  width: 10px;
}
// ::-webkit-scrollbar-track {
// background-color: yellowgreen;
// }
::-webkit-scrollbar-thumb {
background-color: #00c588;
border-radius: 10px;
}
*{
  margin:0;
  padding:0;
  outline: none;
  box-sizing: border-box;
  user-select: none;
}
img{
  cursor: pointer;
}
</style>
