var http = require('http');

var server = http.createServer(function(req, res){
    res.writeHead(200, {'Conten-Type': 'text/plain'});
    res.end('Hello World\n');
    console.log('服务器创建完成');
});

server.listen(3000, '127.0.0.1', function(){
    console.log('the server open on 3000');
});