/*************************************************************************
 * 本模块属于业务逻辑模块，针对用户提交的数据，返回景点相关数据
 * 输入类型：json（函数调用的参数）
 * 输入格式示例：
    {
        "function":"getContent_submit",
        "status":"null",
        "data":{
            "city":"北京",
            "name":"故宫",
            "return":true/false
        }
    }
 * 输出类型：json（函数的返回值）
 * 返回格式示例：
{ function: 'getContent_feedback',
  status: 'success',
  data: 
   { impression: '故宫是一直向往的神圣之地，风景很美。故宫的建筑群保存得非常完好，无论是恢宏的气势、绝佳的建筑，还是深厚的历史文化底蕴都让人印象深刻。天气好的时候看得更加真切。',
     description: '北京故宫，旧称紫禁城，是中国明清两代24位皇帝的皇宫。是无与伦比的古代建筑杰作，也是世界现存最大、最完整的木质结构的古建筑群。\n故宫宫殿建筑均是木结构、黄琉璃瓦顶、青白石底座，饰以金碧辉煌的彩画。被誉为世界五大宫之一（北京故宫、法国凡尔赛宫、英国白金汉宫、美国白宫、俄罗斯克里姆林宫）。\n故宫的建筑沿着一条南北向中轴线排列并向两旁展开，南北取直，左右对称。依据其布局与功用分为“外朝”与“内廷”两大部分，以乾清门为界，乾清门以南为外朝，以北为内廷。外朝、内廷的建筑气氛迥然不同。\n故宫有4个门，正门名午门，东门名东华门，西门名西华门，北门名神武门。面对北门神武门，有用土、石筑成的景山，满山松柏成林。\n外朝以太和殿、中和殿、保和殿三大殿为中心，其中三大殿中的"太和殿”俗称“金銮殿”，是皇帝举行朝会 的地方，也称为“前朝”。是封建皇帝行使权力、举行盛典的地方。此外两翼东有文华殿、文渊阁、上驷院、南三所；西有武英殿、内务府等建筑。建筑造型宏伟壮丽，庭院明朗开阔，象征封建政权至高无上。\n内廷以乾清宫、交泰殿、坤宁宫后三宫为中心，两翼为养心殿、东六宫、西六宫、斋宫、毓庆宫，后有御花园。是封建帝王与后妃居住之所。内廷东部的宁寿宫是当年乾隆皇帝退位后养老而修建。内廷西部有慈宁宫、寿安宫等。此外还有重华宫，北五所等建筑。庭院深邃，建筑紧凑，自成一体，秩序井然。',
     ranking: 5,
     englishname: 'the Forbidden City',
     type: '公园历史建筑历史遗址',
     address: '北京市东城区景山前街4号',
     phone: '86-10-85007422,85007421',
     ticket: '旺季（4月1日~10月31日）：60.00元\n淡季（11月1日~3月31日）：40.00元\n珍宝馆（即进入宁寿宫区，含戏曲馆、石鼓馆）：10.00元\n钟表馆（即进入奉先殿区）：10.00元',
     price: 40,
     bestvisittime: '3-4小时',
     besttime: '四季皆宜。春季气候舒适，在故宫赏花是不错的选择；夏季炎热，可在室内参观；秋季，北京秋高气爽，红叶满地，游览故宫非常合适；冬季虽然寒冷，但是故宫的雪景确实美不胜收。',
     opentime: '1. 旺季（4月1日~10月31日）：08:30~17:00\n停止售票时间：16:00\n停止入场时间：16:10\n2. 淡季（11月1日~3月31日）：08:30~16:30\n停止售票时间：15:30\n停止入场时间：15:40\nTips：除法定节假日和暑期（7月1日~8月31日）外，故宫博物院全年实行周一下午闭馆的措施。每周一开馆时间为08:30~12:00，停止售票时间为11:00，停止检票时间为11:10，闭馆时间为12:00。\n',
     picture: 'http://gss0.baidu.com/7LsWdDW5_xN3otqbppnN2DJv/lvpics/pic/item/e824b899a9014c08705e1d3e0a7b02087af4f4c7.jpg http://gss0.baidu.com/7LsWdDW5_xN3otqbppnN2DJv/lvpics/pic/item/f2deb48f8c5494ee56f1d4b82df5e0fe98257e44.jpg http://gss0.baidu.com/7LsWdDW5_xN3otqbppnN2DJv/lvpics/pic/item/38dbb6fd5266d016e6db4589972bd40734fa3555.jpg http://gss0.baidu.com/7LsWdDW5_xN3otqbppnN2DJv/lvpics/pic/item/cf1b9d16fdfaaf5151305a1e8c5494eef11f7a44.jpg ' } }
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
            async.parallel([
                function getBaiduHtml(callback){
                    var baiduName = transliteration.transliterate(placeName).toLowerCase().replace(/\s*/g,'');
                    var url = 'http://lvyou.baidu.com/' + baiduName;
                    //var url = encodeURI('http://lvyou.baidu.com/search?word='+placeName);
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
                }
            ],function(err,result){
                    var baiduHtml = result[0].replace(/\t|\n|\r/g,'');
                    //console.log(baiduHtml);

                    var impressionHtml = baiduHtml.match(/impression:".*?",/g);//大家印象
                    var descriptionHtml = baiduHtml.match(/more_desc:".*?",/g);//景点简介
                    var rankingHtml = baiduHtml.match(/<span class=".*?"><\/span><\/span>.*?<a class="remark-count"/g);
                    var englishnameHtml = baiduHtml.match(/<span class="deputy-name">.*?<\/a>/g);
                    var typeHtml = baiduHtml.match(/景点类型：.*?<\/span>/g);//景点类型
                    var addressHtml = baiduHtml.match(/address:".*?",/g);//地址
                    var phoneHtml = baiduHtml.match(/phone:".*?",/g);//电话
                    var ticketHtml = baiduHtml.match(/'ticket_info',{text:".*?"}/g);//门票信息
                    var priceHtml = baiduHtml.match(/<b class="icon-rmb">.*?<\/span>/g);//参考价格
                    //var trafficHtml = baiduHtml.match(/'traffic',{text:".*?"}/g);//交通信息
                    var bestvisittimeHtml = baiduHtml.match(/'bestvisittime',{text:".*?"}/g);//建议游玩时长
                    var besttimeHtml = baiduHtml.match(/'besttime',{text:".*?"}/g);//最佳季节
                    var opentimeHtml = baiduHtml.match(/'open_time_desc',{text:".*?"}/g);//开放时间
                    var pictureHtml = baiduHtml.match(/<ul id="J_pic-slider" class="pic-slider">.*?<\/ul>/g);
                    //console.log(impressionHtml);

                    if(impressionHtml){
                        var impression = impressionHtml[impressionHtml.length-1].match(/impression:"(.*?)",/g)[0].replace(/impression:"|",/g,'').replace(/\\n/g," ");
                        impression = eval("'" + impression + "'")//unicode转中文
                    }
                    else var impression = null;

                    if(descriptionHtml){
                        var description = descriptionHtml[descriptionHtml.length-1].match(/more_desc:"(.*?)",/g)[0].replace(/more_desc:"|",/g,'').replace(/\\n/g," ");
                        description = eval("'" + description + "'")//unicode转中文
                    }
                    else var description = null;

                    if(rankingHtml){
                        var ranking = rankingHtml[rankingHtml.length-1].match(/<span class=".*?"><\/span><\/span>(.*?)<a class="remark-count"/g)[0].replace(/<span class=".*?"><\/span><\/span>|<a class="remark-count"|分/g,'');
                    }
                    else var ranking = null;

                    if(englishnameHtml){
                        var englishname = englishnameHtml[englishnameHtml.length-1].match(/<span class="deputy-name">(.*?)<\/a>/g)[0].replace(/<span class="deputy-name">|<\/a>|<a href=".*?">/g,'');
                    }
                    else var englishname = null;

                    if(typeHtml){
                        var type = typeHtml[typeHtml.length-1].match(/景点类型：(.*?)<\/span>/g)[0].replace(/景点类型：|<\/span>/g,'');
                        type = eval("'" + type + "'")//unicode转中文
                    }
                    else var type = null;

                    if(addressHtml){
                        var address = addressHtml[addressHtml.length-1].match(/address:"(.*?)",/g)[0].replace(/address:"|",/g,'');
                        address = eval("'" + address + "'")//unicode转中文
                    }
                    else var address = null;

                    if(phoneHtml){
                        var phone = phoneHtml[phoneHtml.length-1].match(/phone:"(.*?)",/g)[0].replace(/phone:"|",/g,'');
                        phone = eval("'" + phone + "'")//unicode转中文
                    }
                    else var phone = null;

                    if(ticketHtml){
                        var ticket = ticketHtml[ticketHtml.length-1].match(/'ticket_info',{text:"(.*?)"}/g)[0].replace(/'ticket_info',{text:"|"}/g,'').replace(/\\n/g," ");
                        ticket = eval("'" + ticket + "'")//unicode转中文
                    }
                    else var ticket = null;

                    if(priceHtml){
                        var price = priceHtml[0].match(/<b class="icon-rmb">(.*?)<\/span>/g)[0].replace(/'<b class="icon-rmb">|<\/span>|.*?<\/b>/g,'');
                    }
                    else var price = null;

                    // if(trafficHtml){
                    //     var traffic = trafficHtml[trafficHtml.length-1].match(/'traffic',{text:"(.*?)"}/g)[0].replace(/'traffic',{text:"|"}/g,'');
                    //     traffic = eval("'" + traffic + "'")//unicode转中文
                    // }
                    // else var traffic = null;

                    if(bestvisittimeHtml){
                        var bestvisittime = bestvisittimeHtml[bestvisittimeHtml.length-1].match(/'bestvisittime',{text:"(.*?)"}/g)[0].replace(/'bestvisittime',{text:"|"}/g,'');
                        bestvisittime = eval("'" + bestvisittime + "'")//unicode转中文
                    }
                    else var bestvisittime = null;

                    if(besttimeHtml){
                        var besttime = besttimeHtml[besttimeHtml.length-1].match(/'besttime',{text:"(.*?)"}/g)[0].replace(/'besttime',{text:"|"}/g,'').replace(/\\n/g," ");
                        besttime = eval("'" + besttime + "'")//unicode转中文
                    }
                    else var besttime = null;

                    if(opentimeHtml){
                        var opentime = opentimeHtml[opentimeHtml.length-1].match(/'open_time_desc',{text:"(.*?)"}/g)[0].replace(/'open_time_desc',{text:"|"}/g,'').replace(/\\n/g," ");
                        opentime = eval("'" + opentime + "'")//unicode转中文
                    }
                    else var opentime = null;

                    if(pictureHtml){
                        var pictureUrl = pictureHtml[pictureHtml.length-1].match(/http:\/\/gss0.baidu.com(.*?).jpg/g);
                        if(pictureUrl){
                            var picture = "";
                            for(var i = 0; i < pictureUrl.length; i++){
                                picture += pictureUrl[i];
                                picture += " ";
                            }
                        }       
                    }
                    else var picture = null;

                    //console.log(price);
                    dataRes["city"] = placeCity;
                    dataRes["name"] = placeName;

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

                    if(impression != null && description != null){//都为空则采集可能出错了，不入库
                        var connectionInsert=DB.Connect();
                        var sqlInsert = 'Insert Into scenarydescription(scenaryname,scenarycity,type,englishname,ranking,impression,description,address,phone,ticket,price,bestvisittime,besttime,opentime,picture) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
                        var sqlInsertParams = [placeName,placeCity,type,englishname,ranking,impression,description,address,phone,ticket,price,bestvisittime,besttime,opentime,picture];
                        connectionInsert.query(sqlInsert,sqlInsertParams,function(err,result){
                          if(err){
                              console.log("sqlInsert Error:"+err.message);
                            }
                        })
                        DB.Disconnect(connectionInsert);
                    }
                }
            )
        }
        else{
            var connectionUpdate=DB.Connect();//对hot加一统计访问热度
            var sqlUpdate = 'update scenarydescription set hot=hot+1 where scenaryname= ? and scenarycity = ?';
            var sqlUpdateParams = [placeName,placeCity];
            connectionUpdate.query(sqlUpdate,sqlUpdateParams,function(err,result){
              if(err){
                  console.log("sqlUpdate Error:"+err.message);
                }
            })
            DB.Disconnect(connectionUpdate);

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
    });
    DB.Disconnect(connection);
 }

module.exports={
    getContent:getContent
}
