var express = require('express');
var router = express.Router();
const logger = require('../common/logconfig')(__filename);
const path = require('path');

var relayHandler = function relayHandler(req, res) {
    var relayState = req.query && req.query.RelayState || req.body && req.body.RelayState; 
    var hashQuery = relayState && relayState.match(/^\#/) && ("/app"+relayState) || relayState  || "/"; 
    res.redirect(hashQuery);
};

module.exports = function(app, config, passport) {
    router.get("/accessDenied",   function(req, res) {  logger.error(" Access Denied"); 
    res.status(404).send({"msg":"Access Denied by IBM w3id"}); }   );
    
 // Main page requires an authenticated user    
    router.get("/", 
            function(req, res) {
                if (req.user) {
                  res.sendFile(path.join(__dirname,'..','dist','index.html'));
                } else {
            
                    res.redirect('/login');
                }
            }
    );
    
 // Start SAML login process
    router.get("/login",
       passport.authenticate(config.passport.strategy, {/*successRedirect : "/", */failureRedirect : "/accessDenied"}),
       relayHandler);

 // Process callback from IDP for login
    router.post('/login/callback/postResponse',
 // !!! Important !!! Response XML structure needs to be tweaked to pass signature validation
       passport.patchResponse(),
       passport.authenticate(config.passport.strategy, {successRedirect : "/", failureRedirect : "/accessDenied"}),
       relayHandler);    
    
    return router;
};
