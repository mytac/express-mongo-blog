const express = require('express');

const router = express.Router();
const { checkLogin } = require('../middlewares/check');

// GET /signout 登出页
router.get('/', checkLogin, (req, res, next) => {
  res.send('登出页');
});

// POST /signout 用户登录
router.post('/', checkLogin, (req, res) => {
  res.send('登出页');
});

module.exports = router;
