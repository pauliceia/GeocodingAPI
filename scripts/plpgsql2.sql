CREATE OR REPLACE FUNCTION update_geometry(input_p integer) 
    RETURNS text
AS
$BODY$
DECLARE 
    street_id Integer := (SELECT street.id FROM tb_places AS places INNER JOIN tb_street AS street ON places.id_street = street.id WHERE places.number = input_p);
BEGIN 
END;
$BODY$
LANGUAGE plpgsql;