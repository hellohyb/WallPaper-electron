<template>
    <div class="search">
        <div class="showPapers">
                <ul>
                    <li v-for="item in paperCat.data" @click="showWhat(item)">
                        <img v-lazy :src="item.url" alt="" width="250" height="150">
                    </li>
                </ul>
        </div>
        
        <div class="show" v-if="show.show" @click.self="showWhat('')">
            <div class="leftImg">
                <img :src="imgInfo.data.url" alt="" style="width:100%;height: 100%;border-radius: 20px;">
            </div>
            <div class="rightMsg">
                    <p style="text-align:center;font-size: large;">图片信息</p>
                    <br/>
                    <p>名称：{{imgInfo.data.tag}}</p>
                    <br/>
                    <p>分辨率：4k</p>
                    <br/>
                    <p>来源：小鸟壁纸</p>
                    <button 
                    style="
                    width:100%;
                    height: 50px;
                    border-radius: 20px;
                    outline: none;
                    border: none;
                    cursor: pointer;
                    background: #00c588;
                    font-size: large;
                    margin-top:20px;
                    color:white;
                    "
                    @click="getAdd(imgInfo.data.url)"
                    >
                        设 为 壁 纸
                    </button>
            </div>
        </div>
    </div>
    
</template>

<script lang="ts" setup>
import {reactive,watch} from '@vue/runtime-core'
import axios from 'axios'
import {useRouter} from 'vue-router'
const router = useRouter()
let paperCat:any = reactive({
    data:''
})
// function showWhat(path){
//     // console.log(path)
// }
//点击展示图片
let imgInfo:any = reactive({
    data:''
})
function showWhat(info){
    imgInfo.data = info;
    show.show = !show.show;
}
let show:any = reactive({
    show:false
})
async function search(keywords){
    console.log(keywords)
    paperCat.data = '';
    try{
        const res = await axios.get(`http://wp.birdpaper.com.cn/intf/search?content=${keywords}&pageno=1&count=200`)
        console.log(res)
        paperCat.data = res.data.data.list;
        
    }catch(err){
        console.log(err);
    }
}
function getAdd(fileURL){
    let fs = require('fs');
    let request = require('request')
    let path = "C:\\Users\\Administrator\\Pictures\\wallpaper\\"
    if(!fs.existsSync(path)){ 
        fs.mkdirSync(path);
    }
    // console.log(add)
    let fileName = path+fileURL.substring(fileURL.length-10)
    if(fs.existsSync(fileName)){ //判断文件是否存在，如果存在则直接设置
        setWalls(fileName);
        alert("设置成功！")
    }else{ //如果不存在，则先下载图片，然后回调函数设置壁纸
        request(fileURL).pipe(fs.createWriteStream(fileName)).on('close',()=>{
        setWalls(fileName);
        alert("设置成功！")
    })
    }
}
//调用dll设置壁纸
function setWalls(values){
    let ffi:any = require('ffi-napi')
    let gbk = require('encoding')
//   let values:any = document.getElementById('iptss');
    const myDlls = ffi.Library('libwalls.dll',{
    'setWallpaper': ['void', ['string']]
  })
  myDlls.setWallpaper(gbk.convert(values,'GBK'));
}
//实时监听路由的变化
watch(
  () => router.currentRoute.value.params.key,
  (newRouterName: any) => {
    search(newRouterName)
  },
  { immediate: true }
)

</script>

<style lang="less" scoped>
.search{
    width: 100%;
    margin-top: 70px;
}
.showPapers{
    width: 88%;
    display: flex;
    justify-content: center;
    align-content: space-around;
    margin-left: 5%;
    float: left;
    ul{
        width: 100%;
        list-style: none;
        li{
            float: left;
            margin: 2px;
            width: 250px;
            height: 150px;
            border-radius: 10px;
            img{
                border-radius: 10px;
            }
            &:hover{
                box-shadow: 0px 0px 10px 5px #00c588;
            }
        }
    }
}
.show{
    margin-top: 60px;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    height: calc(100vh - 60px);
    background: rgba(rgb(205, 197, 197),.7);
    display: flex;
    justify-content: center;
    align-items: center;
    .leftImg{
        width: 70%;
        height: 80%;
        margin: 5px;
        background: rgba(226, 235, 200,.7);
        float: left;
        border-radius: 20px;
    }
    .rightMsg{
        width: 20%;
        height: 60%;
        background: rgba(226, 235, 200,.7);
        
        border-radius: 20px;
    }
}
</style>