<template>
    <div class="home">
        <!-- 侧边栏 -->
        <div class="leftBar">
            <ul id="init2">
                <li v-for="item in paperName.data" @click="setStyle_getPaper(item.old_id,$event)">
                {{item.category}}
                </li>
            </ul>
        </div>
        <!-- 壁纸展示 -->
        <div class="showPapers">
            <ul>
                <li v-for="item in paperCat.data" @click="showWhat(item)">
                    <img v-lazy :src="item.url" alt="" width="250" height="150">
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
// 存放api获取的分类壁纸
let paperCat:any = reactive({
    data:''
});
//存放分类名称
let paperName:any = reactive({
    data:''
})
// 初始化数据,获取分类
async function getCategory(){
    try{
        await axios.get("http://wp.birdpaper.com.cn/intf/getCategory")
        .then((res)=>{
            // console.log(res);
            paperName.data = res.data.data;
            
        }).then(()=>{
            let inits:any = document.getElementById('init2');
            inits.children[0].classList.add('active')
        })
        
        // console.log(paperName.data)
    }catch(err){
        console.log(err);
    }
}
//根据id获取壁纸
async function getPaper(id){
    paperCat.data = '';
    try{
        const res = await axios.get(`http://wp.birdpaper.com.cn/intf/GetListByCategory?cids=${id}&pageno=1&count=500`)
        paperCat.data = res.data.data.list;
    }catch(err){
        console.log(err);
    }
}


//侧边栏样式
function setStyle(event){
    let all = event.currentTarget.parentElement.children
    for(let i = 0; i < all.length;i++){
    all[i].classList.remove('active')
  }
  event.currentTarget.classList.add('active');
}
function setStyle_getPaper(id,event){
    getPaper(id);
    setStyle(event);
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
    if(paperCat.data == ''){
        getPaper(36); //默认选择4k壁纸（id为36）
        getCategory(); 
    }
})
</script>

<style lang="less" scoped>
.active{
  color: #00c588;
  background: white;
  // box-shadow: 0px 0px 15px 1px yellowgreen inset;
  border-bottom: 1px solid none;
}
// 点击图片展示样式
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
// 侧边栏样式
.leftBar{
    position: fixed;
    top: 77px;
    left: 0;
    float: left;
    width: 12%;
    height: calc(100vh - 70px);
    background: #f6f7f8;
    overflow: scroll;
    ul{
        list-style: none;
        
        li{
            width: 100%;
            padding: 10px 10px;
            font-size: smaller;
            text-align: center;
            cursor: pointer;
            &:hover{
                background: white;
            }
        }
    }
}
.showPapers{
    width: 88%;
    height: calc(100vh - 70px);
    margin-top: 70px;
    margin-left: 12%;
    display: flex;
    justify-content: center;
    align-content: space-around;
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
#iptss{
    background: teal;
    outline: none;
    width: 100px;
    height: 40px;
}
</style>