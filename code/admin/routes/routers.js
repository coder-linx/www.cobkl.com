/**
 * 项目路由
 * @Author: xionglin
 * @Date: 2018-06-26 16:17:28
 * @Last Modified by: xionglin
 * @Last Modified time: 2018-08-01 16:15:54
 */

let jwt = require('jsonwebtoken');
var link = require('../../config/link');
var loginRouter = require('./login');
var indexRouter = require('./index');
var companyRouter = require('./company');
// jwt秘钥
let secret = require('../../config/secret').jwt;

module.exports = function (app) {
  // 登录路由不需要拦截
  app.use(link.admin.login.index, loginRouter);

  // 建立拦截器，验证通过则每次刷新router都更新jwt的过期时间
  // 验证通不过则跳转登录
  app.use((req, res, next) => {
    const token = req.session.adminToken;
    let isVerify = false;
    if (token) {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return;
        }
        if (decoded) {
          // 重设过期时间1小时
          const token = jwt.sign({
            name: decoded.name
          }, secret, {
            // expiresIn: 60 * 60
            expiresIn: '1h'
          });
          req.session.adminToken = token;
          isVerify = true;
        }
      });
    }
    if (isVerify) {
      next();
      return;
    }
    // 如果是ajax请求
    if (req.xhr) {
      res.json({
        code: '190',
        desc: '请先登录'
      });
      return;
    }
    res.redirect(link.admin.index + link.admin.login.index);
  });
  app.use(link.admin.home.index, indexRouter);
  app.use(link.admin.company.index, companyRouter);
};
