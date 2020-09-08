const link = require('../config/link');
const detailsModel = require('../model/details');
const createError = require('http-errors');
const express = require('express');
const router = express.Router();
let xss = require('../lib/xss');
let getIpAddress = require('../lib/getIpAddress');
let captcha = require('trek-captcha');
let md5 = require('blueimp-md5');
let fn = require('../lib/fn');
let ids = require('../config/secret').ids;
let Hashids = require('hashids');
// 是否启用验证码
let enabledCaptcha = false;

// uuid解密方法
let hashids = new Hashids(ids);

// 发表评论的验证码
router.get(link.details.captcha, async (req, res, next) => {
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
  req.session.commentCaptcha = md5(token);
  res.type('gif');
  res.end(buffer);
});

// 发表评论
router.post(link.details.comment, async (req, res, next) => {
  try {
    if (!req.xhr) {
      throw new Error('async exception');
    }
    // 1分钟内不能再次评论
    if (req.session.commentTime && (new Date().getTime() - req.session.commentTime) < 1 * 5 * 1000) {
      res.json({
        code: '101',
        desc: '评论太快，请稍后再试'
      });
      return false;
    }
    let id = req.body.id - 0;
    let comment = (req.body.comment || '').trim();
    let ip = (req.clientIp || '').trim();
    if (!Number.isInteger(id)) {
      res.json({
        code: '101',
        desc: '参数异常'
      });
      return false;
    }
    if (fn.filterHTMLTag(comment).length < 2) {
      res.json({
        code: '101',
        desc: '评论内容不能少于2个字'
      });
      return false;
    }
    if (comment.length > 510) {
      res.json({
        code: '101',
        desc: '评论内容太多了，删减一点吧'
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
      if (!req.session.commentCaptcha || req.session.commentCaptcha !== md5(captchaData)) {
        res.json({
          code: '101',
          desc: '验证码不正确'
        });
        return false;
      }
    }
    let details = await detailsModel.selectDetails(id);
    if (details.length === 0) {
      res.json({
        code: '101',
        desc: '评论的吐槽不存在'
      });
      return false;
    }
    // 根据ip查询地址
    getIpAddress(ip, (error, ipAddress) => {
      if (error) {
        console.error('ip地址查询错误：' + error);
      }
      detailsModel.insertComment({
        id: id,
        comment: xss(comment),
        ip: ip,
        ipAddress: ipAddress
      }, (error, results) => {
        if (error) {
          console.error('数据录入失败:' + error);
          res.json({
            code: '110',
            desc: '数据录入失败'
          });
          return false;
        }

        // 请求成功，把验证码置空
        req.session.commentCaptcha = '';
        // 保存session，防止评论过快
        req.session.commentTime = (new Date()).getTime();
        res.json({
          code: '100',
          desc: '成功',
          data: [{
            id: results.insertId,
            content: xss(comment),
            city: ipAddress,
            agree: 0,
            oppose: 0,
            createtime: parseInt((new Date()).getTime() / 1000)
          }]
        });
      });
    });
  } catch (error) {
    console.error('评论异常：' + error);
    res.json({
      code: '120',
      desc: '失败'
    });
    return false;
  }
});

// 评论点赞
router.post(link.details.commentLike, (req, res, next) => {
  if (!req.xhr) {
    throw new Error('async exception');
  }
  let id = req.body.id - 0;
  let data = req.body.data - 0;
  let ip = (req.clientIp || '').trim();
  if (!id || !Number.isInteger(id)) {
    res.json({
      code: '101',
      desc: '参数异常'
    });
    return false;
  }
  if (data !== 1 && data !== 0) {
    res.json({
      code: '101',
      desc: '参数异常'
    });
    return false;
  }
  detailsModel.selectLikeCommentData({
    id: id,
    ip: ip,
    data: data
  }, (error, results, fields) => {
    if (error) {
      console.error('查询失败:' + error);
      res.json({
        code: '110',
        desc: '操作失败'
      });
      return false;
    }
    if (results.length > 0) {
      res.json({
        code: '200',
        desc: '已经点过了'
      });
      return false;
    }
    detailsModel.likeComment({
      id: id,
      ip: ip,
      data: data
    }, (error, results, fields) => {
      if (error) {
        console.error('数据录入失败:' + error);
        res.json({
          code: '110',
          desc: '操作失败'
        });
        return false;
      }
      res.json({
        code: '100',
        desc: '成功'
      });
      return false;
    });
  });
});

// 文章点赞
router.post(link.details.like, (req, res, next) => {
  if (!req.xhr) {
    throw new Error('async exception');
  }
  let id = req.body.id - 0;
  let data = req.body.data - 0;
  let ip = (req.clientIp || '').trim();
  if (!id || !Number.isInteger(id)) {
    res.json({
      code: '101',
      desc: '参数异常'
    });
    return false;
  }
  if (data !== 1 && data !== 0) {
    res.json({
      code: '101',
      desc: '参数异常'
    });
    return false;
  }
  detailsModel.selectLikeDetailsData({
    id: id,
    ip: ip,
    data: data
  }, (error, results, fields) => {
    if (error) {
      console.error('查询失败:' + error);
      res.json({
        code: '110',
        desc: '操作失败'
      });
      return false;
    }
    if (results.length > 0) {
      res.json({
        code: '200',
        desc: '已经点过了'
      });
      return false;
    }
    detailsModel.likeDetails({
      id: id,
      ip: ip,
      data: data
    }, (error, results, fields) => {
      if (error) {
        console.error('数据录入失败:' + error);
        res.json({
          code: '110',
          desc: '操作失败'
        });
        return false;
      }
      res.json({
        code: '100',
        desc: '成功'
      });
      return false;
    });
  });
});

// 根据id查询详情
async function getDetailsById (req, res, next) {
  try {
    const id = req.params.id - 0;
    // 分处理，如果是id的文章，则使用id查询数据，否则使用uuid逻辑
    const pageNo = (req.params.pageNo || 1) - 0;
    const pageSize = 50;
    const startIndex = (pageNo - 1) * pageSize;
    // 如果是ajax请求评论分页，则返回JSON数据
    if (req.xhr) {
      if (!id || !Number.isInteger(id)) {
        res.json({
          code: '101',
          desc: 'URL异常'
        });
        return false;
      }
      if (!pageNo || !Number.isInteger(pageNo)) {
        res.json({
          code: '101',
          desc: 'URL异常'
        });
        return false;
      }
      let comment = await detailsModel.selectComment(id, startIndex, pageSize);
      res.json({
        code: '100',
        desc: '成功',
        data: comment
      });
      return;
    }
    if (!id || !Number.isInteger(id)) {
      throw new Error('param exception');
    }
    if (!pageNo || !Number.isInteger(pageNo)) {
      throw new Error('param exception');
    }
    let details = await detailsModel.selectDetails(id);
    if (details.length === 0) {
      next(createError(404));
      return;
    }
    let comment = await detailsModel.selectComment(id, startIndex, pageSize);
    let count = await detailsModel.countComment(id);
    let commentTotal = count[0].total;
    // 总页数
    let commentPageTotal = Math.ceil(commentTotal / pageSize);
    res.render('details/details', {
      active: 2,
      details: details[0],
      comment: comment,
      commentTotal: commentTotal,
      commentPageNo: pageNo,
      commentPageTotal: commentPageTotal,
      startIndex: startIndex,
      link,
      enabledCaptcha
    });
  } catch (error) {
    console.error('文章详情页异常：' + error);
    // async函数，需要显示的调用next方法
    next(createError(500, 'select exception'));
  }
}

// 根据uuid查询详情
async function getDetailsByUuid (req, res, next) {
  try {
    const uuid = req.params.id;
    // 分处理，如果是id的文章，则使用id查询数据，否则使用uuid逻辑
    const pageNo = (req.params.pageNo || 1) - 0;
    const pageSize = 50;
    const startIndex = (pageNo - 1) * pageSize;
    // 先查询详情页数据，获取id
    let details = await detailsModel.selectDetailsByUuid(uuid);
    if (details.length === 0) {
      next(createError(404));
      return;
    }
    let id = details[0].id;
    // 如果是ajax请求评论分页，则返回JSON数据
    if (req.xhr) {
      if (!pageNo || !Number.isInteger(pageNo)) {
        res.json({
          code: '101',
          desc: 'URL异常'
        });
        return false;
      }
      let comment = await detailsModel.selectComment(id, startIndex, pageSize);
      res.json({
        code: '100',
        desc: '成功',
        data: comment
      });
      return;
    }
    if (!pageNo || !Number.isInteger(pageNo)) {
      throw new Error('param exception');
    }
    let comment = await detailsModel.selectComment(id, startIndex, pageSize);
    let count = await detailsModel.countComment(id);
    let commentTotal = count[0].total;
    // 总页数
    let commentPageTotal = Math.ceil(commentTotal / pageSize);
    res.render('details/details', {
      active: 2,
      details: details[0],
      comment: comment,
      commentTotal: commentTotal,
      commentPageNo: pageNo,
      commentPageTotal: commentPageTotal,
      startIndex: startIndex,
      link,
      enabledCaptcha
    });
  } catch (error) {
    console.error('文章详情页异常：' + error);
    // async函数，需要显示的调用next方法
    next(createError(500, 'select exception'));
  }
}

// 文章详情
router.get('/:id/:pageNo?', (req, res, next) => {
  // 分处理，如果是id的文章，则使用id查询数据，否则使用uuid逻辑
  const id = req.params.id - 0;
  if (!Number.isInteger(id)) {
    if (hashids.decode(req.params.id).length === 0) {
      next(createError(404));
      return;
    }
    getDetailsByUuid(req, res, next);
  } else {
    // 只有id小于12585的文章详情页允许使用id查询，否则报错
    if (id > 12585) {
      next(createError(404));
      return;
    }
    getDetailsById(req, res, next);
  }
});

module.exports = router;
