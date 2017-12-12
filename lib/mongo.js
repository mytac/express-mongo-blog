const config = require('config-lite')(__dirname);
const Mongolass = require('mongolass');

const mongolass = new Mongolass();

mongolass.connect(config.mongodb);

// schema是对一个数据库的结构描述。在一个关系型数据库里面，schema定义了表、每个表的字段，还有表和字段之间的关系。
// 用户
exports.User = mongolass.model('User', {
  name: { type: 'string' },
  password: { type: 'string' },
  avatar: { type: 'string' },
  gender: { type: 'string', enum: ['m', 'f', 'x'] },
  type: { type: 'string' },
});

exports.User.index({ name: 1 }, { unique: true }).exec(); // 根据用户名查找用户，用户名全局唯一
