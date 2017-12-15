const express = require('express');

const router = express.Router();
const { checkLogin } = require('../middlewares/check');
const CommentModel = require('../models/comment');

// POST /comments 创建一条留言
router.post('/', checkLogin, (req, res, next) => {
  const { content, postId } = req.fields;
  const author = req.session.user._id;
  try {
    if (!content.length) {
      throw new Error('请输入留言内容');
    }
  } catch (e) {
    req.flash('error', e.message);
  }

  const comment = {
    content, postId, author,
  };
  CommentModel.create(comment)
    .then(() => {
      req.flash('success', '留言成功');
      res.redirect('back');
    })
    .catch(next);
});

// GET /comments/:commentId/remove 删除一条留言
router.get('/:commentId/remove', checkLogin, (req, res, next) => {
  const { commentId } = req.params;
  const author = req.session.user._id;
  CommentModel.getCommentById(commentId)
    .then((comment) => {
      if (!comment) {
        throw new Error('留言不存在');
      }

      if (comment.author.toString() !== author.toString()) {
        throw new Error('没有权限');
      }
      CommentModel.delCommentById(commentId)
        .then(() => {
          req.flash('success', '删除成功');
          res.redirect('back');
        });
    })
    .catch(next);
});

module.exports = router;
