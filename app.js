var config = require('./config');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

const { openDb, setupDb } = require('./scripts/db/init');

var app = express();
var db = openDb();

(async () => {
  await setupDb(db);
})();

const { createIndexRouter } = require('./routes/index');
const { createProductsRouter } = require('./routes/products');
const { createOrdersRouter } = require('./routes/orders');
const { createSearchRouter } = require('./routes/search');
const { createUsersRouter } = require('./routes/users');

const indexRouter = createIndexRouter(db);
const usersRouter = createUsersRouter(db);
const ordersRouter = createOrdersRouter(db);
const productsRouter = createProductsRouter(db);
const searchRouter = createSearchRouter(db);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

if (config.debug) {
  app.use(logger('dev'));
}

app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/search', searchRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Optional: close DB when app is shutting down
process.on('SIGINT', () => {
  console.log('Closing database...');
  db.close((err) => {
      if (err) {
          console.error('Error closing database:', err.message);
      } else {
          console.log('Database connection closed.');
      }
      process.exit(0);
  });
});


module.exports = app;
