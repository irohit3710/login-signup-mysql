 //db.js
    
 const mysql = require('mysql');
   
    
    
 const pool = mysql.createPool({
     connectionLimit: process.env.CONNECTION_LIMIT,    // the number of connections node.js will hold open to our database
     password: process.env.DB_PASS,
     user: process.env.DB_USER,
     database: process.env.MYSQL_DB,
     host: process.env.DB_HOST,
     port: process.env.DB_PORT
     
 });
     
  
    //create the User table
  
   // pool.query('CREATE TABLE User (' +
   //       'id int(11) NOT NULL AUTO_INCREMENT,' +
   //       'user_name varchar(255) NOT NULL,' +
   //       'role varchar(255) default "employee",' +
   //       'email varchar(255) NOT NULL,' +
   //       'password varchar(255) NOT NULL,' +
   //       'PRIMARY KEY (id),'+
   //       'UNIQUE KEY email_UNIQUE (email),' +
   //       'UNIQUE KEY password_UNIQUE (password))', function (err, result) {
   //           if (err) throw err;
   //           console.log("User created");
   //         }
   //      );
     
    
    //create the resetPasswordToken table
     
//     pool.query('CREATE TABLE ResetPasswordToken (' +
//     'id INT NOT NULL AUTO_INCREMENT,' +
//     'email VARCHAR(255) NOT NULL,' +
//     'Token_value VARCHAR(350) NOT NULL,' +
//     'created_at datetime  NOT NULL ,' +
//     'expired_at datetime  NOT NULL,' +
//     'used INT(11) NOT NULL default "0",' +
//     'inserted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
//     'PRIMARY KEY (id),' +
//     'UNIQUE INDEX id_UNIQUE (id ASC))' , function (err, result) {
//         if (err) throw err;
//         console.log("resetPasswordToken created");
//     }
// );



     
 let db = {};
  
 // ***Requests to the User table ***
  
 db.allUser = () =>{
     return new Promise((resolve, reject)=>{
         pool.query('SELECT * FROM User ', (error, users)=>{
             if(error){
                 return reject(error);
             }
             return resolve(users);
         });
     });
 };
  
  
 db.getUserByEmail = (email) =>{
     return new Promise((resolve, reject)=>{
         pool.query('SELECT * FROM User WHERE email = ?', [email], (error, users)=>{
             if(error){
                 return reject(error);
             }
             return resolve(users[0]);
              
         });
     });
 };
  
  
  
 db.insertUser = (userName, email, password) =>{
     return new Promise((resolve, reject)=>{
         pool.query('INSERT INTO User (user_name, email, password) VALUES (?,  ?, ?)', [userName, email, password], (error, result)=>{
             if(error){
                 return reject(error);
             }
              
               return resolve(result.insertId);
         });
     });
 };
  
  
 db.updateUser = (userName, role, email, password, id) =>{
     return new Promise((resolve, reject)=>{
         pool.query('UPDATE User SET user_name = ?, role= ?, email= ?, password=? WHERE id = ?', [userName, role, email, password, id], (error)=>{
             if(error){
                 return reject(error);
             }
              
               return resolve();
         });
     });
 };
  

 db.updateUserPassword = ( password, id) =>{
   return new Promise((resolve, reject)=>{
       pool.query('UPDATE User SET  password=? WHERE id = ?', [ password, id], (error)=>{
           if(error){
               return reject(error);
           }
            
             return resolve();
       });
   });
};
  
  
 db.deleteUser = (id) =>{
     return new Promise((resolve, reject)=>{
         pool.query('DELETE FROM User WHERE id = ?', [id], (error)=>{
             if(error){
                 return reject(error);
             }
             return resolve(console.log("User deleted"));
         });
     });
 };
  
  
  
     


// ***Requests to the  resetPasswordToken table ***

db.expireOldTokens = (email, used) =>{
   return new Promise((resolve, reject)=>{
       pool.query('UPDATE ResetPasswordToken SET used = ?  WHERE email = ?', [ used, email], (error)=>{
           if(error){
               return reject(error);
           }
            
             return resolve();
       });
   });
};


 db.insertResetToken = (email,tokenValue, createdAt, expiredAt, used) =>{
   return new Promise((resolve, reject)=>{
       pool.query('INSERT INTO ResetPasswordToken ( email, Token_value,created_at, expired_at, used) VALUES (?, ?,?, ?, ?)', [email,tokenValue, createdAt, expiredAt, used], (error, result)=>{
           if(error){
               return reject(error);
           }
            
             return resolve(result.insertId);
       });
   });
};

 db.findValidToken = (token, email, currentTime) =>{
   return new Promise((resolve, reject)=>{
       pool.query('SELECT * FROM ResetPasswordToken WHERE (email = ? AND Token_value = ? AND expired_at > ?)', [email,token,  currentTime  ], (error, tokens)=>{
           if(error){
               return reject(error);
           }
           return resolve(tokens[0]);
            
       });
   });
};




    
 module.exports = db