<template>
  <div class="dynamic">
    <div class="select">
      <span class="name">选 择 壁 纸</span>
      <input id="setWapper" type="file" @change="sets()" accept="video/*">
    </div>
    
  </div>
</template>

<script lang="ts" setup>



function sets(){
  let gbk = require('encoding')
  let values:any = document.getElementById("setWapper");
  console.log(values.files[0].path)
  setWappers(gbk.convert(values.files[0].path,'GBK'))
}
function setWappers(paths){
// const child_process = require('child_process')
const { fork } = require('child_process');
const ffi = require('ffi-napi');
// const child_process = require('child_process');
const W32 = new ffi.Library("user32", {
  // 检索顶级窗口的句柄，该顶级窗口的类名和窗口名与指定的字符串匹配。此功能不搜索子窗口。此功能不执行区分大小写的搜索。
  FindWindowW: ["int32", ["string", "string"]],
  // 将指定的消息发送到一个或多个窗口
  SendMessageTimeoutW: [
    "int32",
    ["int32", "int32", "int32", "int32", "int32", "int32", "int32"],
  ],

  // 通过将句柄传递给每个窗口，依次传递到应用程序定义的回调函数，可以枚举屏幕上所有的顶级窗口
  EnumWindows: ["bool", ["pointer", "int32"]],

  // 检索其类名和窗口名与指定字符串匹配的窗口的句柄。该功能搜索子窗口，从指定子窗口之后的子窗口开始。此功能不执行区分大小写的搜索。
  FindWindowExW: ["int32", ["int32", "int32", "string", "int32"]],

  // 更改指定子窗口的父窗口。
  // HWND SetParent(HWND hWndChild, HWND hWndNewParent);
  SetParent: ["int32", ["int32", "int32"]],

  // int MessageBox(
  //   HWND    hWnd, 要创建的消息框的所有者窗口的句柄。如果此参数为NULL，则消息框没有所有者窗口
  //   LPCTSTR lpText, 要显示的消息
  //   LPCTSTR lpCaption, 对话框标题
  //   UINT    uType 对话框的内容和行为
  // );
  MessageBoxW: ["int32", ["int32", "string", "string", "int32"]],

  // 最小化（但不破坏）指定的窗口。
  CloseWindow: ["bool", ["int32"]],

  // 销毁指定的窗口
  DestroyWindow: ["bool", ["int32"]],

  // 打开指定的桌面对象
  OpenDesktopW: ["int32", ["string", "int32", "bool", "int32"]],

  // 确定指定窗口的可见性状态。
  IsWindowVisible: ["bool", ["int32"]],

  // 设置指定窗口的显示状态。
  ShowWindow: ["bool", ["int32", "int32"]],
});
// const argv = process.argv.slice(2);
// if (!argv || !argv.length) process.exit(1);
//创建子进程。调用play.js模块
const play = fork(process.cwd() + "/play.js");
// ffplay -noborder -loop 0 -fs -vf scale=w=1920:h=-1 "${argv[0]}"
// -noborder 无边框
// -loop 0 循环次数，0无限循环
// -vf scale=w=1920:h=-1 使用scale滤镜, See also: https://trac.ffmpeg.org/wiki/Scaling
// ffplay -noborder -x 1920 -y 1080  无边框，强制设置宽高
play.send(`ffplay -noborder -x 1920 -y 1080 -left 0 -top -10 -loop 0 "${paths}" `);
play.on("message", playCallback);
function playCallback() {
  let ffplayw = 0; // ffplay句柄
  let t;
  t = setInterval(() => {
    // 获取ffplay句柄
    ffplayw = W32.FindWindowW(TEXT("SDL_app"), null);
    if (ffplayw !== 0) {
      clearInterval(t);
      setDynamicWallpaper(ffplayw);
    }
  }, 1000);
}
function setDynamicWallpaper(ffplayw) {
  const progman = W32.FindWindowW(TEXT("Progman"), null);
  // 要触发在桌面图标和墙纸之间创建WorkerW窗口，我们必须向程序管理器发送一条消息。
  // 该消息是未记录的消息，因此没有专用的Windows API名称，除了0x052C
  W32.SendMessageTimeoutW(
    progman,
    0x052c, // 在程序管理器上生成墙纸工作程序的未记录消息
    0,
    0,
    0x0000,
    1000,
    0
  );
  // 我们枚举所有Windows
  W32.EnumWindows(
    ffi.Callback("bool", ["int32", "int32"], (tophandle) => {
      // 找到一个具有SHELLDLL_DefView的Windows
      const SHELLDLL_DefView = W32.FindWindowExW(
        tophandle,
        0,
        TEXT("SHELLDLL_DefView"),
        0
      );
      if (SHELLDLL_DefView !== 0) {
        // 将其下一个同级分配给workerw。
        const workerw = W32.FindWindowExW(0, tophandle, TEXT("WorkerW"), 0);
        const isVisible = W32.IsWindowVisible(workerw);
        if (isVisible) {
          // 设置窗口为未激活状态，否则这个窗口会遮挡视频
          W32.ShowWindow(workerw, 0);
        }
        W32.SetParent(ffplayw, progman);
      }
      return true;
    }),
    0
  );
}
function TEXT(text) {
  return Buffer.from(`${text}\0`, "ucs2");
}
}
</script>

<style lang="less" scoped>
.select{
  width: 200px;
  height: 80px;
  position: relative;
  background: #00c588;
  border-radius: 15px;
  margin: 200px auto;
  &:hover{
    background: #06714f;
    
  }
  .name{
    width: 100%;
    height: 100%;
    position:absolute;
    text-align: center;
    line-height: 80px;
    font-size: 25px;
    top: 0;
    left: 0;
    color: white;
  }
}
#setWapper{
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
.dynamic{
    margin-top: 60px;
}

</style>