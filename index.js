const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log('1');
  next();
});

app.use((req, res, next) => {
  console.log('2');
  res.status(200).end();
});

app.listen(3000);
