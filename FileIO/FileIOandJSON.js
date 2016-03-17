//这个JS是关于文件流操作以及JSON的 parse和stringfy函数的应用
//↓这是我 本目录下tasks文件的内容
//{"name":"huangxiaojian","age":"23"}
//http://www.tuicool.com/articles/bQre2a  这个文章对node各个路径进行了解惑其中包括下面使用的 process.cwd()

var path = require('path');
var fs = require('fs');
var file = path.join(process.cwd(), './tasks');     //运行node的工作目录，可以使用  cd /d 修改工作目录。

//通过内存变量验证文件读写正确性
// var testString = '{"name":"huangxiaojian","age":"23"}';
// console.log(JSON.parse(testString));
// console.log(JSON.stringify(JSON.parse(testString)));

//文件读
// fs.exists(file, function(exists){
//     if(exists){
//         console.log('存在啊,我把它读出来。');
//         fs.readFile(file, 'utf8', function(err, data){
//                 if(err) throw err;
//                 var data = data.toString();
//                 var tasks = JSON.parse(data);
//                 console.log(tasks);
//             });
//     }
//     else{
//         console.log('不存在!');
//     }
// });
//文件写
fs.exists(file, function(exists){
    if(exists){
        console.log('存在啊，我写点东西进去。');
        var data = JSON.stringify("{ name: 'huangxiaojian', age: '23' }");
        console.log(data);
        fs.write(file, data, 'utf8', function(err){
            if(err) throw err;
            console.log('Saved!');
        })
    }
    else{
        console.log('不存在!');
    }
});
/*
module.filename：开发期间，该行代码所在的文件。
__filename：始终等于 module.filename。
__dirname：开发期间，该行代码所在的目录。
process.cwd()：运行node的工作目录，可以使用  cd /d 修改工作目录。
require.main.filename：用node命令启动的module的filename, 如 node xxx，这里的filename就是这个xxx。
require()方法的坐标路径是：module.filename；fs.readFile()的坐标路径是：process.cwd()。
*/