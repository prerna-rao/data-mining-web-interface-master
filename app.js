const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');

mongoose.connect('mongodb://root:rootpassword@ds223019.mlab.com:23019/training');
let db = mongoose.connection;

// Check db connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

// Initialize app
const app = express();

// Import Route Files
const form = require('./routes/form');

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());

// Express Session Middleware
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'keyboard cat'
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Routes
app.use('/' , form);

// Start Server
app.listen(4000, () => {
  console.log('Server started on port: 4000');
});