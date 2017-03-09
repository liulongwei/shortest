/*************************************************************************
 * 与1.0版本相比，更改了数据库的表名和字段名，更改了代码中部分变量名，id字段变为由int变为varchar，因此在代码中增加了一次查询数据库获得行数的操作
 * 本模块属于业务逻辑模块，针对用户提交的数据，返回景点相关数据
 * 输入类型：json（函数调用的参数）
 * 输入格式示例：
    {
        "function":"getContent_submit",
        "status":"null",
        "data":{
            "city":"苏州",
            "name":"虎丘",
            "return":true/false
        }
    }
 * 输出类型：json（函数的返回值）
 * 返回格式示例：
    { 
        function: 'getContent_feedback',
        status: 'success',
        data: { 
    		"keywords":"休闲 观光 摄影 国家级文物保护单位 世界文化遗产 5A景区 园林 ",//景点tag,以空格分割
    		"description":"<b>留园</b>是中国著名古典园林，位于江南古城<b>苏州</b>...",//景点简介
    		"ticket":"成人门票：60元/人<br/>旺季（4月16日—10月30日）60元；淡季...",//门票信息
    		"price":"60",//匹配出的票价
    		"openTime":"07:30-18:00，一般2－3小时可游完虎丘。",//开放时间
    		"bestTime":"p><b>最佳出行月份：</b>每年3月～5月</p><p><b>出行看点：</b>苏州...",//最佳出行时间
    		"rank":"4.5",//星级
    		"engName":"Humble Administrator Garden",//英文名
    		"picUrl":"http://gss0.baidu.com/...jpg http://gss0.baidu.com/...jpg",//图片链接,以空格分割
        } 
    }
    //数据库不能存放数组，以字符串存放(空格分割数据)
 * 此模块算法由 刘龙威 实现，编写待定。
 *************************************************************************/
 function getContent(user_input,callback){
	const async = require('async');
	const http = require('http');
	const transliteration = require('transliteration');
	var DB = require('./db');

	var placeCity = user_input.data.city;
	var placeName = user_input.data.name;

	var jsonRes = {}
	jsonRes["function"] = "getContent_feedback";
	jsonRes["status"] = "success";
	var dataRes = {};
	jsonRes["data"] = dataRes;

	var connection=DB.Connect();
	var sqlQuery = 'select * from scenarydescription where scenaryname= ? and scenarycity= ?';
	var sqlQueryParams = [placeName,placeCity];
	connection.query(sqlQuery,sqlQueryParams,function(err,rows,fields){
		if(err){
			console.log("Mysql Error:"+err.message);
		}
		else if(rows[0] == null){
			async.parallelLimit([
				function getYiLongName(callback){
					var url = encodeURI('http://m.elong.com/trip/index/getdest.html?keyword=' + placeName);
				    http.get(url, function (response) {
					    var body = [];
					    response.on('data', function (chunk) {
					        body.push(chunk);
					    })
					    response.on('end', function () {
					        body = Buffer.concat(body);
					        var jsonData = JSON.parse(body);
					        var retUrl = jsonData.data[0].url;
					        callback(null,retUrl);        
					    })
					}).on('error',function(e){
					    console.log("Got Error:"+e.message);
					})
				},
				function getBaiduName(callback){
					var url = encodeURI('http://lvyou.baidu.com/destination/ajax/sug?wd='+placeName+'&prod=lvyou_new&su_num=20');
					http.get(url, function (response) {
					    var body = [];
					    response.on('data', function (chunk) {
					        body.push(chunk);
					    })
					    response.on('end', function () {
					        body = Buffer.concat(body);
					        var jsonData = JSON.parse(body);
					        var data = jsonData.data.sug;
					        data = data.match(/"s":\[".*?\$/g)[0].replace(/"s":\["|\$/g,'');
					        if(data == null){
					        	jsonRes["status"] = "failed";
					        	callback(jsonRes);
					        	//return;
					        }
							var baiduName = transliteration.transliterate(data).toLowerCase().replace(/\s*/g,'');
					        callback(null,baiduName);        
					    })
					}).on('error',function(e){
					    console.log("Got Error:"+e.message);
					})
				},
			],1,function(err,result){
				//console.log(result);
				var yiLongName = result[0];
				var baiduName = result[1];
				async.parallel([
					function getYiLongHtml(callback){
						var url = 'http://trip.elong.com/' + yiLongName + '/jianjie/';
					    http.get(url, function (response) {
						    var body = [];
						    response.on('data', function (chunk) {
						        body.push(chunk);
						    })
						    response.on('end', function () {
						        body = Buffer.concat(body).toString();
						        //console.log(body);
						        callback(null,body);        
						    })
						}).on('error',function(e){
						    console.log("Got Error:"+e.message);
						})
					},
					function getBaiduHtml(callback){
						var url = 'http://lvyou.baidu.com/'+baiduName+'/photo-liangdian/';
					    http.get(url, function (response) {
						    var body = [];
						    response.on('data', function (chunk) {
						        body.push(chunk);
						    })
						    response.on('end', function () {
						        body = Buffer.concat(body).toString();
						        //console.log(body);
						        callback(null,body);        
						    })
						}).on('error',function(e){
						    console.log("Got Error:"+e.message);
						})
					},
				],function(err,result){
						//console.log(result);
						var yiLongHtml = result[0].replace(/\t|\n|\r/g,'');
						var baiduHtml = result[1].replace(/\t|\n|\r/g,'');

						var yiLongCheck = yiLongHtml.match(/<div id="menu-current">.*?<\/div>/g);
						if(yiLongCheck == null){
							jsonRes["status"] = "failed";
							callback(jsonRes);
							//return;
						}
						else if(yiLongCheck[0].indexOf(placeCity) <= -1){
							//console.log('输入的城市和景点不匹配或景点名不正确');
							jsonRes["status"] = "failed";
							callback(jsonRes);//输入的城市和景点不匹配或景点名不正确
							//return;
						}


						var keywordHtml = yiLongHtml.match(/<div class="dnew-bq dnew-no">.*?<\/div>/g);
						var descriptionHtml = yiLongHtml.match(/<h3>.*?简介<\/h3>.*?<div class="jj-sum">.*?<\/div>/g);
						var ticketHtml = yiLongHtml.match(/<h3>门票.*?<\/h3>.*?<div class="jj-sum">.*?<\/div>/g);
						var openTimeHtml = yiLongHtml.match(/<h3>开放时间.*?<\/h3>.*?<div class="jj-sum">.*?<\/div>/g);
						var bestTimeHtml = yiLongHtml.match(/<h3>最佳出行时间.*?<\/h3>.*?<div class="jj-sum">.*?<\/div>/g);
				        var ratingHtml = baiduHtml.match(/<div property="v:average" content=".*?"/g);
				        var enNameHtml = baiduHtml.match(/<span class="view-head-scene-enname" title=".*?">/g);
				        var picUrlHtml = baiduHtml.match(/high_light_album.*?going_count/g);
				        if(picUrlHtml == null){
				        	//console.log('输入的城市和景点不匹配或景点名不正确');
				        	jsonRes["status"] = "failed";
				        	callback(jsonRes);
				        	//return;
				        }
				        picUrlHtml = picUrlHtml[0].match(/"pic_url.*?".*?".*?"/g);
				        if(picUrlHtml){
				        	picUrlHtml.splice(0,1);
					        for(var i = 0; i < picUrlHtml.length; i++){
					        	picUrlHtml[i] = picUrlHtml[i].replace(/"pic_url":"|"/g,'');
					        	picUrlHtml[i] = 'http://gss0.baidu.com/7LsWdDW5_xN3otqbppnN2DJv/lvpics/pic/item/'+picUrlHtml[i]+'.jpg';
				        	}
				        	var picUrl = '';
							for(var i = 0; i < picUrlHtml.length; i++){
					      		picUrl += picUrlHtml[i];
					      		picUrl += ' ';
				        	}
				        }
				        else{
				        	var picUrl = null;
				        }

				        if(keywordHtml){
							var keyword = keywordHtml[0].match(/<a href=.*?>.*?<\/a>/g);
							for(var i = 0; i < keyword.length; i++){
								keyword[i] = keyword[i].replace(/<a href=.*?>|<\/a>/g,'');
							}
							var keywordString = '';
							for(var i = 0; i < keyword.length; i++){
								keywordString += keyword[i];
								keywordString += ' ';
							}
						}
						else{
							var keywordString = null;
						}

						if(descriptionHtml){
							var description = descriptionHtml[0].match(/<div class="jj-sum">(.*?)<\/div>/g)[0].replace(/<div class="jj-sum">|<\/div>/g,'');
						}
						else{
							var description = null;
						}
						
						if(ticketHtml){
							var ticket = ticketHtml[0].match(/<div class="jj-sum">(.*?)<\/div>/g)[0].replace(/<div class="jj-sum">|<\/div>/g,'');
							var price = ticket.match(/[1-9]\d*元\//g);
							if(price){
								price = price[0].replace(/元|\//g,'');
							}
						}
						else{
							var ticket = null;
						}

						if(openTimeHtml){
							var openTime = openTimeHtml[0].match(/<div class="jj-sum">(.*?)<\/div>/g)[0].replace(/<div class="jj-sum">|<\/div>/g,'');
						}
						else{
							var openTime = null;
						}
						
						if(bestTimeHtml){
							var bestTime = bestTimeHtml[0].match(/<div class="jj-sum">(.*?)<\/div>/g)[0].replace(/<div class="jj-sum">|<\/div>/g,'');
						}
						else{
							var bestTime = null;
						}

				        if(ratingHtml){
				        	var rating = ratingHtml[0].replace(/<div property="v:average" content="|"/g,'');
				        }
				        else{
				        	var rating = null;
				        }

				        if(enNameHtml){
				        	var enName = enNameHtml[0].replace(/<span class="view-head-scene-enname" title="|">/g,'');
				        }
				        else{
				        	var enName = null;
				        }

						// console.log('关键词：'+keywordString);
						// console.log('简介：'+description);
						// console.log('门票信息：'+ticket);
						// console.log('门票价格：'+price);
						// console.log('开放时间：'+openTime);
						// console.log('最佳出行时间：'+bestTime);
						// console.log('星级：'+rating);
						// console.log('英文名：'+enName);
				  // 		console.log('图片链接：'+picUrl);

				        dataRes["keywords"] = keywordString;
				        dataRes["description"] = description;
				        dataRes["ticket"] = ticket;
				        dataRes["price"] = price;
				        dataRes["opentime"] = openTime;
				        dataRes["besttime"] = bestTime;
				        dataRes["ranking"] = rating;
				        dataRes["englishname"] = enName;
				        dataRes["picture"] = picUrl;

				        //console.log(jsonRes);
				        callback(jsonRes);

						var connectionCount=DB.Connect();
						var sqlCount = 'select count(*) from scenarydescription';
						var sqlCountParams = [];
						//var count = 0;
						connectionCount.query(sqlCount,sqlCountParams,function(err,rows,fields){
				          if(err){
				              console.log("sqlCount Error:"+err.message);
				              jsonRes["status"] = "failed";
				              callback(jsonRes);
				          	}
				          	var count = (rows[0]["count(*)"]+1)+"";
          	        		var connectionInsert=DB.Connect();
							var sqlInsert = 'Insert Into scenarydescription(scenaryid,scenaryname,scenarycity,keywords,description,ticket,price,opentime,besttime,ranking,englishname,picture) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)';
				          	var sqlInsertParams = [count,placeName,placeCity,keywordString,description,ticket,price,openTime,bestTime,rating,enName,picUrl];
							connectionInsert.query(sqlInsert,sqlInsertParams,function(err,result){
					          if(err){
					              console.log("sqlInsert Error:"+err.message);
					              jsonRes["status"] = "failed";
					              callback(jsonRes);
					          	}
					      	})
					      	DB.Disconnect(connectionInsert);
				      	})
						DB.Disconnect(connectionCount);
						
				      	//return;
					}
				)
			});
		}
		else{//
			var connectionUpdate=DB.Connect();//对hot加一统计访问热度
			var sqlUpdate = 'update scenarydescription set hot=hot+1 where scenaryname= ? and scenarycity = ?';
			var sqlUpdateParams = [placeName,placeCity];
			connectionUpdate.query(sqlUpdate,sqlUpdateParams,function(err,result){
	          if(err){
	              console.log("sqlUpdate Error:"+err.message);
	              jsonRes["status"] = "failed";
	              callback(jsonRes);
	              //return;
	          	}
	      	})
	      	DB.Disconnect(connectionUpdate);
	        dataRes["keywords"] = rows[0]["keywords"];
	        dataRes["description"] = rows[0]["description"];
	        dataRes["ticket"] = rows[0]["ticket"];
	        dataRes["price"] = rows[0]["price"];
	        dataRes["opentime"] = rows[0]["openTime"];
	        dataRes["besttime"] = rows[0]["bestTime"];
	        dataRes["ranking"] = rows[0]["ranking"];
	        dataRes["englishname"] = rows[0]["engName"];
	        dataRes["picture"] = rows[0]["picUrl"];
			//console.log(jsonRes);
			callback(jsonRes);
			//return;
		}
	})
	DB.Disconnect(connection);
}

module.exports={
    getContent:getContent
}
