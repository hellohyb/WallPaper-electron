<template>
    <div class="home">
        <!-- <h1>首页</h1>
        <input id="iptss" type="file" ref="upload"
        accept="image/png, image/jpeg"
        @change="setWalls()"
        > -->
        <div>
            <ul>
                <li v-for="item in paperCat.data" @click="showWhat(item)">
                    <img :src="item.url" alt="" width="250" height="150">
                </li>
            </ul>
        </div>
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
                background: greenyellow;
                font-size: large;
                margin-top: 20px;
                "
                @click="getAdd(imgInfo.data.url)"
                >
                    设为壁纸
                </button>
        </div>
    </div>

</template>
<script lang="ts" setup>
import { onMounted, reactive } from '@vue/runtime-core';
import axios from 'axios'
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
// 存放api获取的分类数据
let paperCat:any = reactive({
    data:{}
});
//初始化首页
async function getPaper(){
    try{
        const res = await axios.get("http://wp.birdpaper.com.cn/intf/GetListByCategory?cids=36&pageno=1&count=30")
        paperCat.data = res.data.data.list;
    }catch(err){
        console.log(err);
    }
}
//点击展示图片
let imgInfo:any = reactive({
    data:''
})
//传入地址，设置壁纸，
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
function showWhat(info){
    imgInfo.data = info;
    show.show = !show.show;
}
let show:any = reactive({
    show:false
})

onMounted(()=>{
    getPaper();
})
</script>

<style lang="less" scoped>
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
        background: greenyellow;
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
.home{
    width: 100%;
    margin-top: 70px;
    display: flex;
    justify-content: center;
    align-content: space-around;
    ul{
        width: 100%;
        list-style: none;
        li{
            float: left;
            margin: 7px;
            width: 250px;
            height: 150px;
            border-radius: 10px;
            img{
                border-radius: 10px;
            }
            &:hover{
                box-shadow: 0px 0px 10px 5px yellowgreen;
            }
        }
    }
}
#iptss{
    background: teal;
    outline: none;
    width: 100px;
    height: 40px;
}
</style>