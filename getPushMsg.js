var DB = require('./db');//此模块全局引用
/*************************************************************************
 * 本模块属于用户业务逻辑模块，返回获取网站的推送消息(根据推送消息的pushid获取)
 * 输入类型：整形
 *  getPushMsg.getPushmsgItem(3,function(data){
		console.log(data);
	})
 * 输出类型：json（函数的返回值）
 * 返回格式示例：
{ function: 'pushmsg_item_feedback',
  status: 'success',
  data: 
   { pushid: 3,
     pushdate: '2017/3/18',
     pushtime: '21:32:10',
     pushtitle: '推送消息标题3',
     pushcontent: '推送消息内容3' } }
 * 此模块算法由 刘龙威 实现，编写待定。
 *************************************************************************/
function getPushmsgItem(pushid,callback){
	var jsonRes = {};
	var dataRes = {};
	jsonRes["function"] = "pushmsg_item_feedback";
	jsonRes["status"] = "success";
	jsonRes["data"] = dataRes;

    var connection=DB.Connect();
    var sqlQuery = 'select * from push where pushid = ?';
    var sqlQueryParams = [pushid];
    connection.query(sqlQuery,sqlQueryParams,function(err,rows,fields){
        if(err){
            console.log("Mysql Error:"+err.message);
            jsonRes["status"] = "failed";
        }
        else if(rows[0] == null){
        	jsonRes["status"] = "failed";
        }
        else{
            dataRes["pushid"] = pushid;
            dataRes["pushdate"] = rows[0]["pushdate"];
            dataRes["pushtime"] = rows[0]["pushtime"];
            dataRes["pushtitle"] = rows[0]["pushtitle"];
            dataRes["pushcontent"] = rows[0]["pushcontent"];
        }
        callback(jsonRes);
    });
    DB.Disconnect(connection);
}


/*************************************************************************
 * 本模块属于用户业务逻辑模块，返回获取网站的推送消息列表
 * 输入类型：无
 * 输出类型：json（函数的返回值）
 * 返回格式示例：按pushid降序排列，第一个是最新发布的推送，默认返回全部推送历史
{
    "function":"pushmsg_list_feedback",
    "status":"success",
    "data":{
        "msg_list":[
            {
                "pushid":1013204,
                "pushdate":"2016-12-06",
                "pushtime":"19:05",
                "pushtitle":"账号安全警告"，
            },
            ...//任意长度，后面省略
        ]
    }
}
 * 此模块算法由 刘龙威 实现，编写待定。
 *************************************************************************/

function getPushmsgList(callback){
	var jsonRes = {};
	var dataRes = {};
	msg_list = [];
	jsonRes["function"] = "pushmsg_list_feedback";
	jsonRes["status"] = "success";
	jsonRes["data"] = dataRes;
	dataRes["msg_list"] = msg_list;

    var connection=DB.Connect();
    var sqlQuery = 'select * from push order by pushid desc';
    var sqlQueryParams = [];
    connection.query(sqlQuery,sqlQueryParams,function(err,rows,fields){
        if(err){
            console.log("Mysql Error:"+err.message);
            jsonRes["status"] = "failed";
        }
        else if(rows[0] == null){
        	jsonRes["status"] = "failed";
        }
        else{
                rows.map(function(item){
                var itemRes = {};
                itemRes["pushid"] = item["pushid"];
                itemRes["pushdate"] = item["pushdate"];
                itemRes["pushtime"] = item["pushtime"];
                itemRes["pushtitle"] = item["pushtitle"];
                msg_list.push(itemRes);
            })
        }
        callback(jsonRes);
    });
    DB.Disconnect(connection);
}

module.exports={
    getPushmsgItem:getPushmsgItem,
    getPushmsgList:getPushmsgList
}
