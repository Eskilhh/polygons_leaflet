#!flask/bin/python

import sys
import geojson
import json
from shapely.geometry import Polygon as Pol
from shapely.ops import cascaded_union
from geojson import Polygon, Feature, FeatureCollection, dump
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Check if input polygon is valid. Returns True if valid polygon and vice versa.
def isValid(coordinates):
	if len(coordinates) < 4:
		print("Invalid coordinates! Polygon must have 4 or more points. Input polygon only has ", len(coordinates))
		return False

	if coordinates[0] != coordinates[-1]:
		print("Invalid coordinates! Polygon not closed.")
		return False
	return True

# Reads, from file, adds new polygons and deletes duplicates. Returns the same as is written to file.
def writeGeojson(polygons):
	existing_features = readGeojson(init=False)
	new_features = []
	exists = False
	for polygon in polygons:
		for existing_feature in existing_features:
			if polygon == existing_feature:
				existing_features.remove(existing_feature)	
				exists = True
		if not exists:
			new_features.append(Feature(geometry=Polygon(polygon)))
		exists = False

	for existing_feature in existing_features:
		new_features.append(Feature(geometry=Polygon(existing_feature)))
	feature_collection = FeatureCollection(new_features)

	with open('polygons.geojson', 'w') as f:
   		dump(feature_collection, f)
   	return feature_collection

# Read from file and return polygon coordinates
def readGeojson(init):
	with open('polygons.geojson') as f:
	    data = json.load(f)
	coordinates = []
	for feature in data['features']:
		if (feature['geometry']['type'] == 'Polygon'):
			coordinates.append(feature['geometry']['coordinates'])
	
	if not init:
		return coordinates

	for polygon in coordinates:
		if not isValid(polygon[0]):
			return False
	return data

# Returns a shapely polygon object
def createShapelyPolygon(polygon):
	polypoints = []
	for points in polygon[0]:
		polypoints.append([points[0],points[1]])
	return Pol(polypoints)

# Returns True if polygons share area, false if not. Shapely objects as input
def checkSharedArea(polygon_1, polygon_2):
	return polygon_1.intersects(polygon_2)

# Returns union between two polygons if any and replaces the selected polygons
def union(polygon_1, polygon_2):
	polygon1 = createShapelyPolygon(polygon_1)
	polygon2 = createShapelyPolygon(polygon_2)
	
	if not checkSharedArea(polygon1, polygon2):
		return False

	polygons = [polygon1, polygon2]
	union = cascaded_union(polygons)
	return [list(union.exterior.coords)]

# Returns intersection between two polygons if any and replaces the selected polygons
def intersection(polygon_1, polygon_2):
	polygon1 = createShapelyPolygon(polygon_1)
	polygon2 = createShapelyPolygon(polygon_2)
	
	if not checkSharedArea(polygon1, polygon2):
		return False

	intersection = polygon1.intersection(polygon2)
	return [list(intersection.exterior.coords)]

# Initialize backend API
@app.route('/boolop', methods=['GET','POST'])
@cross_origin()
def boolean_operation():
	data = { "result" : "Nothing happened" }
	polygon_union = None
	polygon_intersect = None
	jsonData = request.get_json(force=True)

	# Check if initialization, if successful, return featurecollection
	if (jsonData['operation'] == 'init'):
		readGeojsonResult = readGeojson(init=True)
		if readGeojsonResult == False:
			return jsonify({ "result" : "Could not initialize" })
		else:
			return jsonify(readGeojsonResult)

	# Check if polygons are valid, if not valid, return invalid coordinate
	if not isValid(jsonData['polygon_1'][0]):
		return jsonify({ "result" : "Invalid polygon" })

	if not isValid(jsonData['polygon_2'][0]):
		return jsonify({ "result" : "Invalid polygon" })

	# Check if union exists, sets data to union coordinates
	if (jsonData['operation'] == 'union'):
		polygon_union = union(jsonData['polygon_1'], jsonData['polygon_2'])
		if not polygon_union:
			return jsonify({ "result" : "No union exists" })
		data = writeGeojson([jsonData['polygon_1'], jsonData['polygon_2'], polygon_union])
	
	# Check if intersect exists, sets data to intersect coordinates
	elif(jsonData['operation'] == 'intersect'):
		polygon_intersect = intersection(jsonData['polygon_1'], jsonData['polygon_2'])
		if not polygon_intersect:
			return jsonify({ "result" : "No intersection exists" })
		data = writeGeojson([jsonData['polygon_1'], jsonData['polygon_2'], polygon_intersect])

	return jsonify(data)

if __name__ == '__main__':
    app.run()