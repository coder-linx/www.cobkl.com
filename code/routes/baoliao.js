let link = require('../config/link');
let cityList = require('../config/cityList');
let xss = require('../lib/xss');
let getIpAddress = require('../lib/getIpAddress');
let baoliaoModel = require('../model/baoliao');
const createError = require('http-errors');
let express = require('express');
let router = express.Router();
let captcha = require('trek-captcha');
let md5 = require('blueimp-md5');
let baiduPush = require('../lib/baiduPush');
// 是否启用验证码
let enabledCaptcha = false;

/* GET baoliao listing. */
router.get('/', (req, res, next) => {
  let name = req.query.name || '';
  res.render('baoliao/baoliao', {
    name,
    active: 1,
    link,
    enabledCaptcha
  });
});
// 吐槽的验证码
router.get(link.baoliao.captcha, async (req, res, next) => {
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
  req.session.baoliaoCaptcha = md5(token);
  res.type('gif');
  res.end(buffer);
});
router.post('/', (req, res, next) => {
  if (!req.xhr) {
    throw new Error('async exception');
  }
  // 1分钟内不能再次评论
  if (req.session.baoliaoTime && (new Date().getTime() - req.session.baoliaoTime) < 1 * 60 * 1000) {
    res.json({
      code: '101',
      desc: '操作太快，请稍后再试'
    });
    return false;
  }
  let city = (req.body.city || '').trim();
  let name = (req.body.name || '').trim();
  let job = (req.body.job || '').trim();
  let contact = (req.body.contact || '').trim();
  let reason = (req.body.reason || '').trim();
  let details = (req.body.details || '').trim();
  let ip = (req.clientIp || '').trim();
  if (cityList.indexOf(city) === -1) {
    res.json({
      code: '101',
      desc: '公司坐标数据错误'
    });
    return false;
  }
  if (!name) {
    res.json({
      code: '101',
      desc: '公司名字不能为空'
    });
    return false;
  }
  if (!reason) {
    res.json({
      code: '101',
      desc: '吐槽原因不能为空'
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
    if (!req.session.baoliaoCaptcha || req.session.baoliaoCaptcha !== md5(captchaData)) {
      res.json({
        code: '101',
        desc: '验证码不正确'
      });
      return false;
    }
  }
  if (city.length > 30) {
    res.json({
      code: '101',
      desc: '所在城市不能超过30个文字'
    });
    return false;
  }
  if (name.length > 255) {
    res.json({
      code: '101',
      desc: '公司名字不能超过255个文字'
    });
    return false;
  }
  if (job.length > 255) {
    res.json({
      code: '101',
      desc: '职位不能超过255个文字'
    });
    return false;
  }
  if (contact.length > 60) {
    res.json({
      code: '101',
      desc: '职位不能超过60个文字'
    });
    return false;
  }
  if (reason.length > 255) {
    res.json({
      code: '101',
      desc: '吐槽原因不能超过255个文字'
    });
    return false;
  }
  // 根据ip查询地址
  getIpAddress(ip, (error, ipAddress) => {
    if (error) {
      console.error('ip地址查询错误：' + error);
    }
    baoliaoModel.appendCompany({
      name: name,
      address: city,
      job: job,
      contact: contact,
      reason: reason,
      content: xss(details),
      ip: ip,
      ipAddress: ipAddress
    }, (error, results, fields) => {
      if (error) {
        console.error('数据录入失败:' + error);
        res.json({
          code: '110',
          desc: '数据录入失败'
        });
        return false;
      }
      // 请求成功，把验证码置空
      req.session.baoliaoCaptcha = '';
      // 保存session，防止操作过快
      req.session.baoliaoTime = (new Date()).getTime();
      // 主动推送百度蜘蛛
      baiduPush(link.host + link.details.index + '/' + results.insertId);
      res.json({
        code: '100',
        desc: '成功',
        data: results.insertId
      });
    });
  });
});

module.exports = router;
