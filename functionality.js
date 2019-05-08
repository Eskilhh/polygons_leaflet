
var polygons = new Array();

function updatePolygons(first, json){
	if (first != true){
		mymap.removeLayer(geojson)
		polygons = new Array();
		featuresSelected = []
        arrayBounds = []

	}else{
		$.each(json.features, function(index, feature) {
			var name = ''
	    	name = `${feature.geometry.type} ${feature.geometry.coordinates}`
	    	polygons.push(name);
		});
	}
	geojson = L.geoJson(json, {
	style: stylelayer.defecto,
 	onEachFeature: onEachFeature
	}).addTo(mymap);
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: selectFeature
    });
}

function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle(stylelayer.highlight);
    info.update(layer.feature.geometry);
}

function resetHighlight(e) {
    var layer = e.target;
    var feature = e.target.feature;
    if (checkExistsLayers(feature)) {
        setStyleLayer(layer, stylelayer.highlight)
    } else {
        setStyleLayer(layer, stylelayer.defecto)
    }
    info.update(false)
}

var featuresSelected = []
function selectFeature(e) {
    var layer = e.target;
    var feature = e.target.feature;

    if (checkExistsLayers(feature)) {
        removerlayers(feature, setStyleLayer, layer, stylelayer.defecto)
        removeBounds(layer)
    } else{
    	addLayers(feature, setStyleLayer, layer, stylelayer.highlight)
        addBounds(layer)
    }
}

var arrayBounds = [];
function addBounds(layer) {
    arrayBounds.push(layer.getBounds())
}

function removeBounds(layer) {
    arrayBounds = arrayBounds.filter(bounds => bounds != layer.getBounds())
}

function setStyleLayer(layer, styleSelected) {
    layer.setStyle(styleSelected)
}

function removerlayers(feature, callback) {
    featuresSelected = featuresSelected.filter(obj => obj.coordinates != feature.geometry.coordinates)
    callback(arguments[2], arguments[3])
}

function addLayers(feature, callback) {
    featuresSelected.push({
        type: feature.geometry.type,
        coordinates: feature.geometry.coordinates, //Leaflet_ID may be better to use.
        feature: feature
    })
    callback(arguments[2], arguments[3])
}

function checkExistsLayers(feature_0) {
    var result = false
    for (var i = 0; i < featuresSelected.length; i++) {
        if (feature_0.geometry.coordinates == featuresSelected[i].feature.geometry.coordinates) { // Again, leaflet_ID should be used
	            result = true;
	            break;
	    }
    };
    return result
}

/*show info layers*/
var info = L.control({
    position: 'bottomleft'
});

info.onAdd = function(mymap) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function(properties) {
    if (properties == false){
        this._div.innerHTML =

        '<h4>Properties</h4>' + 'Hover over a polygon';        
    }else{
        this._div.innerHTML =

            '<h4>Properties</h4>' + (properties ?
                `	
                	Type:<br>${properties.type}
                    <br><br>
                	Coordinates: <br>
                    ${properties.coordinates[0].join("<br>")}
                    
                        ` : 'Hover over a polygon');
    }
};

info.addTo(mymap);