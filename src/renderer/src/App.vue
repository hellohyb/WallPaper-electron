<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Home from './components/Home.vue'
</script>

<template>
    <Navbar></Navbar>
    <Home></Home>
</template>

<style lang="less">
::-webkit-scrollbar{
  width: 10px;
}
// ::-webkit-scrollbar-track {
// background-color: yellowgreen;
// }
::-webkit-scrollbar-thumb {
background-color: yellowgreen;
border-radius: 10px;
}
*{
  margin:0;
  padding:0;
  outline: none;
  box-sizing: border-box;
}
img{
  cursor: pointer;
}
</style>
