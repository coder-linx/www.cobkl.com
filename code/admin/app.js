var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
// var logger = require('morgan');
// 注册模版过滤器
var artTemplate = require('../lib/artTemplateFilter');

// 路由文件
var routers = require('./routes/routers');
// session秘钥
let secret = require('../config/secret').session;

var admin = express();

// view engine setup
admin.set('views', path.join(__dirname, 'views'));
// admin.set('view engine', 'jade');
// 修改模版引擎，采用art-template
admin.engine('art', artTemplate);
admin.set('view options', {
  debug: process.env.NODE_ENV !== 'production'
});
admin.set('view engine', 'art');

// admin.use(logger('dev'));
admin.use(express.json());
admin.use(express.urlencoded({ extended: false }));
admin.use(cookieParser());

// 使用express-session中间件在生产环境会出现内存泄露警告
admin.use(cookieSession({
  secret: secret,
  name: 'sid',
  // 10分钟过期
  maxAge: 10 * 60 * 1000
}));

routers(admin);

module.exports = admin;
