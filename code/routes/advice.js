var link = require('../config/link');
var express = require('express');
var router = express.Router();
const createError = require('http-errors');
let adviceModel = require('../model/advice');
let captcha = require('trek-captcha');
let md5 = require('blueimp-md5');
let fn = require('../lib/fn');
let getIpAddress = require('../lib/getIpAddress');
// 是否启用验证码
let enabledCaptcha = false;

router.get('/', function (req, res, next) {
  res.render('advice/advice', {
    active: 3,
    link,
    enabledCaptcha
  });
});

// 验证码
router.get(link.advice.captcha, async (req, res, next) => {
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
  req.session.adviceCaptcha = md5(token);
  res.type('gif');
  res.end(buffer);
});

router.post('/', function (req, res, next) {
  if (!req.xhr) {
    throw new Error('async exception');
  }
  // 1分钟内不能再次评论
  if (req.session.adviceTime && (new Date().getTime() - req.session.adviceTime) < 1 * 60 * 1000) {
    res.json({
      code: '101',
      desc: '操作太快，请稍后再试'
    });
    return false;
  }
  let contact = (req.body.contact || '').trim();
  let content = (req.body.content || '').trim();
  let ip = (req.clientIp || '').trim();
  if (fn.filterHTMLTag(content).length < 5) {
    res.json({
      code: '101',
      desc: '内容不能少于5个字'
    });
    return false;
  }
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
    if (!req.session.adviceCaptcha || req.session.adviceCaptcha !== md5(captchaData)) {
      res.json({
        code: '101',
        desc: '验证码不正确'
      });
      return false;
    }
  }
  // 根据ip查询地址
  getIpAddress(ip, (error, ipAddress) => {
    if (error) {
      console.error('ip地址查询错误：' + error);
    }
    adviceModel.appendAdvice({
      content,
      contact,
      ip,
      ipAddress
    }, (error, results, fields) => {
      if (error) {
        console.error('数据录入失败:' + error);
        res.json({
          code: '110',
          desc: '操作失败'
        });
        return false;
      }
      // 请求成功，把验证码置空
      req.session.adviceCaptcha = '';
      // 保存session，防止操作过快
      req.session.adviceTime = (new Date()).getTime();
      res.json({
        code: '100',
        desc: '成功'
      });
      return false;
    });
  });
});

module.exports = router;
