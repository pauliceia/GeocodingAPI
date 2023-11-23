select a.id                  as places_id,
       b.name                as name_s,
       a.number::float,
        a.first_year::integer as firstyear,
        a.last_year::integer  as lastyear,
        ST_AsText(a.geom)     as geom
from streets_pilot_area as b
         join places_pilot_area2 as a on a.id_street::integer = b.id::integer
where a.number::float > 1
  and b.name IS NOT NULL
order by name_s, a.first_year, a.last_year, a.number;

INSERT INTO streets_pilot_area (name, first_year, last_year, geom)
values ('Pilot Area2', 0, 0, ST_GeomFromText('MULTILINESTRING((3 4,10 50,20 25),(-5 -8,-10 -8,-15 -4))', 4326));