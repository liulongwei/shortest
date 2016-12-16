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
