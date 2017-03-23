var DB = require('./db');//此模块全局引用
/*************************************************************************
 * 本模块属于管理员业务逻辑模块，返回用户的反馈信息
 * 输入类型：json（函数调用的参数）
 * 输入格式示例：
    {
        "function"："admin_feedback_list_submit"，
        "status"："#"，
        "data"：{
            group:1;
        }
    }
 * 输出类型：json（函数的返回值）
 * 返回格式示例：
    {
        "function"："admin_feedback_list_feedback"，
        "status"："success"，
        "data"：{
            [
                {
                    feedbackid:1,
                    userid:1,
                    feedbacktitle:"公告标题测试1",
                    feedbackcontent:"公告内容测试1"
                },...
            ]
        }
    }

 * 输出类型：json（函数的返回值）
 * 返回格式示例：
{ "function": 'admin_feedback_feedback',
  "status": 'success',
  "data": 
   { feedbackid: 1,
     userid: '1',
     feedbacktitle: '标题1',
     feedbackcontent: '内容1' 
    } 
 }
 * 此模块算法由 刘龙威 实现，编写待定。
 *************************************************************************/

function getFeedbackList(user_input,callback){
    var group = user_input.data.group;

    var jsonRes = {};
    jsonRes["function"] = "admin_feedback_list_feedback";
    jsonRes["status"] = "success";
    var dataRes = [];
    jsonRes["data"] = dataRes;

    var groupLow= (group-1)*20 + 1;
    var groupHigh = group*20;

    var connection=DB.Connect();
    var sqlQuery = 'select * from feedback where feedbackid >= ? and feedbackid <= ?';
    var sqlQueryParams = [groupLow,groupHigh];
    connection.query(sqlQuery,sqlQueryParams,function(err,rows,fields){
        if(err){
            console.log("Mysql Error:"+err.message);
            jsonRes["status"] = "failed";
        }
        else{
            rows.map(function(item){
                //console.log(item);
                var itemRes = {};
                itemRes["feedbackid"] = item["feedbackid"];
                itemRes["userid"] = item["userid"];
                itemRes["feedbacktitle"] = item["feedbacktitle"];
                itemRes["feedbackcontent"] = item["feedbackcontent"];
                dataRes.push(itemRes);
            })
        }
        callback(jsonRes);
    });
    DB.Disconnect(connection);
}

function getFeedback(feedbackid,callback){
    var feedbackid = feedbackid;

    var jsonRes = {};
    jsonRes["function"] = "admin_feedback_feedback";
    jsonRes["status"] = "success";
    var dataRes = {};
    jsonRes["data"] = dataRes;

    var connection=DB.Connect();
    var sqlQuery = 'select * from feedback where feedbackid = ?';
    var sqlQueryParams = [feedbackid];
    connection.query(sqlQuery,sqlQueryParams,function(err,rows,fields){
        if(err){
            console.log("Mysql Error:"+err.message);
            jsonRes["status"] = "failed";
        }
        else if(rows[0] == null){
            jsonRes["status"] = "failed";
        }
        else{
            dataRes["feedbackid"] = rows[0]["feedbackid"];
            dataRes["userid"] = rows[0]["userid"];
            dataRes["feedbacktitle"] = rows[0]["feedbacktitle"];
            dataRes["feedbackcontent"] = rows[0]["feedbackcontent"];
        }
        callback(jsonRes);
    });
    DB.Disconnect(connection);
}

/*************************************************************************
 * 本模块属于管理员业务逻辑模块，发布公告(推送)
 * 输入类型：json（函数调用的参数）
 * 输入格式示例：
    {
        "function"："admin_pushmsg_submit"，
        "status"："#"，
        "data"：{
            "message":{
                "title":"#",
                "content":"#"
            }
        }
    }
 * 输出类型：json（函数的返回值）
 * 返回格式示例：
    {
        "function"："admin_pushmsg_feedback"，
        "status"："success"，
    }
 * 此模块算法由 刘龙威 实现，编写待定。
 *************************************************************************/

 function pushMsg(user_input,callback){

    var jsonRes = {};
    jsonRes["function"] = "admin_feedback_feedback";
    jsonRes["status"] = "success";

    var pushtitle = user_input.data.message.title;
    var pushcontent = user_input.data.message.content;

    var datetime = new Date();
    var date = datetime.getDate();
    var month = datetime.getMonth() + 1;
    var year = datetime.getFullYear();
    var hour = datetime.getHours();
    var minute = datetime.getMinutes();
    var second = datetime.getSeconds();

    var pushdate = year+"/"+month+"/"+date;
    var pushtime = hour+":"+minute+":"+second;

    var connectionInsert=DB.Connect();
    var sqlInsert = 'Insert Into push(pushtitle,pushcontent,pushdate,pushtime) VALUES(?,?,?,?)';
    var sqlInsertParams = [pushtitle,pushcontent,pushdate,pushtime];
    connectionInsert.query(sqlInsert,sqlInsertParams,function(err,result){
        if(err){
              console.log("sqlInsert Error:"+err.message);
              jsonRes["status"] = "failed";
            }
        })
    callback(jsonRes);
    DB.Disconnect(connectionInsert);
    }

