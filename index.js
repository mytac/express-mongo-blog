const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const config = require('config-lite')(__dirname);
const routes = require('./routes');
const pkg = require('./package');

const app = express();
// 设置模板目录
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎为ejs
app.set('view engine', 'ejs');
// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
// session中间件
app.use(session({
  name: config.session.key, // 设置cookie中保存的session id字段名
  secret: config.session.secret, // 通过设置secret计算hash值并放在cookie中，使产生的signedCookie防篡改
  resave: true, // 强制更新session
  saveUninitialized: false, // 设置为false，即使用户未登陆，强制创建一个session
  cookie: {
    maxAge: config.session.maxAge, // 过期时间
  },
  store: new MongoStore({// 将 session 存储到 mongodb
    url: config.mongodb, // mongodb 地址
  }),
}));

// flash中间件，用来显示通知
app.use(flash());

// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/img'), // 上传文件目录
  keepExtensions: true, // 保留后缀
}));

// 设置模板全局常量
app.locals.blog = {
  title: pkg.name, // 站名
  description: pkg.description, // 站描述
};

// 添加模板必备的三个变量
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  next();
});

// 路由
routes(app);

// 监听端口，启动程序
app.listen(config.port, () => {
  console.log(`${pkg.name} listening on port ${config.port}`);
});

