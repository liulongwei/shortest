/*************************************************************************
 * 本模块属于用户业务逻辑模块，注册
 * 输入类型：json（函数调用的参数）
 * 输入格式示例：
{
    "function":"user_register_submit",
    "status":"null",
    "data":{//用户名，密码和邮箱必填，其他可以为Null或空字符串
        "username":"sgz",
        "password":"123456",
        "email":"123456@163.com",
        "sex":"M",
        "telephone":"13812345678"
        "age":22,
        "city":"苏州",
        "address":"独墅湖高教区"
    }
}
 * 输出类型：json（函数的返回值）
 * 返回格式示例：
	{
	    "function":"user_register_feedback",
	    "status":"success",
	    "data":{
            "message":"",//注册成功为空字符串，注册失败时为错误信息
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

 function user_register(user_input,callback){
    var username = user_input.data.username;
    var password = user_input.data.password;
    var email = user_input.data.email;
    var sex = user_input.data.sex;
    var telephone = user_input.data.telephone;
    var age = user_input.data.age;
    var city = user_input.data.city;
    var address = user_input.data.address;

    jsonRes = {};
    dataRes = {};
    jsonRes["function"] = "user_register_feedback";
    jsonRes["status"] = "success";
    jsonRes["data"] = dataRes;
    dataRes["message"] = "";

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
        else if(username == null || password == null || email == null){
            jsonRes["status"] = "failed";
            dataRes["message"] = "用户名，密码，邮箱请必须填写哦";
            callback(jsonRes);
        }
        else if(rows[0] == null){
            var connectionInsert=DB.Connect();
            var sqlInsert = 'Insert Into user(username,password,email,sex,telephone,age,city,address) VALUES(?,?,?,?,?,?,?,?)';
            var sqlInsertParams = [username,encrypt.hex_md5(password),email,sex,telephone,age,city,address];
            connectionInsert.query(sqlInsert,sqlInsertParams,function(err,result){
                if(err){
                      console.log("sqlInsert Error:"+err.message);
                      jsonRes["status"] = "failed";
                      dataRes["message"] = "数据库错误"+err.message;
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
            })
            DB.Disconnect(connectionInsert);
        }
        else if(rows[0]["email"] == email){
            jsonRes["status"] = "failed";
            dataRes["message"] = "邮箱已被他人使用了哦";
            callback(jsonRes);
        }
    });
    DB.Disconnect(connection);
 }

 module.exports={
    user_register:user_register
}
