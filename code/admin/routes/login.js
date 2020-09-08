const express = require('express');
const router = express.Router();
const createError = require('http-errors');
let captcha = require('trek-captcha');
let jwt = require('jsonwebtoken');
let md5 = require('blueimp-md5');

let loginModel = require('../model/login');
let link = require('../../config/link');
// 是否启用验证码
let enabledCaptcha = false;
// 登录错误次数
let loginErrorNum = 0;
// jwt秘钥
let secret = require('../../config/secret').jwt;

router.get('/', (req, res, next) => {
  const token = req.session.adminToken;
  let isVerify = false;
  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return;
      }
      if (decoded) {
        isVerify = true;
      }
    });
  }
  if (isVerify) {
    res.redirect(link.admin.index + link.admin.home.index);
    return;
  }
  res.render('login/login', {
    enabledCaptcha,
    link
  });
});

router.post('/', async (req, res, next) => {
  // 如果启用了验证码，则判断验证码是否正确
  if (enabledCaptcha) {
    let captchaData = (req.body.captcha || '').trim();
    if (!captchaData) {
      res.json({
        code: '101',
        desc: '验证码不能为空'
      });
      return false;
    }
    if (!req.session.adminLoginCaptcha || req.session.adminLoginCaptcha !== md5(captchaData)) {
      // 验证时失败，需要刷新验证码，防止攻击
      req.session.adminLoginCaptcha = '';
      res.json({
        code: '101',
        captcha: false,
        desc: '验证码不正确'
      });
      return false;
    }
  }
  let user = (req.body.user || '').trim();
  let password = (req.body.password || '').trim();
  let ip = (req.clientIp || '').trim();
  // 是否登录失败
  let isLoginFail = 0;
  if (!user || user.length < 5) {
    isLoginFail = 1;
  } else {
    // 查询数据库
    try {
      const result = await loginModel.selectUser(user);
      if (!result || result.length === 0) {
        isLoginFail = 1;
      } else if (result[0].password !== md5(password)) {
        isLoginFail = 1;
      }
    } catch (e) {
      console.error('admin登录错误：', e);
      isLoginFail = 1;
    }
  }
  if (isLoginFail === 1) {
    // 记录登录失败日志
    try {
      await loginModel.log({
        user,
        password,
        success: 0,
        ip
      });
    } catch (e) {
      console.error('admin登录日志错误：', e);
    }
    // 验证时失败，需要刷新验证码，防止攻击
    req.session.adminLoginCaptcha = '';
    // 错误次数大于三次，开启验证码，直到登录成功之后再将验证码关闭
    if (++loginErrorNum > 3) {
      enabledCaptcha = true;
    }
    res.json({
      code: '101',
      captcha: false,
      enabledCaptcha,
      desc: '用户名或密码不正确'
    });
    return false;
  }
  // 记录登录成功日志,登录成功不记录密码
  try {
    await loginModel.log({
      user,
      password: '',
      success: 1,
      ip
    });
  } catch (e) {
    console.error('admin登录日志错误：', e);
  }
  const token = jwt.sign({
    name: user
  }, secret, {
    // expiresIn: 60 * 60
    expiresIn: '1h'
  });
  req.session.adminToken = token;
  // 请求成功，把验证码置空
  req.session.adminLoginCaptcha = '';
  // 登录成功，将开启验证码设为false
  enabledCaptcha = false;
  loginErrorNum = 0;
  res.json({
    code: '100',
    desc: '成功'
  });
});
// 登录验证码
router.get(link.admin.login.captcha, async (req, res, next) => {
  if (!enabledCaptcha) {
    next(createError(500, 'captcha exception'));
    return;
  }
  const {
    token,
    buffer
  } = await captcha();
  // 写入文件方式
  // fs.createWriteStream('a.gif').on('finish', () => console.log(token)).end(buffer)
  req.session.adminLoginCaptcha = md5(token);
  res.type('gif');
  res.end(buffer);
});

module.exports = router;
