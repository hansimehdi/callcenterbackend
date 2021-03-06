// load .env file
require("dotenv").config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var plugRouter = require('./routes/plugs');
var securityRouter = require('./routes/security');
const bodyParser = require('body-parser');
const responseRender = require('./middlewares/responseRender');
const cors = require('cors');
const serverErrors = require('./constant/errors');


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// cors options
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use('/', indexRouter);
app.use('/', userRouter);
app.use('/', adminRouter);
app.use('/', plugRouter);
app.use('/', securityRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(400).json(responseRender({}, serverErrors.ROUTE_NOT_FOUND, ""));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(500).json(responseRender({}, serverErrors.SERVER_ERROR, ""))
});

module.exports = app;
