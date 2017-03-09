function getLocalList (cityName,callback) {
	var DB = require('./db');
	var jsonRes = {};
	jsonRes["function"] = "localList_feedback";
	jsonRes["status"] = "success";
	var scenaryList = [];
	var dataRes = {};
	dataRes["city"] = cityName;
	dataRes["list"] = scenaryList;
	jsonRes["data"] = dataRes;

	var connection=DB.Connect();
	var sqlQuery = 'select * from scenarydescription where scenarycity= ?';
	var sqlQueryParams = [cityName];
	connection.query(sqlQuery,sqlQueryParams,function(err,rows,fields){
		if(err){
			console.log("Mysql Error:"+err.message);
		}
		else if(rows[0] == null){
			jsonRes["status"] = "failed";
			callback(jsonRes);
		}
		else{
			rows.map(function(item){
				//console.log(item);
				var scenaryRes = {};
				scenaryRes["scenaryname"] = item["scenaryname"];
				scenaryRes["picture"] = item["picture"];
				scenaryRes["impression"] = item["impression"];
				scenaryList.push(scenaryRes);
			})
			callback(jsonRes);
		}
	})
	DB.Disconnect(connection);
}

// getLocalList("北京",function(data){
// 	console.log(data.data.list[0]);
// })

function getSpotDetail(cityName,scenaryName,callback){
	var DB = require('./db');
	var jsonRes = {};
	jsonRes["function"] = "localList_feedback";
	jsonRes["status"] = "success";
	var dataRes = {};
	jsonRes["data"] = dataRes;

	var connection=DB.Connect();
	var sqlQuery = 'select * from scenarydescription where scenarycity= ? and scenaryname = ?';
	var sqlQueryParams = [cityName,scenaryName];
	connection.query(sqlQuery,sqlQueryParams,function(err,rows,fields){
		if(err){
			console.log("Mysql Error:"+err.message);
		}
		else if(rows[0] == null){
			jsonRes["status"] = "failed";
			callback(jsonRes);
		}
		else{
		    dataRes["impression"] = rows[0]["impression"];
		    dataRes["description"] = rows[0]["description"];
		    dataRes["ranking"] = rows[0]["ranking"];
		    dataRes["englishname"] = rows[0]["englishname"];
		    dataRes["type"] = rows[0]["type"];
		    dataRes["address"] = rows[0]["address"];
		    dataRes["phone"] = rows[0]["phone"];
		    dataRes["ticket"] = rows[0]["ticket"];
		    dataRes["price"] = rows[0]["price"];
		    dataRes["bestvisittime"] = rows[0]["bestvisittime"];
		    dataRes["besttime"] = rows[0]["besttime"];
		    dataRes["opentime"] = rows[0]["opentime"];
		    dataRes["picture"] = rows[0]["picture"];
		    callback(jsonRes);
		}
	})
	DB.Disconnect(connection);
}

// getSpotDetail("北京","圆明园",function(data){
// 	console.log(data);
// })

module.exports={
    getLocalList:getLocalList,
    getSpotDetail:getSpotDetail
}
