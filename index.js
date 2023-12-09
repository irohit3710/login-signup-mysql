require("dotenv").config();
const express =require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
 
const apiRouter = require('./apiRouter');
    
const app = express();
    
    
    
const PORT= process.env.PORT;
    
app.use(bodyParser.json());
app.use(cors());
 
    
app.use('/apiRouter',apiRouter)
    
app.listen(PORT, ()=>{
    console.log(`server is listening  on ${PORT}`);
});
    
module.exports = app;