var http = require("http");
var url = require("url");

function start(route, handle) {
    function OnRequest(request, response) {
        var postData = "";
        var pathname = url.parse(request.url).pathname;
        console.log("Request for " + pathname + " received.");
        //设置接收数据编码格式为UTF-8
        /*可是 setEncoding并不能解决乱码问题
         网上查找问题 有篇帖子说  request.setEncoding 是针对字节流对字符解码，
          utf-8的url解码是遵循  “x-www-form-urlencoded” 格式，两者没有关系
         需要用    decodeURIComponent()  函数
         帖子位置：   https://cnodejs.org/topic/5189f76163e9f8a542070d64
        */
        // request.setEncoding('utf8');
        
        
        // console.log(request.getEncoding + "======================");
        // //注入“data”事件的监听器
        // request.addListener("data", function(postDataChunk) {
        //     postDataChunk = decodeURIComponent(postDataChunk);
        //     postData += postDataChunk;
        //     console.log("Received POST data chunk '" + postDataChunk + "'.");
        // });
        //end事件监听器，调用路由
        // request.addListener("end", function() {
        //     route(handle, pathname, response, postData);
        // });
        // var content = route(handle, pathname);
        // route(handle, pathname, response);


        // response.writeHead(200, { "Content-Type": "text/plain" });
        // response.write(content);
        // response.end();
        
        
        route(handle, pathname, response, request);
    }

    http.createServer(OnRequest).listen(8888);
    console.log('Server has started!');
}

exports.start = start;