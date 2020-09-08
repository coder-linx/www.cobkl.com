const link = require('../config/link');
const cityList = require('../config/cityList');
const searchModel = require('../model/search');
const createError = require('http-errors');
const express = require('express');
const router = express.Router();

router.get('/:pageNo?', async (req, res, next) => {
  try {
    let wd = req.query.wd;
    if (!wd) {
      res.redirect(link.host + link.index);
      return;
    }
    // 判断是否是搜索城市
    let isSearchCity = false;
    for (let i = 0; i < cityList.length; i++) {
      const city = cityList[i];
      if (city.indexOf(wd) > -1) {
        wd = city;
        isSearchCity = true;
        break;
      }
    }
    let pageNo = (req.params.pageNo || 1) - 0;
    if (!Number.isInteger(pageNo)) {
      throw new Error('param exception');
    }
    let pageSize = 20;
    let results = await searchModel.selectList({
      isSearchCity,
      wd,
      index: (pageNo - 1) * pageSize,
      size: pageSize
    });
    let count = await searchModel.count({
      isSearchCity,
      wd
    });
    res.render('search/search', {
      active: 0,
      list: results,
      total: count[0].total,
      link,
      pageNo,
      pageSize,
      wd
    });
  } catch (error) {
    console.error(error);
    // async函数，需要显示的调用next方法
    next(createError(500, 'select exception'));
  }
});

module.exports = router;
