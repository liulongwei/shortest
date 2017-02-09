# -*- coding: UTF-8 -*-

import MySQLdb
import urllib2
import sys
import json

reload(sys)
sys.setdefaultencoding('utf-8')

place_city = sys.argv[1]
place_name = sys.argv[2]

html = urllib2.urlopen(r'http://api.map.baidu.com/geocoder/v2/?address=' + place_name + '&output=json&ak=oA4b8SDipmRn0j7FR57feU382NA6zGVQ&city=' + place_city)
hjson = json.loads(html.read())
if hjson['status'] != 0:
    print "wrong"
    sys.exit(1)
else:
    place_lat = hjson['result']['location']['lat']
    place_lng = hjson['result']['location']['lng']
    place_level = hjson['result']['level']

    db= MySQLdb.connect(host='localhost',user='root',passwd='liulongwei',db='test',charset='utf8')
    cur = db.cursor()

    sqli = "insert into place_info(place_name, place_city, place_lat, place_lng, place_level) values(%s, %s, %s, %s, %s)"
    try:
        # 执行sql语句
        cur.execute(sqli,(place_name, place_city, place_lat, place_lng, place_level))
        # 提交到数据库执行
        db.commit()
        print "success"
    except:
        # 发生错误时回滚
        db.rollback()
        print "failed"
    # 关闭数据库连接
    db.close()
    
    
# const eventproxy = require('eventproxy');
# var ep = new eventproxy();

# //var address = ['天坛','圆明园','颐和园','北京大学','什刹海','北京动物园','北京南站','北京西站'];
# var address = ['水立方','北京动物园','天坛','北京西站','北京南站','什刹海','北京大学','清华大学','中国人民大学'];
# var city = '北京';

# var start = [116.403406,39.92455];//起点经纬度,故宫
# var placeNum = address.length + 1;//加上起点
# var M = 9999 // 表示某个景点和它自己的距离
# var greedyOrCheckAll = 9//用贪心方法和暴力方法的界限

# var jsonRes = {}
# jsonRes["function"] = "travelroute_feedback";
# jsonRes["status"] = "success";
# var dataRes = {};
# dataRes["scenic_spot_ordered"] = [];
# jsonRes["data"] = dataRes;

# ep.after('lnglat',address.length,function(data){

#     function getAllLngLat(start,data,callback){
#         //console.log(data)
#         var lng = [];
#         var lat = [];
#         lng[0] = start[0];
#         lat[0] = start[1];
#         for(i = 1; i < data.length + 1; i++){
#             lng[i] = data[i-1][1];
#             lat[i] = data[i-1][2];
#         }
#         LngLat = [lng,lat];
#         callback(LngLat);
#     }

#     getAllLngLat(start,data,function(LngLat){

#         function getLists(placeNum,LngLat,callback){
#             var lng = LngLat[0];
#             var lat = LngLat[1];
#             var lists = new Array(placeNum);
#             for(var i = 0; i < placeNum; i++){ 
#                 lists[i] = new Array();    
#             }

#             for(var i = 0; i < placeNum; i++){
#                 for(var j = 0; j < placeNum; j++){
#                     if(i === j){
#                         lists[i][j] = M;
#                     }
#                     else{
#                         lists[i][j] = (Distance(lat[i], lng[i], lat[j], lng[j]));
#                     }
#                 }
#             }
#             //console.log(lists);     
#             callback(lists);       
#         }

#         getLists(placeNum,LngLat,function(lists){
            
