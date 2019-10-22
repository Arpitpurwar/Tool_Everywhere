const db2 = require('../connection/dbconnect');
//const logger = require('../../common/logconfig')(__filename);


const insertCustomApplication = function (name,url,logo,userId,color){
    return new Promise ((resolve, reject) =>{
       
        let sql = "insert into CUSTOM_APPLICATIONS(NAME,URL,COLOR,USERID,LOGO) VALUES (?,?,?,?,?)"

        db2.mydb.query(sql,[name,url,color,userId,logo],(err,rows)=>{
            if(err) {
                reject(err);        
            }
            else
            {
                db2.mydb.query(`select max(id)as "id"  from custom_applications`,(err,rows)=>{
                    if(err) 
                    {
                        reject(err);        
                    }else{
                        insertCustomAPPSequence(rows[0]["id"],userId).then( () =>  resolve({statusCode:200,msg:"successfully Inserted data"}))
                    }            
                    
                  })
        
        }
       });
    });
};

const getTools = function(email){
    return new Promise ((resolve, reject) =>{
       let sql = `select fu.id as userid,'custom' as apptype,fu.firstname,fu.lastname,fu.factoryid,fu.roleid,fu.accesslevel,ca.id as appid,ca.name,ca.url,ca.color,ca.logo from factory_user fu 
       left join custom_applications ca on fu.id = ca.userid where email = '${email}' 
       union
       select fu.id as userid,'db' as apptype,fu.firstname,fu.lastname,fu.factoryid,fu.roleid,fu.accesslevel,app.id as appid,app.name,app.url,app.color,app.logo from factory_user fu 
       inner join applications app on fu.roleid = app.roleid where email = '${email}'
       order by appid`;

        db2.mydb.query(sql,(err,rows)=>{
            if(err) {
                reject(err);        
            }
            else
            {
                if(rows && rows.length){
                    let finalObj = {};
                    let tempObj = [];
                    rows.forEach((value,index)=>{
                       
                        finalObj['statusCode'] = 200;
                        finalObj['isValidUser'] = true;
                        finalObj['message'] = 'successfully get all tools';
                        finalObj['userid'] = value.USERID;
                        finalObj['factoryId'] = value.FACTORYID;
                        finalObj['roleId'] = value.ROLEID;
                        finalObj['accessLevel'] = value.ACCESSLEVEL;
    
                        if(value.APPID != null){
                            let internalObj = {};
                            internalObj['id'] = value.APPID;
                            internalObj['name'] = value.NAME;
                            internalObj['url'] = value.URL;
                            internalObj['logo'] = value.LOGO;
                            internalObj['color'] = value.COLOR;
                            internalObj['type'] = value.APPTYPE;
                            tempObj.push(internalObj);
                        }
                    })
                    finalObj['tool'] = tempObj;
              resolve(finalObj);
                }
                else{
                    reject("This email does not exist in database");  
                }
 
        }
       });
    });

}


const insertApplication = function (name,url,color,factoryId,roleId,logo){
    return new Promise ((resolve, reject) =>{
      
        let sql = "insert into APPLICATIONS(NAME,URL,COLOR,FACTORYID,ROLEID,LOGO) VALUES (?,?,?,?,?,?)"

        db2.mydb.query(sql,[name,url,color,factoryId,roleId,logo],(err,rows)=>{
            if(err) 
            {
                reject(err);        
            }
            else
            {
              resolve({statusCode:200,message:"successfully inserted data"});
            }
        });
    });
};

const deleteCustomApplication = function (appId,userId){
    return new Promise ((resolve, reject) =>{
      
        let sql = `delete from custom_applications where id =${appId}  and userid = ${userId}`;

        db2.mydb.query(sql,(err,rows)=>{
            if(err) 
            {
                reject(err);        
            }
            else
            {
              resolve({statusCode:200,message:"successfully deleted data"});
            }
        });
    });
};

const updateCustomApplication = function (id,name,url,color,logo,userid){
    return new Promise ((resolve, reject) =>{
      
        let sql = "update CUSTOM_APPLICATIONS set name = ?,url = ?,color = ?,logo = ? where userid = ? and id = ?"

        db2.mydb.query(sql,[name,url,color,logo,userid,id],(err,rows)=>{
            if(err) 
            {
                reject(err);        
            }
            else
            {
              resolve({statusCode:200,message:"successfully updated data"});
            }
        });
    });
};

const insertUser = function(data){
    return new Promise((resolve,reject)=>{
        let firstName = data.firstName;
        let lastName = data.lastName;
        let email = data.email;
        let factoryId = data.factoryId;
        let roleId = data.roleId;
        let accessLevel = data.accessLevel;

    let sql = `insert into factory_user (firstname,lastname,email,factoryid,roleid,accesslevel) values (?,?,?,?,?,?)`;
    db2.mydb.query(sql,[firstName,lastName,email,factoryId,roleId,accessLevel],(err,rows)=>{
        if(err) 
        {
            reject(err);        
        }
        else
        {
          db2.mydb.query(`select id from factory_user where email = '${email}'`,(err,rows)=>{
            if(err) 
            {
                reject(err);        
            }else{
                insertDefaultAPPSequence(rows[0]["ID"],roleId).then( () =>  resolve({statusCode:200,msg:"successfully Inserted data"}))
            }            
            
          })
        }
    });


    });
}

const insertDefaultAPPSequence = async (userId,roleId) => {
    let sql =  `insert into user_sequence (user_id,app_id,sequence) select ${userId},id,1 as sequence from applications where roleid = ${roleId}`;
   db2.mydb.query(sql,() => true)
}

const insertCustomAPPSequence = async (appId,userId) => {
    let sql =  `insert into user_sequence (user_id,app_id,sequence) select ${userId},${appId},max(sequence)+1 from user_sequence where user_id = ${userId}`;
   db2.mydb.query(sql,() => true)
}

module.exports = {
    insertCustomApplication: insertCustomApplication,
    insertApplication: insertApplication,
    getTools: getTools,
    deleteCustomApplication: deleteCustomApplication,
    updateCustomApplication: updateCustomApplication,
    insertUser: insertUser
}
