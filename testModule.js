// var admin = require('./admin')

//以下测试feedbackList
// var user_input = {};
// var data = {};
// user_input["data"] = data;
// data["group"] = 1;

// admin.getFeedbackList(user_input,function(data){
// 	console.log(data);
// })

//以下测试feedbackid
// var feedbackid = 1;

// admin.getFeedback(feedbackid,function(data){
// 	console.log(data);
// })

//以下测试pushMsg
// var user_input = {};
// var messageRes = {};
// var data = {};
// var message = {};
// user_input["data"] = data;
// data["message"]= message;
// message["title"] = "推送消息标题4";
// message["content"] = "推送消息内容4";

// admin.pushMsg(user_input,function(data){
// 	console.log(data);
// })

//以下测试getUserInfo

// var userid = 9;

// admin.getUserInfo(userid,function(data){
// 	console.log(data);
// })

//以下测试getUserList
// var user_input = {};
// var data = {};
// user_input["data"] = data;
// data["group"] = 2;

// admin.getUserList(user_input,function(data){
// 	console.log(data);
// })


//以下测试queryUser
// var user_input = {};
// var messageRes = {};
// var data = {};
// var userinfo = {};
// user_input["data"] = data;
// data["userinfo"]= userinfo;
// userinfo["userid"] = null;
// userinfo["username"] = null;
// userinfo["address"] = null;

// admin.queryUser(user_input,function(data){
// 	console.log(data);
// })


// var changeInfo = require('./changeInfo');

// var user_input = {};
// var data = {};
// user_input["data"] = data;
// data["userid"] = 88;
// data["oldpsw"] = "liulongwei";
// data["newpsw"] = "liulongwei";

// changeInfo.alterpsw(user_input,function(data){
// 	console.log(data);
// })
// 
// var user_input = {};
// var data = {};
// user_input["data"] = data;
// data["username"] = "liulongwei123";
// data["email"] = "liulongwei@mail.com";
// data["sex"] = "M";
// data["telephone"] = "13205162000";
// data["age"] = "23";
// data["city"] = "上海";
// data["address"] = "外滩";

// changeInfo.alteruserinfo(user_input,function(data){
// 	console.log(data);
// })

// var user_register = require('./register');
// var user_input = {};
// var data = {};
// user_input["data"] = data;
// data["username"] = "spyder";
// data["password"] = "spydermima";
// data["email"] = "spyder@mail.com";
// data["sex"] = "";
// data["telephone"] = "13205168888";
// data["age"] = null;
// data["city"] = "";
// data["address"] = "外滩";

// user_register.user_register(user_input,function(data){
// 	console.log(data);
// })


// var login_check = require('./login');
// var user_input = {};
// var data = {};
// user_input["data"] = data;
// data["password"] = "spydermima";
// data["email"] = "spyder@mail.com";

// login_check.login_check(user_input,function(data){
// 	console.log(data);
// })

// var userinfoFeedback = require('./userinfoFeedback');
// var user_input = {};
// var data = {};
// user_input["email"] = "spyder@mail.com";

// userinfoFeedback.userinfoFeedback(user_input,function(data){
// 	console.log(data);
// })


// var pushStrategy = require('./pushStrategy');
// var user_input = {};
// var data = {};
// user_input["data"] = data;
// data["userid"] = 12342;
// data["strategytitle"] = "测试标题2";
// data["strategycontent"] = "测试内容2";

// pushStrategy.pushStrategy(user_input,function(data){
// 	console.log(data);
// })


// var DB = require('./db');
// var connection=DB.Connect();
// var sqlQuery = 'select count(*) from strategy';
// var sqlQueryParams = [];
// connection.query(sqlQuery,sqlQueryParams,function(err,rows,fields){
//     if(err){
//         console.log("Mysql Error:"+err.message);
//         jsonRes["status"] = "failed";
//     }
//     else{
//         console.log(rows[0]["count(*)"]); 
//     }
// });
// DB.Disconnect(connection);
