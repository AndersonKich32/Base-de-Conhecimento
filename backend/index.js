const express = require('express');
const app = express();
const consign = require('consign');
const db = require('./config/db')


app.db = db


consign()
    .include('./config/passport.js')
    .then('./config/middleware.js')
    .then('./api/validation.js')
    .then('./api')
    .then('./schedule')
    .then('./config/routes.js')
    .into(app)

app.listen(process.env.Port || 3333)