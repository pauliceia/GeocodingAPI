import psycopg2

con = psycopg2.connect(host="localhost",database="db_pauliceia", user="postgres", password="teste")

cur = con.cursor()

file1 = open('success.txt','w')  
file2 = open('error.txt','w')  
listids =  open('listids.txt').read().splitlines()

for i in listids:
	values = [75,77,79,82,83,85,144,182,188,189,192,194,264,273,312,387,629,634,699,706,708,709,710,712,714,716,718,721,722,1600,782,783,785,787,788,790,830,975,1045,1058,1134,1253,1277,1282,1288,1306,1311,1315,1319,1320,1379,1384,1386,1387,1453,1455,1460,1462,1531,1536,1551,1562,1588,1618,1634,1635,1656,1758,1764,1766,1768,1800,1802,1865,1868,1870,1923,1957,2019,2093,2095,2097,2100,2150,2152,2154,2157,2158,2160]
	if int(i) in values:
		print(str(i)+' - Erro')
		sql = 'SELECT street.name, places.number::integer, places.first_year::integer FROM places_pilot_area AS places INNER JOIN streets_pilot_area AS street ON places.id_street = street.id WHERE places.id = '+str(i)+';'
		cur.execute(sql)
		recset = cur.fetchall()
		file2.write(str(recset)+'\n')
	else:
		sql = 'SELECT saboya_geometry('+str(i)+') AS saboya_geometry, st_astext(geom) AS old_geometry FROM places_pilot_area WHERE id = '+str(i)+';'
		print(str(i)+' - Success')
		cur.execute(sql)
		recset = cur.fetchall()
		file1.write(str(recset)+'\n')

con.close()