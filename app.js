'use strict'

const logger = require('./src/libs/logger')
const express = require('express')
const path = require('path')
const morgan = require('morgan')
const config = require('./src/common/get-config')

var favicon = require('serve-favicon');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

//Flash messages are stored in the session. First, setup sessions as usual by enabling cookieParser and session middleware. Then, use flash middleware provided by connect-flash.With the flash middleware in place, all requests will have a req.flash() function that can be used for flash messages.
const flash    = require('connect-flash');

const User = require('./src/models/User');  

const	app = express()

app.set('views', path.join(__dirname, 'src/views'))
const passport = require('passport')
require('./src/libs/passport')(passport); // pass passport for configuration

require('./src/libs/mongoose-connect')
// static中间件可以将一个或多个目录指派为包含静态资源的目录,其中资源不经过任何特殊处理直接发送到客户端,如可放img,css。 设置成功后可以直接指向、img/logo.png,static中间件会返回这个文件并正确设定内容类型
// do use path.join(), since it'll generate effective slashes according to different systems(unix/window..)

app.use(express.static(path.join(__dirname, 'src/public')))
app.set('views', path.join(__dirname, 'src/views'))

const env = process.env.NODE_ENV || 'test'

require('./src/libs/helmet')(app)

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'src/public/img', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


require('./src/libs/hbs')(app);

// redis session starts:

// we can restore any data using req.session and you can get it automatically in every subsequent request from the same client; Express uses memories to store session data so that the session date will be lost if you close your app or the app clashes; so we can use Redis or Mongodb to store the session data;

const session = require('express-session');

// Create express-session and pass it to connect-redis object as parameter. This will initialize it.
const redisStore = require('connect-redis')(session);
// Then in session middle ware, pass the Redis store information such as host, port and other required parameters.
// const client = require('./lib/redis');

app.use(session({
  secret: config.session_secret,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  // create new redis store.
  store: new redisStore({port:config.db.redis.port, host:config.db.redis.host,pass:config.db.redis.pw, ttl:  config.db.redis.ttl}),//Redis session TTL (expiration) in seconds
  saveUninitialized: false,
  resave: false
}));




  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  app.use(flash()); // use connect-flash for flash messages stored in session
 

  // app.use(function(req,res,next){
  //  //pass it to the context if there is flash message and then delete it
  //  res.locals.flash = req.session.flash;
  //  delete req.session.flash;
  //  next();
  // }); 

  //ensure you tell express that you've used a proxy and it should be trusted if yuo set a proxy server like ngnix so req.ip, req.protocol,req.secure can reflect the connectiong details of the client and the proxy server rather than between your client and your app. Besides, req.ips will be an array, wihch is composed of IP of original client and IP or names of all the middle proxy
  app.enable('trust proxy');

  //prevent CSRF attack by ensuring requests legally from your site
  // app.use(require('csurf')());
  // app.use(function(req,res,next){
  //  res.locals.csrfToken = req.csrfToken();
  //  next();
  // });




// HTTP request logger middleware for node.js
app.use(morgan('dev'))

// examples for learning purposes
// require('./examples/file');

// routes
require('./src/routes/routes')(app, passport, User);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('404 Page Not Found')
  logger.error(`Error: ${err.message}`)
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  let error = env === 'test' ? err.stack : 'error'
  logger.error(`Error: ${err.message ? err.message : err.stack}`)
  res.status(err.status || 500)
  res.json(error)
})

app.listen(config.port, function () {
  console.log('Listening at %s', config.port)
})

module.exports = app
