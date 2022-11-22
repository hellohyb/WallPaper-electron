<template>
  <div class="remd">
    <!-- 轮播图部分 -->
    <div class="top">
          <Swiper
          :autoplay="swiper_option.autoplay"
          :loop="swiper_option.loop"
          :speed="swiper_option.speed"
          :pagination="swiper_option.pagination"
          :navigation="swiper_option.navigation"
          @swiper="onSwiper"
          @sliderChange="onSlideChange"
        >
          <swiper-slide v-for="(item,index) in bigImg.data" :key="index">
            <img :src="item" alt="" width="700" height="450" @click="showWhat(item)">
          </swiper-slide>
        </Swiper>
        <div class="time">
          <div class="day">
            <span>
              {{SetTime.Day}}
            </span>
            <p>{{SetTime.Year}}-{{SetTime.Month}}</p>
          </div>
          <div class="date">
            {{SetTime.Hour}}:{{SetTime.Min}}:{{SetTime.Sec}}
          </div>
            
        </div>

        <div class="rightImg1">
          <ul style="list-style:none;">
            <li style="float:left;" v-for="item in bigImg.data">
              <img :src="item" alt="" @click="showWhat(item)">
            </li>
          </ul>
        </div>
        
        
    </div>

</div>
  <div class="show" v-if="show.show" @click.self="showWhat('')">
        <div class="leftImg">
            <img :src="imgInfo.data" alt="" style="width:100%;height: 100%;border-radius: 20px;">
        </div>
        <div class="rightMsg">
                <p style="text-align:center;font-size: large;">图片信息</p>
                <br/>
                <p>名称：{{imgInfo.data||''}}</p>
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
                background: #12c48b;
                font-size: large;
                margin-top:20px;
                color:white;
                "
                @click="getAdd(imgInfo)"
                >
                    设 为 壁 纸
                </button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { reactive } from "@vue/reactivity"
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/swiper-bundle.css'
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper";
import { onMounted } from "@vue/runtime-core";
import axios from "axios";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Autoplay]);
const onSwiper = (swiper) => {
        console.log(swiper);
      };
const onSlideChange = () => {
        console.log('slide change');
      };
const swiper_option = reactive({
  autoplay:{
    delay:2000,
    disableOnInteraction:false,
  },
  loop:true,
  speed:1000,
  pagination:{
    clickable:true
  },
  navigation: {
        nextEl: '.next_btn',
        prevEl: '.pre_btn'
  },
})
let bigImg:any = reactive({
  data:[]
})

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
//传入地址，设置壁纸，
function getAdd(fileURL){
  console.log(fileURL)
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
// https://www.dmoe.cc/random.php?return=json
// https://api.ixiaowai.cn/api/api.php?return=json
// https://tuapi.eees.cc/api.php?category=fengjing&type=json
function initBanner(){
  try{
    axios.get('https://www.dmoe.cc/random.php?return=json').then(res=>{
      bigImg.data.push(res.data.imgurl)
    })
    axios.get('https://api.ixiaowai.cn/api/api.php?return=json').then(res=>{
      bigImg.data.push(res.data.imgurl)
    })
    axios.get('https://api.mtyqx.cn/api/random.php?return=json').then(res => {
      bigImg.data.push(res.data.imgurl)
    })
    axios.get('https://tuapi.eees.cc/api.php?category=fengjing&type=json').then(res=>{
      bigImg.data.push(res.data.img)
    })
  }catch(e){
    console.log(e)
  }
}
let SetTime:any = reactive({
  Month:'00',
  Day:'00',
  Year:'00',
  Hour:'00',
  Min:'00',
  Sec:'00'
})
function forMat(date){
  return date > 9?date:'0'+date;
}

function getTime(){
  let date = new Date();
  SetTime.Month = forMat(date.getMonth() + 1);
  SetTime.Day = forMat(date.getDate());
  SetTime.Year = forMat(date.getFullYear());
  SetTime.Hour = forMat(date.getHours());
  SetTime.Min = forMat(date.getMinutes());
  SetTime.Sec = forMat(date.getSeconds());
}
setInterval(getTime,1000)
onMounted(()=>{
    initBanner()  
})
</script>

<style lang="less" scoped>
.remd{
    width: 100%;
    margin-top: 70px;
    padding-left: 20px;
    .top{
      box-sizing: border-box;
      width: 98%;
      height: 500px;
      padding:20px;
      // box-shadow: 1px 1px 5px 1px #12c48b inset;
      // border-radius: 20px;
   
      .swiper{
        width: 700px;
        height: 450px;
        float: left;
        border-radius: 20px;
        box-shadow: 0px 0px 0px 1px #12c48b;
      }
      .rightImg1{
        width: calc(100% - 705px);
        border-radius: 20px;
        margin-left: 5px;
        margin-top: 35px;
        // background: #00c588;
        box-sizing: border-box;
        box-shadow: 0px 0px 0px 1px #12c48b;
        float: left;
        display: flex;
        justify-content: center;
        user-select: none;
        ul{
          width: 100%;
          li{
            img{
              width: 180px;
              height: 130px;
              margin-right: 4px;
              margin-left: 2px;
              margin-top: 5px;
              border-radius: 10px;
            }
          }
        }
      }
      .time{
        width: calc(100% - 710px);
        height: 140px;
        border-radius: 20px;
        margin-left: 10px;
        box-shadow: 0px 0px 0px 1px #12c48b;
        float: left;
        box-sizing: border-box;
        user-select: none;
        .day{
          float: left;
          width:40%;
          height: 100%;
          background: #12c48b;
          border-radius: 20px;
          span{
            width: 100%;
            height: 80%;
            border-radius: 20px;
            display: block;
            text-align: center;
            line-height: 130px;
            font-size: 50px;
            color: white;
          }
          p{
            text-align: center;
            color: white;
            font-size: 18px;
          }
        }
        .date{
          width: 60%;
          height: 100%;
          // background: teal;
          float: left;
          text-align: center;
          line-height: 130px;
          font-size: 45px;
          color: #12c48b;
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
    z-index: 999;
    height: calc(100vh - 60px);
    background: rgba(rgb(205, 197, 197),.7);
    display: flex;
    justify-content: center;
    align-items: center;
    .leftImg{
        width: 70%;
        height: 80%;
        margin: 5px;
        background: rgba(50, 220, 84, 0.7);
        float: left;
        border-radius: 20px;
    }
    .rightMsg{
        width: 20%;
        height: 60%;
        background: rgba(226, 235, 200,.7);
        overflow: hidden;
        border-radius: 20px;
    }
}

</style>