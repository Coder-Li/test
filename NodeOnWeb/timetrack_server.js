var http = require('http');
var work = require('./lib/timetrack');
var mysql = require('mysql');

//定义数据库连接参数
var db = mysql.createConnection({
    host:  '127.0.0.1',
    user:  'root',
    password: 'root',
    database: 'timetrack'
});


//1. 一会尝试下 把 这个switch 独立成一个函数
//定义服务器的行为
var server = http.createServer(function (req, res) {
    switch(req.method){
        case 'POST':
        switch(req.url){
            case '/':
            work.add(db, req, res);
            break;
            case '/archive':
            work.archive(db, req, res);
            break;
            case '/delete':
            work.delete(db, req, res);
            break;
        }
        break;
        case 'GET':
        switch(req.url){
            case '/':
            work.show(db, res);
            break;
            case '/archived':
            work.showArchived(db, res);
            break;  
        }
        break;
    }
});

 //建表 sql语句
 db.query(
     "CREATE TABLE IF NOT EXISTS work ("
     + "id INT(10) NOT NULL AUTO_INCREMENT, "
     + "hours DECIMAL(5,2) DEFAULT 0, "
     + "date DATE, "
     + "archived INT(1) DEFAULT 0, "
     + "description LONGTEXT,"
     + "PRIMARY KEY(id))",
     function (err){
         if(err) throw err;
         console.log('Server started...');
         //启动http 服务器
         server.listen(3000, '127.0.0.1');
     }
 );