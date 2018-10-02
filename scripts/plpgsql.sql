--(a) Corrigir as coordenadas (x,y) de todos os places que estão
--no sistema métrico. Exemplo: o place de número 200 deve estar a
--200 metros do início da rua.

--------------------------------------------------

CREATE OR REPLACE FUNCTION saboya_geometry(inputPlaceId integer) 
	RETURNS text
AS
$BODY$
DECLARE 
	streetId Integer;
	zeroGeom text;
	streetGeom text;
	numberPlace Integer;
	oldGeomPlace text;
	streetSize Float;
	startPoint text;
	newGeom text;
	newStreetGeom text;
BEGIN
	streetId := (SELECT street.id FROM places_pilot_area AS places INNER JOIN streets_pilot_area AS street ON places.id_street = street.id WHERE places.id = inputPlaceId);
	zeroGeom := (SELECT places.geom FROM places_pilot_area AS places INNER JOIN streets_pilot_area AS street ON places.id_street = street.id WHERE places.number = 0 AND street.id = streetId);
	streetGeom := (SELECT  ST_LineMerge(geom) FROM streets_pilot_area WHERE id = streetId);
	numberPlace := (SELECT number FROM  places_pilot_area WHERE id = inputPlaceId);
	oldGeomPlace := (SELECT geom FROM  places_pilot_area WHERE id = inputPlaceId);
	streetSize := (SELECT ST_Length(ST_Transform(geom, 29100)) FROM streets_pilot_area where id = streetId);
	startPoint := (SELECT  ST_StartPoint(ST_LineMerge(geom)) FROM streets_pilot_area WHERE id = streetId);
	IF zeroGeom = startPoint THEN
		newGeom := (SELECT ST_LineInterpolatePoint(streetGeom, numberPlace/streetSize));
	ELSE
		newStreetGeom := (SELECT  ST_Reverse(ST_LineMerge(geom)) FROM streets_pilot_area WHERE id = streetId);
		newGeom := (SELECT ST_LineInterpolatePoint(newStreetGeom, numberPlace/streetSize));
	END IF;
	IF newGeom IS NOT NULL THEN
		RETURN st_astext(newGeom);
	ELSE
		RETURN st_astext(oldGeomPlace);
	END IF;
END;
$BODY$
LANGUAGE plpgsql;

--------------------------------------------------

CREATE OR REPLACE FUNCTION updateSaboya() 
  RETURNS VOID 
AS $$
DECLARE 
   t_curs cursor for 
      SELECT * FROM places_pilot_area WHERE first_year > 1931;
   t_row places_pilot_area%rowtype;
BEGIN
    FOR t_row IN t_curs LOOP
        UPDATE places_pilot_area
            SET geom = (SELECT ST_SetSRID(saboya_geometry(id), 4326))
        WHERE current of t_curs;
    END LOOP;
END;
$$ 
LANGUAGE plpgsql;

--(b) Corrigir as coordenadas (x,y) de todos os places que não estão
--no sistema métrico e que estão na mesma localização dos places
--do item (a), levando em consideração números ímpares e pares
--nas mesmas localizações

CREATE OR REPLACE FUNCTION updateGeometry(streetName text, numberBefore integer, numberAfter integer) 
	RETURNS text
AS
$BODY$
DECLARE 
	streetId integer;
	beforeId integer;
	afterId integer;
	afterGeom text;
BEGIN
	streetId := (SELECT id::integer FROM streets_pilot_area WHERE name LIKE streetName);
	beforeId := (SELECT places.id::integer FROM places_pilot_area AS places INNER JOIN streets_pilot_area AS street ON places.id_street::integer = street.id::integer WHERE places.id::integer = numberBefore::integer AND street.id::integer = streetId);
	afterId := (SELECT places.id::integer FROM places_pilot_area AS places INNER JOIN streets_pilot_area AS street ON places.id_street::integer = street.id::integer WHERE places.id::integer = numberBefore::integer AND street.id::integer = streetId);
	afterGeom := (SELECT geom FROM places_pilot_area WHERE id::integer = afterId::integer);
	RETURN afterGeom;
END;
$BODY$
LANGUAGE plpgsql;

--------------------------------------------------

SELECT updateGeometry("rua guarany", 3, 14);

--------------------------------------------------
