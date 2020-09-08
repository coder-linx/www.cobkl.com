var link = require('../config/link');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index/index', {
    active: 0,
    link
  });
});

module.exports = router;
