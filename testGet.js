var getContent = require('./getContentV2.0')

var city = "北京";
var names = ["故宫","颐和园","八达岭长城","天安门","后海","天坛","圆明园","鸟巢","香山","南锣鼓巷","北海公园","天安门广场","北京动物园","世界公园","恭王府","清华大学","北京大学","三里屯","王府井","北京欢乐谷","雍和宫","中国科学技术馆","北京海洋馆","国家博物馆","景山公园","毛主席纪念堂","水立方","奥林匹克森林公园","慕田峪长城","龙庆峡","明十三陵","八大处","人民大会堂","蓝调庄园","西单","东方普罗旺斯薰衣草庄园","妙峰山","簋街","八大胡同","居庸关长城","北京植物园"];

// var city = "苏州";
// var names = ["周庄","同里","虎丘","拙政园","寒山寺","平江路","狮子林","苏州乐园","留园","山塘街","甪直","金鸡湖","锦溪","观前街","苏州博物馆","天平山","千灯古镇","木渎","网师园","穹窿山","阳澄湖","虞山","白马涧生态园","退思园","定园","沧浪亭","苏州摩天轮公园"];

// var city = "杭州";
// var names = ["西湖","灵隐寺","千岛湖","宋城","雷峰塔","杭州乐园","断桥","三潭印月","钱塘江","苏堤","岳王庙","孤山","六和塔","西泠印社","杭州动物园","大明山","南宋御街","胡雪岩故居","富春江","天目山","飞来峰","杭州植物园","浙江省博物馆"];

// var city = "南京";
// var names = ["夫子庙","中山陵","南京总统府","南京大屠杀遇难同胞纪念馆","明孝陵","秦淮河","雨花台","南京长江大桥","玄武湖","紫金山","莫愁湖","紫金山天文台","将军山","瞻园","栖霞山","阅江楼","灵谷寺","栖霞寺","鸡鸣寺","南京博物馆","梅花山","牛首山","紫霞湖","明城墙","明故宫遗址公园","玄武湖公园","乌衣巷","燕子矶","银杏湖","江宁织造博物馆","先锋书店","江南贡院遗址","南京野生动物园","南京云锦博物馆","中山植物园","南京科技馆","南京奥林匹克体育中心"];

// var city = "上海";
// var names = ["外滩","东方明珠","老城隍庙","南京路","田子坊","朱家角","上海科技馆","崇明岛","豫园","泰晤士小镇","上海野生动物园","七宝老街","上海欢乐谷","上海海洋水族馆","上海杜莎夫人蜡像馆","上海动物园","金茂大厦","徐家汇天主教堂","上海博物馆","世纪公园","共青森林公园","新天地","环球金融中心","上海人民广场","静安寺","上海植物园","中共一大会址","鲁迅公园","陆家嘴"];

// for(var i = 0; i < name.length; i++){
// 	var json = {}
// 	json["function"] = "getContent_submit";
// 	json["status"] = null;
// 	var data = {};
// 	data["city"] = city;
// 	data["name"] = name[i];
// 	data["return"] = true;
// 	json["data"] = data;
// 	getContent.getContent(json,function(data){
// 		console.log(data);
// 	})
// }


names.forEach(function(name){
	var json = {}
	json["function"] = "getContent_submit";
	json["status"] = null;
	var data = {};
	data["city"] = city;
	data["name"] = name;
	data["return"] = true;
	json["data"] = data;

	getContent.getContent(json,function(data){
		console.log(data);
	})
})

console.log(names.length)


