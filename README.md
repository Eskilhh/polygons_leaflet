## Dependencies Python API
 - Shapely
 - flask
 - geojson
 - flask_cors

## Plugins used
-[https://github.com/aratcliffe/Leaflet.contextmenu](example).

  [example]: https://github.com/aratcliffe/Leaflet.contextmenu

## To run

- $python api.py
- Add polygons in geojson format to 'polygons.geojson'. Example input can be copied from 'examplepolygons.geojson'. 'polygons.geojson' will be changed when boolean operations are done. Keep polygons.geojson data on clipboard for reapeated runs.
- Run 'Display_map_with_geojson.html' (Only tested in chrome)

## To use
- Hover over a polygon to highlight it.
- Left click to select polygons.
- When exactly 2 polygons are marked, right click anywhere on the map to get the options to either get and display the union or intersect of the two polygons. If no union or intersect exists, nothing will happen. More or fewer polygons may be selected at once, but the boolean operations will not work. 

## Known bugs
- Read functions in api.python iterates through all features twice. This only affects performance as duplicate features are not written to 'polygons.geojson'
