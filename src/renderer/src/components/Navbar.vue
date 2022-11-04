<template>
  <div class="topBar">
    <ul id="init">
      <div class="title">WallPaper</div>
      <li v-for="item in menu" class="classify" @click="addActive($event)">
        {{item.name}}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
onMounted(()=>{
  init()
})
function init(){
  let inits:any = document.getElementById('init');
  inits.children[1].classList.add('active')
}

function addActive(event){
  let all = event.currentTarget.parentElement.children
  for(let i = 1; i < all.length;i++){
    all[i].classList.remove('active')
  }
  event.currentTarget.classList.add('active');
}
let menu:any = [
  {
    id:1,
    name:'推荐'
  },
  {
    id:2,
    name:'壁纸库'
  },
  {
    id:3,
    name:'动漫'
  },
  {
    id:4,
    name:'动态壁纸'
  },
  {
    id:5,
    name:'设置'
  }
]
</script>

<style lang="less" scoped>
.active{
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  color: yellowgreen;
  background: white;
  // box-shadow: 0px 0px 15px 1px yellowgreen inset;
  border-bottom: 1px solid none;
}
.topBar{
    width: 100%;
    height: 60px;
    user-select: none;
    position: fixed;
    background: #f6f7f8;
    top: 0;
    left: 0;
    ul{
      width: 100%;
      height: 100%;
      // background: yellowgreen;
      list-style: none;
      .title{
        width: 150px;
        height: 100%;
        float: left;
        background:rgb(212, 247, 193);
        text-align: center;
        line-height: 60px;
        box-sizing: border-box;
        border-bottom-right-radius: 10px;
        font-size: larger;
      }
      li{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 120px;
        height: 100%;
        text-align: center;
        margin:0;
        // padding:20px 40px;
        float: left;
        font-size: large;
        // border-bottom: 1px solid yellowgreen;
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
        cursor: pointer;
        &:hover{
          color: yellowgreen;
          background: white;
        }
      }
    }
}
</style>

