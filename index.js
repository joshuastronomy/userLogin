const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');



const app = express();

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(expressValidator());
app.use('/public', express.static('public'));
//session init
app.use(session({
  secret: 'get dunked kid',
  resave: false,
  saveUninitialized: true
}))
//seed users
app.use(function (req, res, next) {

req.session.users = {
  name1: "pass1pass",
  name2: "pass2pass",
  name3: "pass3pass"
};
//var declare
  next();
})

//hitting root for the first time, render if logged in, redirect to /login if not.
app.get('/', function(req, res, next) {

  req.session.username ? res.send("Hello, " + req.session.username + ". Your password is " + req.session.password + ".") : res.redirect('/login')
})

app.get('/login', function ( req, res, next)  {
  res.render('login');
})

app.post('/login', function(req, res, next)  {
  console.log(req.body);
  console.log(req.session.users[req.body.username]);
  req.checkBody("username", "Please input a valid name")
    .notEmpty()
    .isLength({
      min: 0,
      max: 100
    });

  req.checkBody("password", "Please enter a valid password")
    .notEmpty()
    .isLength({
      min: 8,
      max: 20
    });

  const errors = req.validationErrors();

  if (errors) {
    res.send(errors);
  } else {


if (req.session.users[req.body.username] === req.body.password) {
  req.session.username = req.body.username;
  req.session.password = req.body.password;
}
res.redirect('/');
}

  //
  //   let nameVar = req.body.username;
  //   session.users[nameVar] = req.body.password;
  //   console.log(session.users);
  //
  //   res.send("<p>Your username and password are: " + req.body.username + ",  " + req.body.password + ".</p>" + session.name);
  // }
})

app.listen(3000, function() {
  console.log('Server online...');
})
