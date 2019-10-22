const express = require("express");
const bodyParser = require('body-parser');
const compression = require('compression');
const secure = require('express-secure-only');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
var app = express();


corsoptions = {
  "origin": ["http://localhost:4200"], /* put all origin which is using your server */
  "credentials": true,
  "preflightContinue": false,
  "optionsSuccessStatus": 204,
  "maxAge": 1234,
  "allowedHeaders": ['application/json', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
  "allowMethods": ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']
}

app.use(cors(corsoptions));
app.options('*', cors(corsoptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.enable('trust proxy');
var env=require('dotenv');
env.config();

//Saml Configuration
const passport = require("passport");
const samlConfig = require('./common/saml')[process.env.SSO_PROFILE || 'dev'];

/*
 * =====================================================================
 *  Passport framework setup
 */


// Configure passport SAML strategy parameters
require('./lib/passport')(passport, samlConfig);

// security features enabled in production
if (app.get('env') === "production") {
    // redirects http to https
    app.use(secure());

    // helmet with defaults
    app.use(helmet());
}






// enable session
app.use(session({
    secret:  "Secret" + Math.floor(Math.random() * 1000000),
    resave: false,
    proxy: true,
    saveUninitialized: true,
    cookie: {maxAge:1000*60*2500}
}));

app.use(passport.initialize());
app.use(passport.session());


app.use('/', require('./routes/secure')(app, samlConfig, passport));
app.use(require('./routes/api'));
//UI Part
app.use(express.static(path.join(__dirname, 'dist')));





app.get('/logout',(req,res)=>{
  sessionStore.clear(()=>{
    console.log("Store entry deleted");
    req.session.destroy(()=>{
      console.log("session destroy Successfully");
      res.send("Session has been cleared");
    })
  })
})
module.exports = app;



