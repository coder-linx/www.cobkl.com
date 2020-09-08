let express = require('express');
let path = require('path');
let createError = require('http-errors');
let cookieParser = require('cookie-parser');
let cookieSession = require('cookie-session');
// let session = require('express-session');
let logger = require('morgan');
// let sassMiddleware = require('node-sass-middleware');
let requestIp = require('request-ip');
// 注册模版过滤器
let artTemplate = require('./lib/artTemplateFilter');

// 静态文件虚拟目录
let link = require('./config/link');
let staticFolder = link.static;
// session秘钥
let secret = require('./config/secret').session;

// 路由文件
let routers = require('./routes/routers');

let app = express();

app.disable('x-powered-by');
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
// 修改模版引擎，采用art-template
app.engine('art', artTemplate);
app.set('view options', {
  debug: process.env.NODE_ENV !== 'production',
  htmlMinifierOptions: {
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    // 运行时自动合并：rules.map(rule => rule.test)
    ignoreCustomFragments: [],
    removeComments: true
  }
});
app.set('view engine', 'art');

app.use(function (req, res, next) {
  // 为什么在目前的系统和网络环境下，会有一个0000:0000:ffff:0000（0000可以被省略）IPv6前缀，以及在开发中我们应当保留吗？
  // 参考文献：https://stackoverflow.com/questions/29411551/express-js-req-ip-is-returning-ffff127-0-0-1
  // 将IPv4地址中的IPv6前缀去掉
  let ip = requestIp.getClientIp(req);
  if (ip && ip.substr(0, 7) === '::ffff:') {
    // 让requestIp中间件取值x-client-ip
    req.headers['x-client-ip'] = ip.substr(7);
  }
  next();
});
// 获取用户IP地址中间件
app.use(requestIp.mw());

app.use(logger(app.get('env') === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* let sess = {
  // 用于对sessionID的cookie进行签名，可以是一个string(一个secret)或者数组(多个secret)。
  // 如果指定了一个数组那么只会用 第一个元素对sessionID的cookie进行签名，其他的用于验证请求中的签名。
  secret: 'www-cobkl-com',
  // 在response中sessionID这个cookie的名称。也可以通过这个name读取，默认是connect.sid。
  // 如果一台机器上有多个app运行在同样的hostname+port, 那么你需要对这个sessin的cookie进行切割，
  // 所以最好的方法还是通过name设置不同的值
  name: 'sid',
  // 10分钟过期
  cookie: {
    maxAge: 10 * 60 * 1000
  },
  // 是指每次请求都重新设置session cookie，假设你的cookie是10分钟过期，每次请求都会再设置10分钟
  resave: true,
  // 是指无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid
  saveUninitialized: false
}

if (app.get('env') === 'production') {

  // Please note that secure: true is a recommended option.
  // However, it requires an https-enabled website, i.e., HTTPS is necessary for secure cookies.
  // If secure is set, and you access your site over HTTP, the cookie will not be set.
  // If you have your node.js behind a proxy and are using secure: true, you need to set "trust proxy" in express:

  // app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess)); */

// 使用express-session中间件在生产环境会出现内存泄露警告
app.use(cookieSession({
  secret: secret,
  name: 'sid',
  // 10分钟过期
  maxAge: 10 * 60 * 1000
}));

// scss改用gulp处理，不需要express处理
/* app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: false
})); */
// 生产环境使用nginx代理静态资源
if (app.get('env') !== 'production') {
  app.use('/favicon.ico', express.static(path.join(__dirname, 'public/favicon.ico')));
  app.use(staticFolder, express.static(path.join(__dirname, 'public')));
}

routers(app);

// 引入后台管理进程
let admin = require('./admin/app');
app.use(link.admin.index, admin);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = req.app.get('env') === 'development' ? err.message : 'Server Error';
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('common/error');
});

module.exports = app;
