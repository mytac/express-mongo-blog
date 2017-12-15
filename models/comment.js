const marked = require('marked');
const { Comment } = require('../lib/mongo');

Comment.plugin('contentToHtml', {
  afterFind: comments => comments.map((comment) => {
    comment.content = marked(comment.content);
    return comment;
  }),
});

module.exports = {
  // 创建一个留言
  create(comment) {
    return Comment.create(comment).exec();
  },
  // 通过留言id获取一个留言
  getCommentById(commentId) {
    return Comment.findOne({ _id: commentId }).exec();
  },
  // 通过留言id删除一条留言
  delCommentById(commentId) {
    return Comment.remove({ _id: commentId }).exec();
  },
  // 通过文章id删除该文章下的所有留言
  delCommentBypostId(postId) {
    return Comment.remove({ postId }).exec();
  },
  // 通过文章id获取所有留言
  getComments(postId) {
    return Comment
      .find({ postId })
      .populate({ path: 'author', model: 'User' })
      .sort({ _id: 1 })
      .addCreatedAt()
      .contentToHtml()
      .exec();
  },
  // 获取文章下的留言数
  getCommentsCount(postId) {
    return Comment.count({ postId }).exec();
  },
};
