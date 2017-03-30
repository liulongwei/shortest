/*************************************************************************
 * 本模块属于用户业务逻辑模块，获取用户信息
 * 输入类型：json（函数调用的参数）
 * 输入格式示例：通过session中email字段获取
 * 输出类型：json（函数的返回值）
 * 返回格式示例：
	{
	    "function":"userinfo_feedback",
	    "status":"success",
	    "data":{
            "message":"",
            "userid":"1",
    		"username":"sgz",
            "email":"123456@163.com",
            "sex":"M",
            "telephone":"13812345678"
            "age":22,
            "city":"苏州",
            "address":"独墅湖高教区"
	    }
	}
 * 此模块算法由 刘龙威 实现，编写待定。
 *************************************************************************/
 
 var DB = require('./db');

 function userinfoFeedback(user_input,callback){
    var email = user_input.email;

    jsonRes = {};
    dataRes = {};
    jsonRes["function"] = "userinfo_feedback";
    jsonRes["status"] = "success";
    jsonRes["data"] = dataRes;

    if(email == null || email == ""){
        jsonRes["status"] = "failed";
        dataRes["message"] = "email为空";
        callback(jsonRes);
    }
    else{
        var connection=DB.Connect();
        var sqlQuery = 'select * from user where email = ?';
        var sqlQueryParams = [email];
        connection.query(sqlQuery,sqlQueryParams,function(err,rows,fields){
            if(err){
                console.log("Mysql Error:"+err.message);
                jsonRes["status"] = "failed";
                dataRes["message"] = "数据库错误"+err.message;
                callback(jsonRes);
            }
            else if(rows[0] == null){
                jsonRes["status"] = "failed";
                dataRes["message"] = "数据库无此邮箱";
                callback(jsonRes);
            }
            else{
                dataRes["userid"] = rows[0]["userid"];
                dataRes["username"] = rows[0]["username"];
                dataRes["email"] = rows[0]["email"];
                dataRes["sex"] = rows[0]["sex"];
                dataRes["telephone"] = rows[0]["telephone"];
                dataRes["age"] = rows[0]["age"];
                dataRes["city"] = rows[0]["city"];
                dataRes["address"] = rows[0]["address"];
                callback(jsonRes);
            }
        });
        DB.Disconnect(connection);
    }
 }

 module.exports={
    userinfoFeedback:userinfoFeedback
}
