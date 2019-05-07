var stylelayer = {
    defecto: {
        color: "red",
        opacity: 1,
        fillcolor: "red",
        fillOpacity: 0.1,
        weight: 0.5
    },
    highlight: {
        weight: 5,
        color: '#0D8BE7',
        dashArray: '',
        fillOpacity: 0.7
    }
}

var mymap = L.map('mapid', {
    contextmenu: true,
    contextmenuWidth: 140,
    contextmenuItems: [{
        text: 'Union',
        callback: union
    }, {
        text: 'Intersect',
        callback: intersect
    }]
}).setView([51.505, -0.09], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNp'+
            'ejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		         '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		         'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	id:          'mapbox.streets'
}).addTo(mymap);