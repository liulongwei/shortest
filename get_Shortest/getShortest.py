# -*- coding:utf-8 -*-

#Author:刘龙威-SSE-USTC
#最后修改时间：2016年12月15日20:34:21
#待完善1：传递参数的格式应为python name.py 起始地纬度 起始地经度 城市名 目的地1名称 目的地2名称 目的地3名称...
#       当前参数格式为python name.py 城市名 起始地名 目的地1名称 目的地2名称 目的地3名称...
#待完善2：获得目的地名称后先从数据库中查询有无经纬度信息，若无再去请求百度地图API，因为百度地图API有每日查询配额和并发数限制
#待完善3：用户若需要返回起点?
#待完善4：加入更多的异常处理
#程序的思想:当目的地个数小于等于8时采用遍历方法获取最优解(遍历的复杂度为n的阶乘)，当目的地个数大于8时采用贪心算法获得近似解

import sys
import urllib
import urllib2
import json
import math
from math import*
import itertools

name = []#地点名称
lat = []#纬度
lng = []#经度
place_num = len(sys.argv)-1#用户输入的地点个数，第一个参数为城市名，减一
lists = [[] for i in range(place_num - 1)]#存放所有地点之间的路程N*N矩阵
ans = []#存放排列结果下标
ans_greedy = []#存放贪心算法下排列结果下标
a = []#存放123···到地点总数
b = []#存放排序后地点名称

d1 = dict()#定义字典，方便最后封装为json格式
d1['status'] = 0#正常返回则状态码为0
d1['msg'] = ''#存放错误信息，正常为空
d1['result'] = ''#存放排序结果-地点名称,错误为空
d1['total_len'] = ''#存放最短路程,错误为空
d1['solve_way'] = ''#存放解决方式，贪心为0,遍历为1

count = 0#用于终止Greedy中的递归
M = 9999#表示两点间无连接，只用于某个地点和它自己距离的标识

def Distance(Lat_A,Lng_A,Lat_B,Lng_B): #根据两点经纬度返回两点之间直线距离
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

def get_lat_lng():#获得地点的名称，纬度，经度，下标从0开始，减一
    for i in range(0,place_num-1):
        name.append(sys.argv[i+2])
        html = urllib2.urlopen(r'http://api.map.baidu.com/geocoder/v2/?address=' + name[i] + '&output=json&ak=oA4b8SDipmRn0j7FR57feU382NA6zGVQ&city=' + sys.argv[1])#sys.argv[1]为城市名
        hjson = json.loads(html.read())
        if hjson['status'] != 0:#如果错误，构造JSON返回并退出
            d1['status'] = hjson['status']
            d1['msg'] = hjson['msg']
            json_str = json.dumps(d1)
            print json_str
            sys.exit(1)
        else:
            lat.append(hjson['result']['location']['lat'])
            lng.append(hjson['result']['location']['lng'])
            #print name[i]
            #print lat[i]
            #print lng[i]

def initial_lists():#构造所有地点之间的路程N*N矩阵
    for i in range(0,place_num-1):
        for j in range(0,place_num-1):
            if i == j:
                lists[i].append(M)
            else:
                lists[i].append( Distance(lat[i], lng[i], lat[j], lng[j]) )
        '''
        for i in range(0,place_num-1):#输出所有地点之间的路程N*N矩阵
            for j in range(0,place_num-1):
                if(j % place_num == 0):
                    print
                print lists[i][j],
        '''

def go_through():#遍历方法解决最短路径问题
    global ans
    for i in range(1,place_num - 1):
        a.append(i)
    temp = 9999
    for i in itertools.permutations(a,place_num - 2):
        min = lists[0][ i[0] ]
        for j in range(0,place_num - 3):
            min += lists[ i[j] ][ i[j+1] ]
        if min < temp:
            temp = min
            ans = i
    print "总路程:" + str(temp) + "km"
    for i in range(0, place_num - 2):
        b.append( name[ ans[i] ] )
    for i in range(0, place_num - 2):
        print name[ans[i]]
    #d1['result'] = b
    #d1['total_len'] = str(temp) + "km"
    #d1['solve_way'] = "go_through"

def greedy(x):#贪心算法解决最优问题
    next = 0#用于记录下一个选择的下标
    global count
    min = M
    for i in range(0,place_num-1):
        if lists[x][i] < min:
            next = i
            min = lists[x][i]
    for i in range(0, place_num - 1):
        lists[i][x] = M#置已选择的对应列为M，则下次不会再选择
    ans_greedy.append(next)
    count += 1
    if count < place_num-2:#下标从0开始，减一，最后一个选择自动确定，减一
        greedy(next)

def main():
    global ans
    get_lat_lng()
    initial_lists()
    if place_num <= 10:
        go_through()
        print "go_through"
    else:
        greedy(0)
        lists1 = [[] for i in range(place_num - 1)]
        for i in range(0,place_num-1):
            for j in range(0,place_num-1):
                if i == j:
                    lists1[i].append(M)
                else:
                    lists1[i].append( Distance(lat[i], lng[i], lat[j], lng[j]) )
        length = lists1[0][ans_greedy[0]]
        for i in range(0, place_num - 3):
            length += lists1[ans_greedy[i]][ans_greedy[i+1]]
        print "总路程:" + str(length) + "km"
        for i in range(0,place_num-2):
            print name[ans_greedy [i]]
            #print ans_greedy[i]
        print "greedy"
    '''
        #d1['result'] = b
        #d1['total_len'] = str(length) + "km"
        #d1['solve_way'] = "greedy"
    json_str = json.dumps(d1)
    print json_str.decode()
    '''
if __name__ == '__main__':
    main()





