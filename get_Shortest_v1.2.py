# -*- coding:utf-8 -*-

#Author:刘龙威-USTC-SSE
#最后修改时间：2016年12月18日15:13:36

#本次更新内容：
#1.增加是否返回起点和指定终点两种方式
#2.对于地点先从数据库中查询经纬度，没有再从百度API获取

#待完善1：加入更多的异常处理
#待完善2：贪心的代码本次更新未加入，想想还有没有好的办法
#程序的思想:当目的地个数小于等于8时采用遍历方法获取最优解(遍历的复杂度为n的阶乘)，当目的地个数大于8时采用贪心算法获得近似解
#百度API错误码:http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-geocoding

import sys
import MySQLdb
import urllib2
import json
import math
from math import*
import itertools

name = []#地点名称
lat = []#纬度
lng = []#经度
place_num = len(sys.argv)-5#用户输入的地点个数，，是否返回参数减一,经度纬度减2,城市名减一,文件名减一
lists = [[] for i in range(place_num + 1)]#存放所有地点之间的路程N*N矩阵
ans = []#存放排列结果下标
ans_greedy = []#存放贪心算法下排列结果下标
a = []#存放123···到地点总数
b = []#存放排序后地点名称

d1 = dict()#定义字典，方便最后封装为json格式
d1['status'] = 0#正常返回则状态码为0
d1['msg'] = ''#存放错误信息，正常为空
d1['result'] = ''#存放排序结果-地点名称,错误为空
d1['total_len'] = ''#存放最短路程,错误为空

count = 0#用于终止Greedy中的递归
M = 9999#表示两点间无连接，只用于某个地点和它自己距离的标识

start_lat = float(sys.argv[2])#起点的纬度
start_lng = float(sys.argv[3])#起点的经度

def Distance(Lat_A,Lng_A,Lat_B,Lng_B): #根据两点经纬度返回两点之间直线距离
    try:
        ra=6378.140 #赤道半径
        rb=6356.755 #极半径 （km）
        flatten=(ra-rb)/ra  #地球偏率
        rad_lat_A=radians(Lat_A)
        rad_lng_A=radians(Lng_A)
        rad_lat_B=radians(Lat_B)
        rad_lng_B=radians(Lng_B)
        pA=atan(rb/ra*tan(rad_lat_A))
        pB=atan(rb/ra*tan(rad_lat_B))
        xx=acos(sin(pA)*sin(pB)+cos(pA)*cos(pB)*cos(rad_lng_A-rad_lng_B))
        c1=(sin(xx)-xx)*(sin(pA)+sin(pB))**2/cos(xx/2)**2
        c2=(sin(xx)+xx)*(sin(pA)-sin(pB))**2/sin(xx/2)**2
        dr=flatten/8*(c1-c2)
        distance=ra*(xx+dr)
        return distance
    except ZeroDivisionError:
        d1['status'] = 6  # 自定义错误码
        d1['msg'] = "输入中有重复地点"  # 存放错误信息，正常为空
        json_str = json.dumps(d1)
        print json_str
        sys.exit(1)

def get_lat_lng():#获得地点的名称，纬度，经度，下标从0开始，减一

    # 数据库连接的定义
    host = 'localhost'
    user = 'root'
    passwd = 'liulongwei'
    database = 'test'
    charset = 'utf8'

    name.append("用户起点")
    lat.append(start_lat)#起点的纬度
    lng.append(start_lng)#起点的经度

    for i in range(1,place_num+1):
        name.append(sys.argv[i+4])
        db = MySQLdb.connect(host=host, user=user, passwd=passwd, db=database, charset=charset)
        cur = db.cursor()
        sqlq = "select * from place_info where place_name=%s and place_city=%s"# 执行sql查询语句
        cur.execute(sqlq, (name[i], sys.argv[4]))
        results = cur.fetchall()
        if not results:
            html = urllib2.urlopen(r'http://api.map.baidu.com/geocoder/v2/?address=' + name[i] + '&output=json&ak=oA4b8SDipmRn0j7FR57feU382NA6zGVQ&city=' + sys.argv[4])#sys.argv[4]为城市名
            hjson = json.loads(html.read())
            if hjson['status'] != 0:  # 如果错误，构造JSON返回并退出(这些错误主要是百度API搜索不到该城市中的地点http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-geocoding)
                d1['status'] = hjson['status']
                d1['msg'] = hjson['msg']
                json_str = json.dumps(d1)
                print json_str
                sys.exit(1)
            else:
                lat.append(hjson['result']['location']['lat'])
                lng.append(hjson['result']['location']['lng'])
                sqli = "insert into place_info(place_name, place_city, place_lat, place_lng, place_level) values(%s, %s, %s, %s, %s)"# 执行sql插入语句
                try:
                    # 执行sql语句
                    cur.execute(sqli, (name[i], sys.argv[4], hjson['result']['location']['lat'], hjson['result']['location']['lng'], hjson['result']['level']))
                    # 提交到数据库执行
                    db.commit()
                    #print "success"
                except:
                    # 发生错误时回滚
                    db.rollback()
                    #print "failed"
                # 关闭数据库连接
                db.close()
        else:
            lat.append( float(results[0][3]) )
            lng.append( float(results[0][4]) )
            db.close()

    '''
    for i in range(0, place_num+1):
        print name[i]
        print lat[i]
        print lng[i]
    '''

