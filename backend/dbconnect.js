const mysql = require("mysql2");

const conn = mysql.createConnection({
    host:"localhost",
    user:"root",
    database:"register",
    password:""
});

if(conn){
    console.log("connection success");
}else{
    console.log("error")
}

module.exports = conn;