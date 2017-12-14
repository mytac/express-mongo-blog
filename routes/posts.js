const express = require('express');

const router = express.Router();

const { checkLogin } = require('../middlewares/check');
const PostModel = require('../models/posts');

// GET /posts 所有用户或特定用户的文章页
// eg: GET /posts?author=xxx
router.get('/', (req, res, next) => {
  const { author } = req.query;
  PostModel.getPosts(author)
    .then((posts) => {
      res.render('posts', { posts });
    })
    .catch(next);
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
      res.redirect(`/posts/${postId}`);
    })
    .catch(next);
});

// GET /posts/create 发表文章页
router.get('/create', checkLogin, (req, res, next) => {
  res.render('create');
});

// GET /posts/:postId 单独一篇文章
router.get('/:postId', (req, res, next) => {
  const { postId } = req.params;
  Promise
    .all([
      PostModel.getPostById(postId),
      PostModel.incPv(postId),
    ])
    .then((result) => {
      const post = result[0];
      if (!post) {
        throw new Error('该文章不存在');
      }
      res.render('post', { post });
    })
    .catch(next);
});

// GET /posts/:postId/edit 文章编辑页
router.get('/:postId/edit', (req, res, next) => {
  const { postId } = req.params;

  const authorId = req.session.user._id;
  PostModel.getRawPostById(postId)
    .then((post) => {
      if (!post) throw new Error('该文章不存在');
      if (post.author._id.toString() !== authorId.toString()) {
        throw new Error('权限不足');
      }
      res.render('edit', { post });
    })
    .catch(next);
});

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', (req, res, next) => {
  const { title, content } = req.fields;
  const { postId } = req.params;
  const author = req.session.user._id;

  try {
    if (!title.length) {
      throw new Error('请填写文章标题');
    }
    if (!content.length) {
      throw new Error('请填写文章内容');
    }
  } catch (err) {
    req.flash('error'.err.message);
    res.redirect('back');
  }

  PostModel.getRawPostById(postId)
    .then((post) => {
      if (!post) throw new Error('该文章不存在');
      if (post.author._id.toString() !== author.toString()) {
        throw new Error('权限不足');
      }
      PostModel.updatePostById(postId, { title, content })
        .then(() => {
          req.flash('success', '文章更新成功');
          res.redirect(`/posts/${postId}`);
        })
        .catch(next);
    });
});

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, (req, res, next) => {
  const { postId } = req.params;
  const author = req.session.user._id;
  PostModel.getRawPostById(postId)
    .then((post) => {
      if (!post) throw new Error('该文章不存在');
      if (post.author._id.toString() !== author.toString()) {
        throw new Error('权限不足');
      }
      PostModel.delPostById(postId)
        .then(() => {
          req.flash('success', '删除成功');
          res.redirect('/posts');
        })
        .catch(next);
    });
});

module.exports = router;
