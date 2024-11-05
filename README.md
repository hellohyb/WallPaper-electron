# 桌面壁纸更换
# 当前为旧版本，2.0重构版本已完成（支持macos以及windows）： https://github.com/hellohyb/Wallpaper-electron2.0
## 总体效果
![image.png](https://cdn.nlark.com/yuque/0/2022/png/27284959/1669122212198-b3bd8dbe-c3bf-4516-9d87-927fc785ac76.png#averageHue=%232f6343&clientId=ue10592ff-7bb3-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=743&id=u4fabbb27&margin=%5Bobject%20Object%5D&name=image.png&originHeight=929&originWidth=1457&originalType=binary&ratio=1&rotation=0&showTitle=false&size=2347665&status=done&style=none&taskId=ub489a17f-c6fd-41f4-9552-7af0b097461&title=&width=1165.6)
### 概述：
**所用技术：**Vue3+Typescript+Vite+Electron<br />   以及一个用c++生成的dll动态链接库。<br />**内容介绍：**<br />1、全局功能：点击壁纸可显示详情，并可设置为壁纸（核心功能）；<br />2、推荐页：左侧为 随机推荐壁纸（轮播图形式展示），右侧为 简易时间展示以及壁纸缩略图；<br />3、壁纸库：左侧为分类，右侧为该分类下的壁纸。点击不同的分类请求不同的壁纸；<br />4、动态壁纸：点击选择文件按钮，选择一个本地视频文件，即可设置为动态壁纸；<br />5、搜索：输入你想要壁纸类型或名称，按下enter键或者点击搜索按钮，即可获取该类型的壁纸。

**壁纸设置原理（主要功能）：**<br />1、静态壁纸：点击‘设为壁纸’按钮后，先是检查是否已经下载过该壁纸，如果没有则下载该壁纸（利用request依赖）。然后把壁纸的存放地址传给dll动态链接库，dll通过该地址选择文件后设为壁纸。
```cpp
 const char* path = szFile;
//SystemParametersInfoA(0x0014,0,(PVOID)path,0x0002);
SystemParametersInfoA(SPI_SETDESKWALLPAPER,0,(PVOID)path,SPIF_UPDATEINIFILE);
```
2、动态壁纸：核心内容（ffi-napy模块，ffplay播放）。通过ffi-napi调用“use32",然后发送消息生成新窗口，然后创建并调用子进程（子进程运行ffplay），通过ffplay全屏循环播放视频，然后把播放视频窗口分配给之前生成的新窗口。
#### 动态壁纸原理参考：https://github.com/januwA/windows10-dynamic-wallpaper

壁纸api接口：

| 页面 | 调用接口 | 返回类型 |
| --- | --- | --- |
| 首页（推荐页） | https://www.dmoe.cc/random.php?return=json https://api.ixiaowai.cn/api/api.php?return=json https://tuapi.eees.cc/api.php?category=fengjing&type=json| json |
| 壁纸库 |  获取分类[http://wp.birdpaper.com.cn/intf/getCategory](http://wp.birdpaper.com.cn/intf/getCategory)<br />根据分类id获取对应数据<br />[http://wp.birdpaper.com.cn/intf/GetListByCategory?cids=id&pageno=1&count=500](http://wp.birdpaper.com.cn/intf/GetListByCategory?cids=${id}&pageno=1&count=500)<br />(其中：cids:对应分类id，pageno:页数，count：单页的壁纸数量)<br /> | json |
| 搜索 | [http://wp.birdpaper.com.cn/intf/search?content=keyword&pageno=1&count=200](http://wp.birdpaper.com.cn/intf/search?content=${keywords}&pageno=1&count=200)<br />搜索关键字：content=keyword，pageno：页数，count：单页壁纸数量 | json |






## 项目初始化

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