#             function getPermutatedArray(callback){
#                 var a = [];
#                 for(var i = 1; i < placeNum; i++){
#                     a[i-1] = i;
#                 }
#                 function permutate(array/*需要进行全排列的一维数组*/, permutatedArray/*存放返回结果*/) {//引用:http://www.cnblogs.com/majiang/p/5990632.html
#                     if (!permutatedArray) {
#                         permutatedArray = [];
#                     }
#                     if (array.length > 1) {
#                         //弹出第一个数
#                         var elementCur = array.shift();
#                         //排列剩余的数组
#                         permutate(array, permutatedArray);
#                         //返回剩余的数组的排列长度
#                         var permutatedArrayLen = permutatedArray.length;
#                         //第一个数与其他剩余数组所有数组组合
#                         for (var j = 0; j < permutatedArrayLen; j++) {
#                             //弹出不齐的组
#                             var p = permutatedArray.shift();
#                             //把当前元素放到排列好的数组的所有位置
#                             for (var i = 0; i <= p.length; i++) {
#                                 //复制排列好的数组
#                                 var r = p.slice(0);
#                                 //插入数据到数组的位置
#                                 r.splice(i, 0, elementCur);
#                                 //保存
#                                 permutatedArray.push(r)
#                             }
#                         }
#                         //退出条件
#                     } else {
#                         permutatedArray.push([array[0]]);
#                     }
#                     return permutatedArray;
#                 }
#                 var permutatedArray = permutate(a,null);
#                 callback(permutatedArray);
#             }
#             if(placeNum <= greedyOrCheckAll){
#                 getPermutatedArray(function(permutatedArray){
#                     //console.log(permutatedArray);
#                     function checkAll(permutatedArray){
#                         var checkAllAns = [];
#                         var temp = M;
#                         //console.log(permutatedArray)
#                         for(var i = 0; i < permutatedArray.length; i++){
#                             var min = lists[0][permutatedArray[i][0]];
#                             for(var j = 0; j < placeNum - 2; j++){
#                                 //console.log(lists[ permutatedArray[i][j] ][ permutatedArray[i][j+1] ])
#                                 min += lists[ permutatedArray[i][j] ][ permutatedArray[i][j+1] ];
#                             }
#                             if(min < temp){
#                                 temp = min;
#                                 checkAllAns = permutatedArray[i];
#                             }
#                         }
#                         //console.log(checkAllAns);
#                         var res = []
#                         for(var i = 0; i < checkAllAns.length; i++){
#                             res.push( data[checkAllAns[i]-1][0] )
#                         }
#                         dataRes["scenic_spot_ordered"] = res;
#                         console.log(jsonRes);
#                         return jsonRes;
#                     }
#                     checkAll(permutatedArray);
#                 })                
#             }
#             else{
#                 var count = 0;
#                 var greedyAns = [];

#                 function getGreedy(callback){
#                     function greedy(x){
#                         var next = 0;
#                         var min = M;
#                         for(var i = 0; i < placeNum; i++){
#                             if(lists[x][i] < min){
#                                 next = i;
#                                 min = lists[x][i];
#                             }
#                         }
#                         for(var i = 0; i < placeNum; i++){
#                             lists[i][x] = M;
#                         }
#                         greedyAns.push(next);
#                         count += 1;
#                         if(count < placeNum - 1){
#                             greedy(next);
#                         }
#                     }
#                     greedy(0);
#                     callback(greedyAns);                
#                 }

#                 getGreedy(function(greedyAns){
#                     var res = []
#                     console.log(greedyAns);
#                     for(var i = 0; i < greedyAns.length; i++){
#                         res.push( data[greedyAns[i]-1][0] )
#                     }
#                     dataRes["scenic_spot_ordered"] = res;
#                     console.log(jsonRes);
#                     return jsonRes;
#                 })
#             }
#         })
#     })
# })

# for(var i = 0; i < address.length; i++){
#     getLngLat(address[i],city,ep.group('lnglat'));
# }
 
# function getLngLat(address,city,callback){
#     const http = require('http');

#     var url = encodeURI('http://api.map.baidu.com/geocoder/v2/?address='+address+'&output=json&ak=oA4b8SDipmRn0j7FR57feU382NA6zGVQ&city='+city);
#     http.get(url, function (response) {
#         var body = [];

#         response.on('data', function (chunk) {
#             body.push(chunk);
#         })

#         response.on('end', function () {
#             body = Buffer.concat(body);
#             var jsonData = JSON.parse(body);
#             //console.log(jsonData);
#             if(jsonData.status === 0){//错误码正常时返回
#                 callback(null,[address,jsonData.result.location.lng,jsonData.result.location.lat]);
#             }
#             else{
#                 jsonRes["status"] = jsonData.status;
#                 console.log(jsonRes);
#                 return jsonRes;
#             }           
#         })
#     })
# }

# function Distance(lat1,lng1,lat2,lng2){
#     var EARTH_RADIUS = 6378137.0;
#     var PI = Math.PI;
#     function getRad(d){
#         return d*PI/180.0;
#     };
#     var f = getRad((lat1 + lat2)/2);
#     var g = getRad((lat1 - lat2)/2);
#     var l = getRad((lng1 - lng2)/2);
#     var sg = Math.sin(g);
#     var sl = Math.sin(l);
#     var sf = Math.sin(f);
#     var s,c,w,r,d,h1,h2;
#     var a = EARTH_RADIUS;
#     var fl = 1/298.257;
#     sg = sg*sg;
#     sl = sl*sl;
#     sf = sf*sf;
#     s = sg*(1-sl) + (1-sf)*sl;
#     c = (1-sg)*(1-sl) + sf*sl; 
#     w = Math.atan(Math.sqrt(s/c));
#     r = Math.sqrt(s*c)/w;
#     d = 2*w*a;
#     h1 = (3*r -1)/2/c;
#     h2 = (3*r +1)/2/s;
#     return ( d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg)) / 1000 );//单位为km
# }


