def initial_lists():#构造所有地点之间的路程N*N矩阵
    for i in range(0,place_num+1):
        for j in range(0,place_num+1):
            if i == j:
                lists[i].append(M)
            else:
                lists[i].append( Distance(lat[i], lng[i], lat[j], lng[j]) )
    '''
    for i in range(0,place_num+1):#输出所有地点之间的路程N*N矩阵
        for j in range(0,place_num+1):
            if(j % (place_num+1) == 0):
                print
            print lists[i][j],
    '''

def go_through_no_return():#遍历方法解决最短路径问题
    global ans
    for i in range(1,place_num+1):
        a.append(i)
    temp = 9999
    for i in itertools.permutations(a,place_num):#遍历所有排列
        min = lists[0][ i[0] ]
        for j in range(0,place_num - 1):#获得该排列的路程长度min
            min += lists[ i[j] ][ i[j+1] ]
        if min < temp:
            temp = min
            ans = i
    #print "总路程:" + str(temp) + "km"
    for i in range(0, place_num):
        b.append( name[ ans[i] ] )
    for i in range(0, place_num):
        print name[ans[i]]
    d1['result'] = b
    d1['total_len'] = str(temp) + "km"

def go_through_return():#遍历方法解决最短路径问题,有返回起点需求
    global ans
    for i in range(1,place_num+1):
        a.append(i)
    temp = 99999
    for i in itertools.permutations(a,place_num):
        min = lists[0][ i[0] ]
        for j in range(0,place_num - 1):
            min += lists[ i[j] ][ i[j+1] ]
        min += lists[i[place_num-1]][0]
        if min < temp:
            temp = min
            ans = i
    #print "总路程:" + str(temp) + "km"
    for i in range(0, place_num):
        b.append( name[ ans[i] ] )
    for i in range(0, place_num):
        print name[ans[i]]
    d1['result'] = b
    d1['total_len'] = str(temp) + "km"

def go_through_special():#遍历方法解决最短路径问题,指定最后一个参数为最后一站
    global ans
    for i in range(1,place_num):
        a.append(i)
    temp = 99999
    for i in itertools.permutations(a,place_num-1):
        min = lists[0][ i[0] ]
        for j in range(0,place_num - 2):
            min += lists[ i[j] ][ i[j+1] ]
        min += lists[i[place_num-2]][place_num]
        if min < temp:
            temp = min
            ans = i
    ans = list(ans)
    ans.append(place_num)
    #print "总路程:" + str(temp) + "km"
    for i in range(0, place_num):
        b.append( name[ ans[i] ] )
    for i in range(0, place_num):
        print name[ans[i]]
    d1['result'] = b
    d1['total_len'] = str(temp) + "km"


def main():
    global ans
    theList = ['0','1','2']
    if sys.argv[1] not in theList:
        d1['status'] = 7  # 自定义错误码
        d1['msg'] = "返回方式参数不在(0,1,2)内"  # 存放错误信息，正常为空
        json_str = json.dumps(d1)
        print json_str
        sys.exit(1)
    else:
        get_lat_lng()
        initial_lists()
        if sys.argv[1] == '0':
            go_through_no_return()
        elif sys.argv[1] == '1':
            go_through_return()
        elif sys.argv[1] == '2':
            go_through_special()
    json_str = json.dumps(d1)
    print json_str

if __name__ == '__main__':
    main()





