const link = require('../config/link');
const newModel = require('../model/new');
const createError = require('http-errors');
const express = require('express');
const router = express.Router();

router.get('/:pageNo?', async (req, res, next) => {
  try {
    let pageNo = (req.params.pageNo || 1) - 0;
    if (!Number.isInteger(pageNo)) {
      throw new Error('param exception');
    }
    let pageSize = 20;
    let results = await newModel.selectList((pageNo - 1) * pageSize, pageSize);
    let count = await newModel.count();
    if (results.length === 0) {
      next(createError(404));
      return;
    }
    res.render('new/new', {
      active: 2,
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
