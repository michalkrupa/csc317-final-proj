//Import environment config
var config = require('./config');

//Register middlewares
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

//Create express app
var app = express();

//Database
//Import database
var { openDb, setupDb } = require('./scripts/db/init');
//Initialize database connection
var db = openDb();

// import routers
var createRouters = require('./routes/router');

// Create database tables
(async () => {
  await setupDb(db);
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// register logging interface
if (config.debug) {
  app.use(logger('dev'));
}

//register auth middleware
app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: config.session.secure }
}))

// register json response middleware
app.use(express.json());

// register url encoding middleware
app.use(express.urlencoded({ extended: true }));

// register cookie middleware
app.use(cookieParser());


//register all routers
createRouters(app, db);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//mount static dir
app.use(express.static(path.join(__dirname, 'public')));

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
