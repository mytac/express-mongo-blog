const path = require('path');
const fs = require('fs');
const express = require('express');
const sha1 = require('sha1');


const router = express.Router();
const UserModel = require('../models/user');
const { checkNotLogin } = require('../middlewares/check');

// GET /signup 注册页
router.get('/', checkNotLogin, (req, res) => {
  res.render('signup');
});

// POST /signup 用户注册
router.post('/', checkNotLogin, (req, res, next) => {
  const {
    name, password, repassword, gender, bio,
  } = req.fields;

  // 只获取
  const avatar = req.files.avatar.path.split(path.sep).pop(); // path.sep 平台特定的路径片段分隔符

  try {
    if (!(name.length > 1 && name.length < 10)) {
      throw new Error('名字限制在1~10之间');
    }
    if (password.length < 6) {
      throw new Error('密码长度不能小于6个');
    }
    if (['m', 'f', 'x'].indexOf(gender)) {
      throw new Error('性别只能是m、f、x中的一个');
    }
    if (repassword !== password) {
      throw new Error('两次输入密码不一致');
    }
    if (!req.files.avatar.name) {
      throw new Error('请上传头像');
    }
    if (!(bio.length >= 1 && bio.length <= 30)) {
      throw new Error('个人简介长度限制在1~30个字符');
    }
  } catch (e) {
    fs.unlink(req.files.avatar.path);
    req.flash(e.message);
    return res.redirect('/signup');
  }

  let user = {
    name, password: sha1(password), gender, bio, avatar,
  };
  UserModel.create(user)
    .then((result) => {
    /* eslint-disable prefer-destructuring */
      user = result.ops[0];
      // 删除密码，写入session
      delete user.password;
      req.session.user = user;
      req.flash('注册成功');
      res.redirect('/posts');
    })
    .catch((e) => {
      fs.unlink(req.files.avatar.path);
      if (e.message.match('duplicate key')) {
        req.flash('用户名已被占用');
        return res.redirect('/signup');
      }
      next(e);
    });
});

module.exports = router;
