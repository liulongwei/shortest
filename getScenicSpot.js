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
				if(scenaryRes["description"] == null){
					scenaryRes["impression"] = item["description"];
				}
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
            dataRes["impression"] = impression;
            dataRes["description"] = description;
            dataRes["ranking"] = ranking;
            dataRes["englishname"] = englishname;
            dataRes["type"] = type;
            dataRes["address"] = address;
            dataRes["phone"] = phone;
            dataRes["ticket"] = ticket;
            dataRes["price"] = price;
            dataRes["bestvisittime"] = bestvisittime;
            dataRes["besttime"] = besttime;
            dataRes["opentime"] = opentime;
            dataRes["picture"] = picture;
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
