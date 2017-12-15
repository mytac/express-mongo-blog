const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');
const config = require('config-lite')(__dirname);
const Mongolass = require('mongolass');

const mongolass = new Mongolass();

mongolass.connect(config.mongodb);
// 根据id生成创建时间
mongolass.plugin('addCreatedAt', {
  afterFind: (res) => {
    res.forEach((item) => {
      item.create_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
    });
    return res;
  },
  afterFindOne: (res) => {
    res.create_at = moment(objectIdToTimestamp(res._id)).format('YYYY-MM-DD HH:mm');
    return res;
  },
});
// schema是对一个数据库的结构描述。在一个关系型数据库里面，schema定义了表、每个表的字段，还有表和字段之间的关系。

// 用户
exports.User = mongolass.model('User', {
  name: { type: 'string' },
  password: { type: 'string' },
  avatar: { type: 'string' },
  gender: { type: 'string', enum: ['m', 'f', 'x'] }, // 男 女 秘密
  type: { type: 'string' },
});
exports.User.index({ name: 1 }, { unique: true }).exec(); // 根据用户名查找用户，用户名全局唯一


// 文章
exports.Post = mongolass.model('Post', {
  author: { type: 'string' },
  title: { type: 'string' },
  content: { type: 'string' },
  pv: { type: 'number' }, // 点击量
});
exports.Post.index({ author: 1, _id: -1 }).exec(); // 按照创建时间降序查看用户的文章列表

// 留言
exports.Comment = mongolass.model('Comment', {
  author: { type: Mongolass.Types.ObjectId },
  content: { type: 'string' },
  postId: { type: Mongolass.Types.ObjectId },
});
