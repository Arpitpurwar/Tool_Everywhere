const express = require("express");
const router = express.Router();
const query = require('../database/query/query');
const logger = require('../common/logconfig')(__filename);


router.get('/getTool', (req, res) => {
let username;
try {
  username = req.user.nameID;
 }catch(e){
  username = 'none';
 }
 if(username == 'none'){
  res.send({ "isValidUser" : false });
 }
 else{
    
  query.getTools(username).then(value =>{
    res.send(value);
  }).catch(err=>{
    res.send({statusCode:500,message:`Failed ${err}`}) 
});
 }
});

router.get('/testGettool', (req, res) => {
  let username;
  try {
    username = req.user.nameID;
   }catch(e){
    username = 'apurwa19@in.ibm.com';
   }
   if(username == 'none'){
    res.send({ "isValidUser" : false });
   }
   else{
      
    query.getTools(username).then(value =>{
      res.send(value);
    }).catch(err=>{
      res.send({statusCode:500,message:`Failed ${err}`}) 
  });
   }
  });
 
router.post('/insertCustomApplication', (req, res) => {
    query.insertCustomApplication(req.body.name, req.body.url, req.body.logo, req.body.userId, req.body.color).then(data => {
            res.status(200).send(data);
    }).catch(err => { res.status(500).send({statusCode:500,message:`Failed ${err}`}) })

});

router.post('/insertApplication',(req,res)=>{
    query.insertApplication(req.body.name,req.body.url,req.body.color,req.body.factoryId,req.body.roleId,req.body.logo).then(data =>{
          res.status(200).send(data);
        }).catch(err=>{res.status(500).send({statusCode:500,message:`Failed ${err}`})})
    
  })

  router.put('/updateCustomApplication',(req,res)=>{
    query.updateCustomApplication(req.body.appId,req.body.name,req.body.url,req.body.color,req.body.logo,req.body.userId).then(data =>{
          res.status(200).send(data);
        }).catch(err=>{res.status(500).send({statusCode:500,message:`Failed ${err}`})})
    
  })

  router.delete('/deleteCustomApplication',(req,res)=>{
    query.deleteCustomApplication(req.body.appId,req.body.userId).then(data =>{
          res.status(200).send(data);
        }).catch(err=>{res.status(500).send({statusCode:500,message:`Failed ${err}`})})
    
  })

  router.post('/insertUser',(req,res)=>{
    query.insertUser(req.body).then(data => res.status(200).send(data)).catch((err)=> res.status(400).send(err))
  })
module.exports = router;