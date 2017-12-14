const express = require('express');

const router = express.Router();

const { checkLogin } = require('../middlewares/check');
const PostModel = require('../models/posts');

// GET /posts 所有用户或特定用户的文章页
// eg: GET /posts?author=xxx
router.get('/', (req, res, next) => {
  res.render('posts');
});

// POST /posts/create 发表一篇文章
router.post('/create', checkLogin, (req, res, next) => {
  const author = req.session.user._id;
  const { title, content } = req.fields;
  try {
    if (!title.length) {
      throw new Error('请输入文章标题');
    }

    if (!content.length) {
      throw new Error('请输入文章内容');
    }
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('back');
  }

  const post = {
    title, author, content, pv: 0,
  };
  PostModel.create(post)
    .then((result) => {
      const postId = result.ops[0]._id;
      req.flash('success', '发布成功');
      res.redirect(`/posts/:${postId}`);
    })
    .catch(next);
});

// GET /posts/create 发表文章页
router.get('/create', checkLogin, (req, res, next) => {
  res.render('create');
});

// GET /posts/:postId 单独一篇文章
router.get('/:postId', (req, res, next) => {
  res.send('文章详情页');
});

// GET /posts/:postId/edit 文章编辑页
router.get('/:postId/edit', (req, res, next) => {
  res.send('文章编辑页');
});

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', (req, res, next) => {
  res.send('更新文章');
});

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, (req, res, next) => {
  res.send('删除文章');
});

module.exports = router;
