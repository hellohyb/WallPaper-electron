<template>
  <div class="topBar">
    <ul id="init">
      <div class="title">壁 纸</div>
      <li v-for="item in menu" class="classify" @click="addActive($event,item.path)">
        {{item.name}}
      </li>
      <div class="search">
        <input v-model="value.data" type="text" class="ipt" placeholder="搜索壁纸" @keydown.enter="searchImg()">
          <img :src="search" alt="" width="25" height="25"
           style="
           float:right;
           margin-right: 12px;
           margin-top: 7px;
           "
           @click="searchImg()"
           >
      </div>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted,reactive} from 'vue';
import search from '../assets/img/search.png'
import {useRouter} from 'vue-router'
const router=useRouter()
onMounted(()=>{
  init()
})
function init(){
  let inits:any = document.getElementById('init');
  inits.children[1].classList.add('active')
}

function addActive(event,path){
  let all = event.currentTarget.parentElement.children
  for(let i = 1; i < all.length;i++){
    all[i].classList.remove('active')
  }
  event.currentTarget.classList.add('active');
  router.push(path)
}
let value = reactive({
  data:''
})
function searchImg(){
  router.push('/search/'+value.data)
  // router.push('/search')
  
}
//导航栏菜单
let menu:any = [
  {
    id:1,
    name:'推荐',
    path:'/'
  },
  {
    id:2,
    name:'壁纸库',
    path:'/wallStore'
  },
  {
    id:3,
    name:'动态壁纸',
    path:'/dynamic'
  },
  {
    id:4,
    name:'设置',
    path:'/set'
  }
]
</script>

<style lang="less" scoped>
.active{
  color: #00c588;
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
        background:#00c588;
        text-align: center;
        color: white;
        line-height: 60px;
        box-sizing: border-box;
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
        cursor: pointer;
        &:hover{
          color: #00c588;
          background: white;
        }
      }
      .search{
        width: 250px;
        height: 60%;
        float: left;
        box-sizing: border-box;
        margin-top: 10px;
        margin-left: 20px;
        background: white;
        border-radius: 20px;
        .ipt{
            width: 80%;
            height: 90%;
            outline: none;
            margin-left: 10px;
            border:none;
            padding-left: 10px;
            font-size: medium;
        }
      }
    }
}
</style>