/*************************************************************************
 * 本模块属于管理员业务逻辑模块，返回指定userid的用户信息
 * 输入类型：userid
 * 输出类型：json（函数的返回值）
 * 返回格式示例：
    {
        "function"："admin_specific_userinfo_feedback"，
        "status"："#"，
        "data"：{
            //所有信息
        }
    }
 * 此模块算法由 刘龙威 实现，编写待定。
 *************************************************************************/

 function getUserInfo(userid,callback){
    var userid = userid;

    var jsonRes = {};
    jsonRes["function"] = "admin_specific_userinfo_feedback";
    jsonRes["status"] = "success";
    var dataRes = {};
    jsonRes["data"] = dataRes;

    var connection=DB.Connect();
    var sqlQuery = 'select * from user where userid = ?';
    var sqlQueryParams = [userid];
    connection.query(sqlQuery,sqlQueryParams,function(err,rows,fields){
        if(err){
            console.log("Mysql Error:"+err.message);
            jsonRes["status"] = "failed";
        }
        else if(rows[0] == null){
            jsonRes["status"] = "failed";
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
        }
        callback(jsonRes);
    });
    DB.Disconnect(connection);
 }

/*************************************************************************
 * 本模块属于管理员业务逻辑模块，返回指定范围内的用户信息
 * 输入类型：
     {
        "function"："admin_user_list_submit"，
        "status"："#"，
        "data"：{
            group:1;
        }
    }
 * 输出类型：json（函数的返回值）
 * 返回格式示例：
{ function: 'admin_user_list_feedback',
  status: 'success',
  data: 
   [ { userid: 21,
       username: 'user21',
       email: 'usertest@181.com',
       sex: 'M',
       telephone: '13812345696',
       age: 38,
       city: 'sz',
       address: 'address' },...
 ] }
 * 此模块算法由 刘龙威 实现，编写待定。
 *************************************************************************/

function getUserList(user_input,callback){
    var group = user_input.data.group;

    var jsonRes = {};
    jsonRes["function"] = "admin_user_list_feedback";
    jsonRes["status"] = "success";
    var dataRes = [];
    jsonRes["data"] = dataRes;

    var groupLow= (group-1)*20 + 1;
    var groupHigh = group*20;

    var connection=DB.Connect();
    var sqlQuery = 'select * from user where userid >= ? and userid <= ?';
    var sqlQueryParams = [groupLow,groupHigh];
    connection.query(sqlQuery,sqlQueryParams,function(err,rows,fields){
        if(err){
            console.log("Mysql Error:"+err.message);
            jsonRes["status"] = "failed";
        }
        else{
            rows.map(function(item){
                //console.log(item);
                var itemRes = {};
                itemRes["userid"] = item["userid"];
                itemRes["username"] = item["username"];
                itemRes["email"] = item["email"];
                itemRes["sex"] = item["sex"];
                itemRes["telephone"] = item["telephone"];
                itemRes["age"] = item["age"];
                itemRes["city"] = item["city"];
                itemRes["address"] = item["address"];
                dataRes.push(itemRes);
            })
        }
        callback(jsonRes);
    });
    DB.Disconnect(connection);
}

/*************************************************************************
 * 本模块属于管理员业务逻辑模块，返回特定条件查找到的用户信息
 * 输入类型：
    {
        "function"："admin_user_query_submit"，
        "status"："#"，
        "data"：{
            userinfo:{#}
        }
    }
 * 输出类型：json（函数的返回值）
 * 返回格式示例：
{ function: 'admin_user_query_feedback',
  status: 'success',
  data: 
   [ { userid: 21,
       username: 'user21',
       email: 'usertest@181.com',
       sex: 'M',
       telephone: '13812345696',
       age: [18,20],
       city: 'sz',
       address: 'address' },...
 ] }
 * 此模块算法由 刘龙威 实现，编写待定。
 *************************************************************************/

function queryUser(user_input,callback){
    var userid = user_input.data.userinfo.userid;
    var username = user_input.data.userinfo.username;
    var email = user_input.data.userinfo.email;
    var sex = user_input.data.userinfo.sex;
    var telephone = user_input.data.userinfo.telephone;
    var age = user_input.data.userinfo.age;
    var city = user_input.data.userinfo.city;
    var address = user_input.data.userinfo.address;
    address = '%'+address+'%';  //模糊查询

    var jsonRes = {};
    jsonRes["function"] = "admin_user_list_feedback";
    jsonRes["status"] = "success";
    var dataRes = [];
    jsonRes["data"] = dataRes;

    var connection=DB.Connect();
    var sqlQuery = 'select * from user where userid = IFNULL(?,userid) and username = IFNULL(?,username) and email = IFNULL(?,email) and sex = IFNULL(?,sex) and telephone = IFNULL(?,telephone) and age = IFNULL(?,age) and city = IFNULL(?,city) and address LIKE ? ';
    var sqlQueryParams = [userid,username,email,sex,telephone,age,city,address];
    connection.query(sqlQuery,sqlQueryParams,function(err,rows,fields){
        if(err){
            console.log("Mysql Error:"+err.message);
            jsonRes["status"] = "failed";
        }
        else if(rows[0] == null){
        }
        else{
            rows.map(function(item){
                //console.log(item);
                var itemRes = {};
                itemRes["userid"] = item["userid"];
                itemRes["username"] = item["username"];
                itemRes["email"] = item["email"];
                itemRes["sex"] = item["sex"];
                itemRes["telephone"] = item["telephone"];
                itemRes["age"] = item["age"];
                itemRes["city"] = item["city"];
                itemRes["address"] = item["address"];
                dataRes.push(itemRes);
            })
        }
        callback(jsonRes);
    });
    DB.Disconnect(connection);

}

module.exports={
    getFeedbackList:getFeedbackList,
    getFeedback:getFeedback,
    pushMsg:pushMsg,
    getUserInfo:getUserInfo,
    getUserList:getUserList,
    queryUser:queryUser
}

