const child_process = require('child_process');
//创建子进程
  console.log("okkk?")
  process.on("message", (runFFplayCommand) => {
      process.send(true);
      child_process.execSync(runFFplayCommand);
  });



