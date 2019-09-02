
--------------------------------------------------


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
