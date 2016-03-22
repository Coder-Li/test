function route(handle, pathname, response, requset){
    console.log("About to route a requset for " + pathname);
    if(typeof handle[pathname] === 'function'){
        return handle[pathname](response, requset);
    }else{
        console.log("No requset handler found for " + pathname);
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not found");
        response.end();
        // return "404 not found";
    }
}

exports.route = route;