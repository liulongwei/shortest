/*************************************************************************
 * 本模块属于用户业务逻辑模块，登录
 * 输入类型：json（函数调用的参数）
 * 输入格式示例：
{
    "function":"user_login_submit",
    "status":"null",
    "data":{
        "email":"llw@163.com",
        "password":"123456",
    }
}
 * 输出类型：json（函数的返回值）
 * 返回格式示例：
	{
	    "function":"user_login_feedback",
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
 
 var encrypt = require('./encrypt');
 var DB = require('./db');

 function login_check(user_input,callback){
    var email = user_input.data.email;
    var password = user_input.data.password;

    var jsonRes = {};
    var dataRes = {};
    jsonRes["function"] = "user_login_feedback";
    jsonRes["status"] = "success";
    jsonRes["data"] = dataRes;

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
            dataRes["message"] = "此邮箱还未注册，请检查是否输入错误";
            callback(jsonRes);
        }
        else{
            if(encrypt.hex_md5(password) != rows[0]["password"]){
                jsonRes["status"] = "failed";
                dataRes["message"] = "邮箱与密码不一致哦";
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
		req["session"]["email"] = rows[0]["email"];//此处加上会报错，需与前台联合调试才正常
                callback(jsonRes);
            }
        }
    });
    DB.Disconnect(connection);
 }

module.exports={
    login_check:login_check
}
