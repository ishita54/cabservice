const mysql=require('mysql');
const util = require('util');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root', 
    password : '', 
    database : 'cab_service'  
});


const runQuery =util.promisify(connection.query).bind(connection);

module.exports={runQuery}
