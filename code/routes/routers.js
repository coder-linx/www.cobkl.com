/**
 * 项目路由
 * @Author: xionglin
 * @Date: 2018-06-26 16:17:28
 * @Last Modified by: xionglin
 * @Last Modified time: 2019-07-05 09:46:56
 */
var link = require('../config/link');

var indexRouter = require('./index');
var baoliaoRouter = require('./baoliao');
var newRouter = require('./new');
var detailsRouter = require('./details');
var adviceRouter = require('./advice');
var aboutRouter = require('./about');
var searchRouter = require('./search');
var uploadRouter = require('./upload');

module.exports = function (app) {
  app.use(link.index, indexRouter);
  app.use(link.baoliao.index, baoliaoRouter);
  app.use(link.new.index, newRouter);
  app.use(link.details.index, detailsRouter);
  app.use(link.advice.index, adviceRouter);
  app.use(link.about.index, aboutRouter);
  app.use(link.search.index, searchRouter);
  app.use(link.upload.index, uploadRouter);
};
