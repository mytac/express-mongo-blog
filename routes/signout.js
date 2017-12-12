const express = require('express');

const router = express.Router();
const { checkLogin } = require('../middlewares/check');

// GET /signout 登出页
router.get('/', checkLogin, (req, res) => {
  // 清空session中用户信息
  req.session.user = null;
  req.flash('success', '登出成功');
  // 登出成功后跳转主页
  res.redirect('/posts');
});

// POST /signout 用户登录
router.post('/', checkLogin, (req, res) => {
  res.send('登出页');
});

module.exports = router;
