var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'localhost',
    user:'ahn',
    password:'dkswlxkr',
    database:'ahn'
});

connection.connect();

connection.query('select * from member', function(err,result,fields){
    if(err){
        console.log(err);
    }
    console.log(result);
});

connection.end();