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
      item.create_time = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
    });
  },
  afterFindOne: (res) => {
    res.create_time = moment(objectIdToTimestamp(res._id)).format('YYYY-MM-DD HH:mm');
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
