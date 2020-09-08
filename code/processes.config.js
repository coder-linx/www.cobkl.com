// 生产环境pm2配置

module.exports = {
  'apps': [{
    'name': 'cobkl',
    // 启动执行的初始脚本
    'script': 'bin/www',
    // 日志格式
    'log_date_format': 'YYYY-MM-DD HH:mm Z',
    'log_file': './log/cobkl.stdlog.log',
    'error_file': './log/cobkl.stderr.log',
    'out_file': './log/cobkl.stdout.log',
    'pid_file': './log/pids/cobkl.pid',
    // 在群集模式下，每个群集都有自己的日志文件。可以使用合并选项将所有日志收集到单个文件中：
    // 'merge_logs': true,
    // 运行实例的数目
    // 'instances': 6,
    'min_uptime': 3000,
    'max_restarts': 30,
    // 内存达到多少会自动restart
    'max_memory_restart': '950M',
    // 定时启动，解决重启能解决的问题,表示每天0点1分重启
    'cron_restart': '1 0 * * *',
    'env': {
      // 'COMMON_VARIABLE': 'true'
      'NODE_ENV': 'development'
    },
    'env_production': {
      'NODE_ENV': 'production'
    },
    // 监听文件变化
    /* 'watch': [
      'routes',
      'bin'
    ], */
    // 忽略监听的文件夹
    /* 'ignore_watch': [
      'node_modules',
      'public',
      'logs'
    ], */
    // NFS 设备需要设置
    /* 'watch_options': {
      'usePolling': true
    }, */
    'exec_interpreter': 'node',
    'exec_mode': 'fork',
    // 自动重启
    'autorestart': true,
    'vizion': false
  }]
};
