var qs = require('querystring');

//辅助函数： 发送HTML，创建表单， 接收表单数据

//发送HTML响应
exports.sendHtml = function(res, html){
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
};

//解析HTTP POST数据
exports.parseReceivedData = function(req, cb){
    var body = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk){body += chunk});
    req.on('end', function(){
        var data = qs.parse(body);
        console.log('让我们看看data里面是什么：' + data);
        cb(data);
    });
};

//渲染简单表单
exports.actionForm = function(id, path, label){
    var html = '<form method="POST" action="' + path + '">' +
    '<input type="hidden" name="id" value="' + id + '">'+
    '<input type="submit" value="' + label + '" />'+
    '</form>';
    return html;
};


//添加工作记录
exports.add = function (db, req, res){
    exports.parseReceivedData(req, function(work){    //解析 HTTP POST 数据
        db.query(
            "INSERT INTO work (hours, date, description) " +     //添加工作记录的sql
            "VALUES (?, ?, ?)",                             // ？是 占位符
            [work.hours, work.date, work.description],     //工作记录数据
            function(err){
                if(err) throw err;
                // console.log('Add one node, hours:' + work.hours + 'date:' + work.date + 'description:' + work.description);
                exports.show(db, res);          //给用户显示工作记录清单
            }
        );
    });
};

//删除工作记录
exports.delete = function(db, req, res){
    exports.parseReceivedData(req, function(work){
        db.query(
            "DELETE FROM work WHERE id=?",
            [work.id],
            function(err){
                if(err) throw err;
                exports.show(db, res);
            }
        );
    });
};

//归档一条工作记录
exports.archive = function (db, req, res) {
    exports.parseReceivedData(req, function(work){
        db.query(
            "UPDATE work SET archived=1 WHERE id=?",
            [work.id],
            function(err){
                if(err) throw err;
                exports.show(db, res);
            }
        );
    });
};


//获取工作记录
exports.show = function(db, res, showArchived){
    var query = "SELECT * FROM work " +                 //获取工作记录的sql
        "WHERE archived=? "+
        "ORDER BY date DESC";
    var archiveValue = (showArchived) ? 1 : 0;
    db.query(
        query,
        [archiveValue],                 //想要的工作记录归档状态
        function(err, rows){
            if(err) throw err;
            html = (showArchived)
            ? ''
            : '<a href="/archived">Archived Work</a><br/>';
            html += exports.workHitlistHtml(rows);                   //将结果格式化为HTML表格
            html += exports.workFormHtml(); 
            exports.sendHtml(res, html);                         //给用户发送HTML响应
        } 
    );
};

exports.showArchived = function(db, res){
    exports.show(db, res, true);              //只显示归档记录
};


//将工作记录渲染为HTML表格
exports.workHitlistHtml = function(rows){
    var html = '<table>';
    for(var i in rows){
        html += '<tr>';
        html += '<td>' + rows[i].date + '</td>';
        html += '<td>' + rows[i].hours + '</td>';
        html += '<td>' + rows[i].description + '</td>';
        if(!rows[i].archived){
            html += '<td>' + exports.workArchiveForm(rows[i].id) + '</td>';
        }
        html += '<td>' + exports.workDeleteFrom(rows[i].id) + '</td>';
        html += '</tr>';
    }
    
    html += '</table>';
    return html;
};

//用来添加、归档、删除工作记录的HTML表单
exports.workFormHtml = function(){
    var html = '<form method="POST" action="/">' +               //渲染用来输入新工作记录的空白HTML表单
        '<p>Date (YYYY-MM-DD):<br/><input name="date" type="text" /> <p/>' +
        '<p>Hours worked:<br/><input name="hours" type="text" /><p/>' +
        '<p>Description:<br/>' + 
        '<textarea name="description"></textarea></p>' +
        '<input type="submit" value="Add" />' + 
        '</form>';
        return html;
};

exports.workArchiveForm = function(id){
    return exports.actionForm(id, '/archive', 'Archive');           //渲染归档按钮表单
};

exports.workDeleteFrom = function(id){
    return exports.actionForm(id, '/delete', 'Delete');             //渲染删除按钮表单
}