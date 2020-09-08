var link = require('../config/link');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('about/about', {
    active: 4,
    link
  });
});

module.exports = router;
