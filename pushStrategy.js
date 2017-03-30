/*************************************************************************
 * 本模块属于用户业务逻辑模块，上传攻略
 * 输入类型：json（函数调用的参数）
 * 输入格式示例：
{
    "function":"user_strategy_submit",
    "status":"null",
    "data":{
        "userid":"1",
        "strategytitle":"标题",
        "strategycontent":"内容",
    }
}
 * 输出类型：json（函数的返回值）
 * 返回格式示例：
	{
	    "function":"user_strategy_feedback",
	    "status":"success",
	    "data":{
            "strategyid":"1",
            "userid":"1",
	        "strategytitle":"标题",
            "strategycontent":"内容",
            "uploadtime":"日期时间",
	    }
	}
 * 此模块算法由 刘龙威 实现，编写待定。
 *************************************************************************/
 
  var DB = require('./db');
  function pushStrategy(user_input,callback){
    var userid = user_input.data.userid;
    var strategytitle = user_input.data.strategytitle;
    var strategycontent = user_input.data.strategycontent;

    var jsonRes = {};
    var dataRes = {};
    jsonRes["function"] = "user_strategy_feedback";
    jsonRes["status"] = "success";
    jsonRes["data"] = dataRes;

    var datetime = new Date();
    var date = datetime.getDate();
    var month = datetime.getMonth() + 1;
    var year = datetime.getFullYear();
    var hour = datetime.getHours();
    var minute = datetime.getMinutes();
    var second = datetime.getSeconds();

    var pushdate = year+"/"+month+"/"+date;
    var pushtime = hour+":"+minute+":"+second;

    var uploadtime = pushdate+" "+pushtime;

    if(strategytitle == null || strategycontent == null){
        jsonRes["status"] = "failed";
        callback(jsonRes);
    }
    else{
        var connectionInsert=DB.Connect();
        var sqlInsert = 'Insert Into strategy(userid,strategytitle,strategycontent,uploadtime) VALUES(?,?,?,?)';
        var sqlInsertParams = [userid,strategytitle,strategycontent,uploadtime];
        connectionInsert.query(sqlInsert,sqlInsertParams,function(err,result){
            if(err){
                  console.log("sqlInsert Error:"+err.message);
                  jsonRes["status"] = "failed";
                  callback(jsonRes);
                }
            else{
                dataRes["userid"] = userid;
                dataRes["strategytitle"] = strategytitle;
                dataRes["strategycontent"] = strategycontent;
                dataRes["uploadtime"] = uploadtime;  

                var connection=DB.Connect();
                var sqlQuery = 'select * from strategy where userid = ? and strategytitle = ? and uploadtime = ?';
                var sqlQueryParams = [userid,strategytitle,uploadtime];
                connection.query(sqlQuery,sqlQueryParams,function(err,rows,fields){
                    if(err){
                        console.log("Mysql Error:"+err.message);
                        jsonRes["status"] = "failed";
                    }
                    else{
                        dataRes["strategyid"] = rows[0]["strategyid"];  
                    }
                    callback(jsonRes);
                });
                DB.Disconnect(connection);
            }
        })
        DB.Disconnect(connectionInsert);
    }
}

module.exports={
    pushStrategy:pushStrategy
}
