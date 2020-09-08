const express = require('express');
const router = express.Router();

let link = require('../../config/link');
let indexModel = require('../model/index');
const createError = require('http-errors');

router.get('/', async (req, res, next) => {
  try {
    let newCompany = await indexModel.selectNewCompany();
    let newComment = await indexModel.selectNewComment();
    res.render('index/index', {
      active: 0,
      newCompany,
      newComment,
      link
    });
  } catch (error) {
    console.error(error);
    next(createError(500, 'select exception'));
  }
});

module.exports = router;
