module.exports = {
  apps: [{
    // 进程列表中的进程名称
    name: 'gucx_subscribe',
    // 要启动的脚本路径，必填字段
    script: './bin/www',
    max_memory_restart: '128M',
  }]
};
