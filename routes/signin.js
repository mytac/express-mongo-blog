const express = require('express');

const router = express.Router();
const { checkNotLogin } = require('../middlewares/check');

// GET /signin 登录页
router.get('/', checkNotLogin, (req, res) => {
  res.render('signin');
});

// POST /signin 用户登录
router.post('/', checkNotLogin, (req, res) => {
  res.send('用户登录');
});

module.exports = router;
