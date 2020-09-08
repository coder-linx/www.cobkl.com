const link = require('../../config/link');
const companyModel = require('../model/company');
const getIpAddress = require('../../lib/getIpAddress');
const createError = require('http-errors');
const express = require('express');
const router = express.Router();
const baiduPush = require('../../lib/baiduPush');

// 删除
router.post(link.admin.company.delete, async (req, res, next) => {
  let id = req.body.id;
  try {
    let results = await companyModel.deleteCompany(id);
    if (results && results.affectedRows > 0) {
      res.json({
        code: '100',
        rows: results.changedRows,
        desc: '成功'
      });
    } else {
      res.json({
        code: '110',
        desc: '失败'
      });
    }
  } catch (error) {
    console.error('删除接口异常：' + error);
    res.json({
      code: '120',
      desc: '失败'
    });
  }
});

// 恢复
router.post(link.admin.company.recovery, async (req, res, next) => {
  let id = req.body.id;
  try {
    let results = await companyModel.recoveryCompany(id);
    if (results && results.affectedRows > 0) {
      res.json({
        code: '100',
        rows: results.changedRows,
        desc: '成功'
      });
    } else {
      res.json({
        code: '110',
        desc: '失败'
      });
    }
  } catch (error) {
    console.error('恢复接口异常：' + error);
    res.json({
      code: '120',
      desc: '失败'
    });
  }
});

// 标为已读
router.post(link.admin.company.read, async (req, res, next) => {
  let id = req.body.id;
  try {
    let results = await companyModel.readCompany(id);
    // affectedRows受影响记录
    // changedRows修改记录
    if (results && results.affectedRows > 0) {
      res.json({
        code: '100',
        rows: results.changedRows,
        desc: '成功'
      });
    } else {
      res.json({
        code: '110',
        desc: '失败'
      });
    }
  } catch (error) {
    console.error('标记已读接口异常：' + error);
    res.json({
      code: '120',
      desc: '失败'
    });
  }
});

// 保存编辑吐槽
router.post(link.admin.company.edit + '/:id?', async (req, res, next) => {
  try {
    if (!req.xhr) {
      throw new Error('async exception');
    }
    let id = (req.params.id) - 0;
    let name = (req.body.name || '').trim();
    let content = (req.body.content || '').trim();
    let author = (req.body.author || '').trim();
    let address = (req.body.address || '').trim();
    let reason = (req.body.reason || '').trim();
    let job = (req.body.job || '').trim();
    let contact = (req.body.contact || '').trim();
    let ip = (req.body.ip || '').trim();
    let ipAddress = (req.body.ipAddress || '').trim();
    let agree = (req.body.agree || '').trim();
    let oppose = (req.body.oppose || '').trim();
    let isdelete = (req.body.isdelete || '').trim();
    var results = await companyModel.updateCompany(id, {
      name,
      content,
      author,
      address,
      reason,
      job,
      contact,
      ip,
      ipAddress,
      agree,
      oppose,
      isdelete
    });
    if (results && results.affectedRows > 0) {
      // 主动推送百度蜘蛛
      baiduPush(link.host + link.details.index + '/' + id);
      res.json({
        code: '100',
        rows: results.changedRows,
        desc: '成功'
      });
    } else {
      res.json({
        code: '120',
        desc: '服务器错误'
      });
    }
  } catch (error) {
    console.error('管理员保存吐槽异常：' + error);
    res.json({
      code: '110',
      desc: '数据录入失败'
    });
  }
});

// 编辑吐槽
router.get(link.admin.company.edit + '/:id?', async (req, res, next) => {
  try {
    let id = (req.params.id || 1) - 0;
    if (!Number.isInteger(id)) {
      throw new Error('param exception');
    }
    // 标记为已读
    await companyModel.readCompany(id);

    let details = await companyModel.selectDetails(id);
    if (details.length === 0) {
      next(createError(404));
      return;
    }
    res.render('company/edit', {
      details: details[0],
      link,
      active: 1
    });
  } catch (error) {
    console.error('管理员编辑吐槽异常：' + error);
    // async函数，需要显示的调用next方法
    next(createError(500, 'select exception'));
  }
});

// 新增吐槽
router.get(link.admin.company.add, (req, res, next) => {
  res.render('company/add', {
    link,
    active: 4
  });
});
// 保存新增吐槽
router.post(link.admin.company.add, async (req, res, next) => {
  let data = {};
  for (let index = 0; index < req.body.data.length; index++) {
    const item = req.body.data[index];
    const value = (item.value + '').trim();
    if (value) {
      data[item.name] = value;
    }
  }
  let ip = (req.clientIp || '').trim();
  let ipAddress = '中国';
  try {
  // 根据ip查询地址
    ipAddress = await getIpAddress(ip);
  } catch (error) {
    console.error('ip地址查询错误：' + error);
  }
  data.ip = ip;
  data.ipAddress = ipAddress;
  data.content = data.content || '';
  try {
    let results = await companyModel.appendCompany(data);
    if (results.insertId) {
      // 主动推送百度蜘蛛
      baiduPush(link.host + link.details.index + '/' + results.insertId);
      res.json({
        code: '100',
        desc: '成功',
        data: results.insertId
      });
    } else {
      res.json({
        code: '110',
        desc: '数据录入失败'
      });
    }
  } catch (error) {
    console.error('管理员添加吐槽录入失败:' + error);
    res.json({
      code: '110',
      desc: '数据录入失败'
    });
  }
});

// 查看吐槽
router.get(link.admin.company.details + '/:id?', async (req, res, next) => {
  try {
    let id = (req.params.id || 1) - 0;
    if (!Number.isInteger(id)) {
      throw new Error('param exception');
    }
    // 标记为已读
    await companyModel.readCompany(id);

    let details = await companyModel.selectDetails(id);
    if (details.length === 0) {
      next(createError(404));
      return;
    }
    res.render('company/details', {
      details: details[0],
      link,
      active: 1
    });
  } catch (error) {
    console.error('管理员吐槽详情页异常：' + error);
    // async函数，需要显示的调用next方法
    next(createError(500, 'select exception'));
  }
});

// 所有吐槽
router.get('/:pageNo?', async (req, res, next) => {
  try {
    let pageNo = (req.params.pageNo || 1) - 0;
    if (!Number.isInteger(pageNo)) {
      throw new Error('param exception');
    }
    let pageSize = 20;
    let results = await companyModel.selectList((pageNo - 1) * pageSize, pageSize);
    let count = await companyModel.count();
    if (results.length === 0) {
      next(createError(404));
      return;
    }
    res.render('company/company', {
      active: 1,
      list: results,
      total: count[0].total,
      link,
      pageNo,
      pageSize
    });
  } catch (error) {
    console.error(error);
    // async函数，需要显示的调用next方法
    next(createError(500, 'select exception'));
  }
});

module.exports = router;
