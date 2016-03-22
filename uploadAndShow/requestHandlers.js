var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");
var util = require("util");

function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
}

function start(response) {
    console.log("Request handler 'start' was called.");
    var body = '<html>' +
        '<head>' +
        '<meta http-equiv="Content-Type" content="text/html; ' +
        'charset=UTF-8" />' +
        '</head>' +
        '<body>' +
        '<form action="/upload" enctype="multipart/form-data" method="post">' +
        // '<textarea name="text" rows="20" cols="60"></textarea>'+
        '<input type="file" name="upload">' +
        '<input type="submit" value="Upload file" />' +
        '</form>' +
        '</body>' +
        '</html>';


    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(body);
    response.end();

}

function upload(response, request) {
    console.log("'upload' was called");

    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(request, function(error, fields, files) {
        console.log("parsing done");
        //这个地方会出错 因为是跨分区的重命名操作需要权限！
        // 这个博客讲了这个问题
        // http://www.crifan.com/node_js_use_fs_renamesync_error_exdev_cross_device_link_not_permitted/
        // fs.renameSync(files.upload.path, "./tmp/test.png");
        //以下是解决方案
        var readStream = fs.createReadStream(files.upload.path);
        var writeStream = fs.createWriteStream("./tmp/test.png");
        
        util.pump(readStream, writeStream, function(){
            fs.unlinkSync(files.upload.path);
        });
        
        
        
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write("received image:<br />");
        response.write("<img src='/show' />");
        response.end();
    })

    // response.writeHead(200, { "Content-Type": "text/plain" });
    // response.write("You've sent the text: " + querystring.parse(postData).text);
    // response.end();
    // return "Hello upload";
}

function show(response) {
    console.log("Request handler 'show' was called");
    fs.readFile("./tmp/test.png", "binary", function(error, file) {
        if (error) {
            response.writeHead(500, { "Content-Type": "text/plain" });
            response.write(error + "\n");
            response.end();
        } else {
            response.writeHead(200, { "Content-Type": "image/png" });
            response.write(file, "binary");
            response.end();
        }
    });
}

exports.start = start;
exports.upload = upload;
exports.show = show;