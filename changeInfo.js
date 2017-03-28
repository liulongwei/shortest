var encrypt = require('./encrypt');
var DB = require('./db');

/*************************************************************************
 * 本模块属于用户业务逻辑模块，修改密码
 * 输入类型：json（函数调用的参数）
 * 输入格式示例：
{
    "function":"userinfo_alterpsw_submit",
    "status":"null",
    "data":{
    	"userid":"1",
        "oldpsw":"sgz",
        "newpsw":"sgz001"
    }
}
 * 输出类型：json（函数的返回值）
 * 返回格式示例：
	{
	    "function":"userinfo_alterpsw_feedback",
	    "status":"success",
	    "data":{
			"message":"";
	    }
	}
 * 此模块算法由 刘龙威 实现，编写待定。
 *************************************************************************/
function alterpsw(user_input,callback){
	var userid = user_input.data.userid;
	var oldpsw = user_input.data.oldpsw;
	var newpsw = user_input.data.newpsw;

	var jsonRes = {};
	var dataRes = {};
	jsonRes["function"] = "userinfo_alterpsw_feedback";
	jsonRes["status"] = "success";
	jsonRes["data"] = dataRes;
	dataRes["message"] = "修改密码成功";

	var connection=DB.Connect();
    var sqlQuery = 'select * from user where userid = ?';
    var sqlQueryParams = [userid];
    connection.query(sqlQuery,sqlQueryParams,function(err,rows,fields){
        if(err){
            console.log("Mysql Error:"+err.message);
            jsonRes["status"] = "failed";
            dataRes["message"] = "数据库错误"+err.message;
        }
        else if(rows[0] == null){
            jsonRes["status"] = "failed";
            dataRes["message"] = "数据库无此userid";
        }
        else{
            if(encrypt.hex_md5(oldpsw) != rows[0]["password"]){
	            jsonRes["status"] = "failed";
	            dataRes["message"] = "原密码输入错误，请重试！";
            }
            else{
	            var connectionUpdate=DB.Connect();
	            var sqlUpdate = 'update user set password = ? where userid = ?';
	            var sqlUpdateParams = [encrypt.hex_md5(newpsw),userid];
	            connectionUpdate.query(sqlUpdate,sqlUpdateParams,function(err,result){
	              if(err){
	                  console.log("sqlUpdate Error:"+err.message);
      	              jsonRes["status"] = "failed";
	           		  dataRes["message"] = "修改密码时遭遇数据库错误"+err.message;
	                }
	            })
	            DB.Disconnect(connectionUpdate);
            }
        }
        callback(jsonRes);
    });
    DB.Disconnect(connection);
}

/*************************************************************************
 * 本模块属于用户业务逻辑模块，修改用户个人资料
 * 输入类型：json（函数调用的参数）
 * 输入格式示例：
{
    "function":"userinfo_alter_submit",
    "status":"null",
    "data":{
    	"userid" = "1"
        "username":"sgz",
        "email":"vincentsheng@126.com",
        "sex":"m",
        "telephone":"15850225420",
        "age":22,
        "city":"苏州",
        "address":"独墅湖高教区"
    }
}
 * 输出类型：json（函数的返回值）
 * 返回格式示例：
	{
	    "function":"userinfo_alter_feedback",
	    "status":"success",
	    "data":{
			"message":"";
	    }
	}
 * 此模块算法由 刘龙威 实现，编写待定。
 *************************************************************************/
function  alteruserinfo(user_input,callback){
	var userid = user_input.data.userid;
	var username = user_input.data.username;
	var email = user_input.data.email;
	var sex = user_input.data.sex;
	var telephone = user_input.data.telephone;
	var age = user_input.data.age;
	var city = user_input.data.city;
	var address = user_input.data.address;

	var jsonRes = {};
	var dataRes = {};
	jsonRes["function"] = "userinfo_alter_feedback";
	jsonRes["status"] = "success";
	jsonRes["data"] = dataRes;
	dataRes["message"] = "修改资料成功";

	var connection=DB.Connect();
    var sqlQuery = 'select * from user where userid = ?';
    var sqlQueryParams = [userid];
    connection.query(sqlQuery,sqlQueryParams,function(err,rows,fields){
        if(err){
            console.log("Mysql Error:"+err.message);
            jsonRes["status"] = "failed";
            dataRes["message"] = "数据库错误"+err.message;
            callback(jsonRes);
        }
        else if(rows[0] == null){
            jsonRes["status"] = "failed";
            dataRes["message"] = "数据库无此userid";
            callback(jsonRes);
        }
        else{
    		var connection1=DB.Connect();
		    var sqlQuery1 = 'select * from user where username = ?';
		    var sqlQueryParams1 = [username];
		    connection1.query(sqlQuery1,sqlQueryParams1,function(err,rows1,fields){
    	        if(err){
		            console.log("Mysql Error:"+err.message);
		            jsonRes["status"] = "failed";
		            dataRes["message"] = "数据库错误"+err.message;
		        }
                else if(rows1[0] == null || rows1[0]["userid"] == rows[0]["userid"]){
		            var connectionUpdate=DB.Connect();
		            var sqlUpdate = 'update user set username = ?, email = ?, sex = ?, telephone = ?, age = ?, city = ?, address = ? where userid = ?';
		            var sqlUpdateParams = [username,email,sex,telephone,age,city,address,userid];
		            connectionUpdate.query(sqlUpdate,sqlUpdateParams,function(err,result){
		              if(err){
		                  console.log("sqlUpdate Error:"+err.message);
	      	              jsonRes["status"] = "failed";
		           		  dataRes["message"] = "修改资料时遭遇数据库错误"+err.message;
		                }
		            })
		            DB.Disconnect(connectionUpdate);
				}
				else if(rows1[0]["userid"] != rows[0]["userid"]){
				    jsonRes["status"] = "failed";
				    dataRes["message"] = "用户名"+username+"已被他人使用，请更换！";
				}
			    callback(jsonRes);
			})
			DB.Disconnect(connection1);
        }
    });
    DB.Disconnect(connection);
}

module.exports={
    alterpsw:alterpsw,
    alteruserinfo:alteruserinfo
}
