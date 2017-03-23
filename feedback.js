/*************************************************************************
 * 本模块属于用户业务逻辑模块，用于用户反馈建议意见信息
 * 输入类型：
{
    "function":"feedback_from_user_submit",
    "status":"null",
    "data":{
        "userid":"#",
        "title":"关于首页的若干建议",
        "content":"以下是反馈信息正文(字节流)"
    }
}
 * 输出类型：json（函数的返回值）
 * 返回格式示例：
{
    "function":"feedback_from_user_feedback",
    "status":"success",
}
 * 此模块算法由 刘龙威 实现，编写待定。
 *************************************************************************/
var DB = require('./db');
function feedback(user_input,callback){
    var userid = user_input.data.userid;
    var feedbacktitle = user_input.data.title;
    var feedbackcontent = user_input.data.content;

    var jsonRes = {};
    jsonRes["function"] = "feedback_from_user_feedback";
    jsonRes["status"] = "success";

    var connectionInsert=DB.Connect();
    var sqlInsert = 'Insert Into feedback(userid,feedbacktitle,feedbackcontent) VALUES(?,?,?)';
    var sqlInsertParams = [userid,feedbacktitle,feedbackcontent];
    connectionInsert.query(sqlInsert,sqlInsertParams,function(err,result){
        if(err){
              console.log("sqlInsert Error:"+err.message);
              jsonRes["status"] = "failed";
            }
        })
    callback(jsonRes);
    DB.Disconnect(connectionInsert);
}

module.exports={
    feedback:feedback
}
