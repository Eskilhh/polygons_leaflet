
function createMessage(op){
	if (op == "init"){
		var message = {
			"operation": "init"
		};
	}else if((op == "intersect")||(op == "union")){
		if(featuresSelected.length != 2){
			console.log("Intersect operation needs exactly 2 selected polygons, ",featuresSelected.length," polygon(s) selected")
			return false
		}
		var polygon_1 = featuresSelected[0].feature.geometry.coordinates
		var polygon_2 = featuresSelected[1].feature.geometry.coordinates

		var message = {
			"polygon_1": polygon_1,
			"polygon_2": polygon_2,
			"operation": op
		};
	}
	return message
}

function init(){
	sendOrder(createMessage("init"))
}

function intersect(){
	message = createMessage("intersect")
	if (message){
		sendOrder(message)
	}
}

function union(){
	message = createMessage("union")
	if (message){
		sendOrder(message)
	}
}

initialize = true
function sendOrder(message){
	const url = 'http://localhost:5000/boolop'
	data = JSON.stringify(message)

	var request = new Request(url, {
		method: 'POST',
		body: data
	});

	fetch(request)
	.then(function(response) {
    	return response.json()
  	}).then(function(json) {
  		if (json.result == "Invalid polygon"){
  			console.log(json.result)
  		}else if (json.result == "Could not initialize") {
			console.log(json.result)
		}else if (json.result == "Nothing happened") {
			console.log(json.result)
		}else if (json.result == "No union exists") {
			console.log(json.result)
		}else if (json.result == "No intersection exists") {
			console.log(json.result)
		}else if (json.type == "FeatureCollection") {
			updatePolygons(initialize, json)
			initialize = false
		}
		return json;
	});
}

init()