

SELECT ST_AsText(wkb_geometry), ST_AsEWKT(wkb_geometry)
FROM (
  SELECT ''::geometry AS wkb_geometry
) AS f;


CREATE TABLE area_localities(
id SERIAL PRIMARY KEY,
polygon_area geometry,
polygon_coords jsonb,
area_name text,
sub_area_name text,
is_popular boolean DEFAULT false,
city_name text
);

create index area_localities_city_name_area_name_idx on area_localities (city_name,area_name);
 
CREATE INDEX idx_area_localities_polygon_area_intersection ON area_localities USING gist (ST_SetSRID(polygon_area::geometry, 4326));