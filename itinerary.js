
function generateRoute(user_input,callback){
    const eventproxy = require('eventproxy');
    var ep = new eventproxy();
    var DB = require('./db');

    var address = user_input.data.scenic_spot;
    var city = user_input.data.city;
    var start = user_input.data.start;
    // var address = ['天坛','圆明园','颐和园','北京大学','什刹海','北京动物园','北京南站','北京西站'];
    //var address = ['水立方','北京动物园','天坛','北京西站','北京南站','什刹海','北京大学','清华大学','中国人民大学'];
    // var city = '北京';
    // var start = [116.403406,39.92455];//起点经纬度,故宫

    var placeNum = address.length + 1;//加上起点
    var M = 99999 // 表示某个景点和它自己的距离
    var greedyOrCheckAll = 9//用贪心方法和暴力方法的界限

    var jsonRes = {}
    jsonRes["function"] = "travelroute_feedback";
    jsonRes["status"] = "success";
    var dataRes = {};
    dataRes["scenic_spot_ordered"] = [];
    jsonRes["data"] = dataRes;

    ep.after('lnglat',address.length,function(data){

        function getAllLngLat(start,data,callback){
            //console.log(data)
            var lng = [];
            var lat = [];
            lng[0] = start[0];
            lat[0] = start[1];
            for(i = 1; i < data.length + 1; i++){
                lng[i] = data[i-1][1];
                lat[i] = data[i-1][2];
            }
            LngLat = [lng,lat];
            callback(LngLat);
        }

        getAllLngLat(start,data,function(LngLat){

            function getLists(placeNum,LngLat,callback){
                var lng = LngLat[0];
                var lat = LngLat[1];
                var lists = new Array(placeNum);
                for(var i = 0; i < placeNum; i++){ 
                    lists[i] = new Array();    
                }

                for(var i = 0; i < placeNum; i++){
                    for(var j = 0; j < placeNum; j++){
                        if(i === j){
                            lists[i][j] = M;
                        }
                        else{
                            if(isNaN( Distance(lat[i], lng[i], lat[j], lng[j]) )){
                                jsonRes["status"] = "duplicated scenic_spot";
                                //console.log(jsonRes);
                                //return jsonRes;
                            }
                            else{
                                lists[i][j] = (Distance(lat[i], lng[i], lat[j], lng[j]));                            
                            }
                        }
                    }
                }
                //console.log(lists);     
                callback(lists);       
            }

            getLists(placeNum,LngLat,function(lists){
                
                function getPermutatedArray(callback){
                    var a = [];
                    for(var i = 1; i < placeNum; i++){
                        a[i-1] = i;
                    }
                    function permutate(array/*需要进行全排列的一维数组*/, permutatedArray/*存放返回结果*/) {//引用:http://www.cnblogs.com/majiang/p/5990632.html
                        if (!permutatedArray) {
                            permutatedArray = [];
                        }
                        if (array.length > 1) {
                            //弹出第一个数
                            var elementCur = array.shift();
                            //排列剩余的数组
                            permutate(array, permutatedArray);
                            //返回剩余的数组的排列长度
                            var permutatedArrayLen = permutatedArray.length;
                            //第一个数与其他剩余数组所有数组组合
                            for (var j = 0; j < permutatedArrayLen; j++) {
                                //弹出不齐的组
                                var p = permutatedArray.shift();
                                //把当前元素放到排列好的数组的所有位置
                                for (var i = 0; i <= p.length; i++) {
                                    //复制排列好的数组
                                    var r = p.slice(0);
                                    //插入数据到数组的位置
                                    r.splice(i, 0, elementCur);
                                    //保存
                                    permutatedArray.push(r)
                                }
                            }
                            //退出条件
                        } else {
                            permutatedArray.push([array[0]]);
                        }
                        return permutatedArray;
                    }
                    var permutatedArray = permutate(a,null);
                    callback(permutatedArray);
                }
                if(placeNum <= greedyOrCheckAll){
                    getPermutatedArray(function(permutatedArray){
                        //console.log(permutatedArray);
                        function checkAll(permutatedArray){
                            var checkAllAns = [];
                            var temp = M;
                            //console.log(permutatedArray)
                            for(var i = 0; i < permutatedArray.length; i++){
                                var min = lists[0][permutatedArray[i][0]];
                                for(var j = 0; j < placeNum - 2; j++){
                                    //console.log(lists[ permutatedArray[i][j] ][ permutatedArray[i][j+1] ])
                                    min += lists[ permutatedArray[i][j] ][ permutatedArray[i][j+1] ];
                                }
                                if(min < temp){
                                    temp = min;
                                    checkAllAns = permutatedArray[i];
                                }
                            }
                            //console.log(checkAllAns);
                            var res = []
                            for(var i = 0; i < checkAllAns.length; i++){
                                res.push( data[checkAllAns[i]-1][0] )
                            }
                            dataRes["scenic_spot_ordered"] = res;
                            //console.log(jsonRes);
                            //return jsonRes;
                        }
                        checkAll(permutatedArray);
                    })                
                }
                else{
                    var count = 0;
                    var greedyAns = [];

                    function getGreedy(callback){
                        function greedy(x){
                            var next = 0;
                            var min = M;
                            for(var i = 0; i < placeNum; i++){
                                if(lists[x][i] < min){
                                    next = i;
                                    min = lists[x][i];
                                }
                            }
                            for(var i = 0; i < placeNum; i++){
                                lists[i][x] = M;
                            }
                            greedyAns.push(next);
                            count += 1;
                            if(count < placeNum - 1){
                                greedy(next);
                            }
                        }
                        greedy(0);
                        callback(greedyAns);                
                    }

                    getGreedy(function(greedyAns){
                        var res = []
                        //console.log(greedyAns);
                        for(var i = 0; i < greedyAns.length; i++){
                            res.push( data[greedyAns[i]-1][0] )
                        }
                        dataRes["scenic_spot_ordered"] = res;
                        //console.log(jsonRes);
                        //return jsonRes;
                    })
                }
            })
        })
    callback(jsonRes);
    })

    for(var i = 0; i < address.length; i++){
        getLngLatFromDb(address[i],city,ep.group('lnglat'));
    }
     
    function getLngLatFromDb(address,city,callback){
        var connection=DB.Connect();
        var sqlQuery = 'select * from place_info where place_name= ? and place_city= ?';
        var sqlQueryParams = [address,city];
        connection.query(sqlQuery,sqlQueryParams,function(err, rows, fields){
            if(err){
                console.log("Mysql Error:"+err.message);
            }else if(rows[0] == null){//不在数据库中
                const http = require('http');

                var url = encodeURI('http://api.map.baidu.com/geocoder/v2/?address='+address+'&output=json&ak=oA4b8SDipmRn0j7FR57feU382NA6zGVQ&city='+city);
                http.get(url, function (response) {
                    var body = [];

                    response.on('data', function (chunk) {
                        body.push(chunk);
                    })

                    response.on('end', function () {
                        body = Buffer.concat(body);
                        var jsonData = JSON.parse(body);
                        //console.log(jsonData);
                        if(jsonData.status === 0){//错误码正常时返回
                            var connectionInsert=DB.Connect();
                            var sqlInsert = 'Insert Into place_info(place_name,place_city,place_lat,place_lng) VALUES(?,?,?,?)';
                            var sqlInsert_Params = [address,city,jsonData.result.location.lat,jsonData.result.location.lng];
                            connectionInsert.query(sqlInsert,sqlInsert_Params,function(err,result){
                                if(err){
                                    console.log("sqlInsert Error:"+err.message);
                                    return;
                                }
                            })
                            DB.Disconnect(connectionInsert);
                            callback(null,[address,jsonData.result.location.lng,jsonData.result.location.lat]);
                        }
                        else{
                            jsonRes["status"] = jsonData.status;
                            //console.log(jsonRes);
                            //return jsonRes;
                            return;
                        }           
                    })
                }).on('error',function(e){
                    console.log("Got Error:"+e.message);
                })
            }
            else{//在数据库中
                callback(null,[address,parseFloat(rows[0]["place_lng"]),parseFloat(rows[0]["place_lat"]) ]);
            }
        })
        DB.Disconnect(connection);
    }

    function Distance(lat1,lng1,lat2,lng2){
        var EARTH_RADIUS = 6378137.0;
        var PI = Math.PI;
        function getRad(d){
            return d*PI/180.0;
        };
        var f = getRad((lat1 + lat2)/2);
        var g = getRad((lat1 - lat2)/2);
        var l = getRad((lng1 - lng2)/2);
        var sg = Math.sin(g);
        var sl = Math.sin(l);
        var sf = Math.sin(f);
        var s,c,w,r,d,h1,h2;
        var a = EARTH_RADIUS;
        var fl = 1/298.257;
        sg = sg*sg;
        sl = sl*sl;
        sf = sf*sf;
        s = sg*(1-sl) + (1-sf)*sl;
        c = (1-sg)*(1-sl) + sf*sl; 
        w = Math.atan(Math.sqrt(s/c));
        r = Math.sqrt(s*c)/w;
        d = 2*w*a;
        h1 = (3*r -1)/2/c;
        h2 = (3*r +1)/2/s;
        return ( d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg)) / 1000 );//单位为km
    }
}
module.exports={
    generateRoute:generateRoute
}


