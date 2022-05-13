// Global variables
let map;
let lat = 45;
let lon = 25;
let zl = 2;
let path = '';
// put this in your global variables
let geojsonPath2015 = 'data/20152022.geojson';
let geojson_data;
let geojson_layer;
let brew = new classyBrew();
let legend = L.control({position: 'bottomright'});
let info_panel = L.control();

// initialize
$( document ).ready(function() {
	createMap(lat,lon,zl);
	getGeoJSON();
});

// create the map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
}

// function to get the geojson data
function getGeoJSON(){

	$.getJSON(geojsonPath2015,function(data){
		console.log(data)

		// put the data in a global variable
		geojson_data = data;

		// call the map function
		mapGeoJSON('num_songs_2015')
		// mapGeoJSON('pop_est')
	})
}

// function to map a geojson file
function mapGeoJSON(field){

	// clear layers in case it has been mapped already
	if (geojson_layer){
		geojson_layer.clearLayers()
	}
	
	// globalize the field to map
	fieldtomap = field;

	// create an empty array
	let values = [];

	// based on the provided field, enter each value into the array
	geojson_data.features.forEach(function(item,index){
		let temp = item.properties[field];
		if (temp===undefined){
			item.properties[field] = "0";
		}
		values.push(item.properties[field]);
	})

	console.log(values);

	// set up the "brew" options
	brew.setSeries(values);
	brew.setNumClasses(4);
	brew.setColorCode('Purples');
	brew.classify('equal_interval');

    // create the geojson layer
    geojson_layer = L.geoJson(geojson_data,{
        style: getStyle,
        onEachFeature: onEachFeature // actions on each feature
    }).addTo(map);
    

    // create the legend
	createLegend();

    // create the infopanel
	createInfoPanel();
}

// style each feature
function getStyle(feature){
	return {
		stroke: true,
		color: 'white',
		weight: 1,
		fill: true,
		fillColor: brew.getColorInRange(feature.properties[fieldtomap]),
		fillOpacity: 0.8
	}
}

// return the color for each feature based on population count
// function getColor(d) {

// 	return d > 1000000000 ? '#800026' :
// 		   d > 500000000  ? '#BD0026' :
// 		   d > 200000000  ? '#E31A1C' :
// 		   d > 100000000  ? '#FC4E2A' :
// 		   d > 50000000   ? '#FD8D3C' :
// 		   d > 20000000   ? '#FEB24C' :
// 		   d > 10000000   ? '#FED976' :
// 					  '#FFEDA0';
// }

function createLegend(){
	legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend'),
		breaks = brew.getBreaks(),
		labels = [],
		from, to;
		console.log(breaks);
		
		for (var i = 0; i < breaks.length - 1; i++) {
			from = breaks[i];
			to = breaks[i + 1];
			// let fromplus = parseInt(from)+1;
			if(from != to) {
				labels.push(
					'<i style="background:' + brew.getColorInRange(to) + '"></i> ' +
					from.toFixed(2) + ' &ndash; ' + to.toFixed(2));
					// from.toFixed(2) + ' &ndash; ' + to.toFixed(2));
			} 
			else {
				labels.push(
					'<i style="background:' + brew.getColorInRange(to) + '"></i> ' +
					to.toFixed(2));
					// from.toFixed(2) + ' &ndash; ' + to.toFixed(2));
			}
			}
			
			div.innerHTML = labels.join('<br>');
			return div;
		};
		
		legend.addTo(map);
}

// Function that defines what will happen on user interactions with each feature
function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight
	});
}

// on mouse over, highlight the feature
function highlightFeature(e) {
	var layer = e.target;

	// style to use on mouse over
	layer.setStyle({
		weight: 2,
		color: '#5b4876',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}

    info_panel.update(layer.feature.properties)
}

// on mouse out, reset the style, otherwise, it will remain highlighted
function resetHighlight(e) {
	geojson_layer.resetStyle(e.target);
    info_panel.update() // resets infopanel
}

function createInfoPanel(){

	info_panel.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		this.update();
		return this._div;
	};

	// method that we will use to update the control based on feature properties passed
	info_panel.update = function (properties) {
		// if feature is highlighted
		if(properties){
			this._div.innerHTML = `<b>${properties.name}</b><br>${fieldtomap}: ${properties[fieldtomap]}`;
		}
		// if feature is not highlighted
		else
		{
			this._div.innerHTML = 'Hover over a country';
		}
	};

	info_panel.addTo(map);
}