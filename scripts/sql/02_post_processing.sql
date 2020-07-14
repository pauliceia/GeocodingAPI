ALTER TABLE public.places_pilot_area_test ADD COLUMN geom geometry(Point, 4326);

UPDATE public.places_pilot_area_test SET geom = ST_SetSRID(cordinate, 4326);

ALTER TABLE public.places_pilot_area_test DROP COLUMN cordinate;

ALTER TABLE public.places_pilot_area_test ALTER COLUMN index TYPE integer;

ALTER TABLE public.places_pilot_area_test ALTER COLUMN id_street TYPE integer;

ALTER TABLE public.places_pilot_area_test ALTER COLUMN number TYPE float USING number::double precision;

ALTER TABLE public.places_pilot_area_test ALTER COLUMN original_n TYPE VARCHAR(255);

ALTER TABLE public.places_pilot_area_test ALTER COLUMN source TYPE VARCHAR(255);

ALTER TABLE public.places_pilot_area_test ALTER COLUMN author TYPE VARCHAR(255);

ALTER TABLE public.places_pilot_area_test ALTER COLUMN date TYPE VARCHAR(255);

ALTER TABLE public.places_pilot_area_test ALTER COLUMN first_day TYPE integer USING first_day::integer;

ALTER TABLE public.places_pilot_area_test ALTER COLUMN first_month TYPE integer USING first_month::integer;

ALTER TABLE public.places_pilot_area_test ALTER COLUMN first_year TYPE integer USING first_year::integer;

ALTER TABLE public.places_pilot_area_test ALTER COLUMN last_day TYPE integer USING last_day::integer;

ALTER TABLE public.places_pilot_area_test ALTER COLUMN last_month TYPE integer USING last_month::integer;

ALTER TABLE public.places_pilot_area_test ALTER COLUMN last_year TYPE integer USING last_year::integer;

ALTER TABLE public.places_pilot_area_test ADD CONSTRAINT constraint_fk_id_street FOREIGN KEY (id_street) REFERENCES public.streets_pilot_area (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE public.places_pilot_area_test RENAME index TO id;

ALTER TABLE public.places_pilot_area_test ADD CONSTRAINT places_pkey PRIMARY KEY (id);
