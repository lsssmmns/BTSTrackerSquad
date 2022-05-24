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
let breaks = [0,0,5,15,25,35,45];

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
		mapGeoJSON(2015)
	})
}

// function to map a geojson file
function mapGeoJSON(year){

	// clear layers in case it has been mapped already
	if (geojson_layer){
		geojson_layer.clearLayers()
	}

	var datasets = [
		'num_songs_2015', 'num_songs_2016', 'num_songs_2017', 'num_songs_2018', 'num_songs_2019', 'num_songs_2020', 'num_songs_2021', 'num_songs_2022'
	];
	console.log(year-2015);

	var field = datasets[year-2015];
	
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
	brew.setNumClasses(6);
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

	
	// add playlist
	openPlaylist(year);
}

// style each feature
function getStyle(feature){
	return {
		stroke: true,
		color: 'white',
		weight: 1,
		fill: true,
		fillColor: getColor(feature.properties[fieldtomap]),
		fillOpacity: 0.8
	}
}

// return the color for each feature based on population count
function getColor(d) {

	return d > breaks[5]  ? 'rgb(84,39,143)' :
		   d > breaks[4]  ? 'rgb(117,107,177)' :
		   d > breaks[3]   ? 'rgb(158,154,200)' :
		   d > breaks[2]   ? 'rgb(188,189,220)' :
		   d > breaks[1]   ? 'rgb(218,218,235)' :
					  'rgb(242,240,247)';
}

// good rainbow for colorblindness
// function getColor(d) {

// 	return d > breaks[5]  ? '#A5185D' :
// 		   d > breaks[4]  ? '#FE6100' :
// 		   d > breaks[3]  ? '#FFB000' :
// 		   d > breaks[2]  ? '#6CC172' :
// 		   d > breaks[1]  ? '#648FFF' :
// 					  '#876CAC';
// }

function createLegend(){
	legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend'),
		labels = [],
		from, to;
		console.log(breaks);
		
		for (var i = 0; i < breaks.length - 1; i++) {
			from = breaks[i];
			to = breaks[i + 1];
			let fromplus = parseInt(from)+1;
			if(from != to) {
				labels.push(
					'<i style="background:' + getColor(to) + '"></i> ' +
					fromplus.toFixed(2) + ' &ndash; ' + to.toFixed(2));
					// from.toFixed(2) + ' &ndash; ' + to.toFixed(2));
			} 
			else {
				labels.push(
					'<i style="background:' + getColor(to) + '"></i> ' +
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

$(".slider").ionRangeSlider({
	type: "single",
	skin: "flat",
	grid: true,
	max: 2022,
	min: 2015,
	step: 1,
	from: 2015,
	values: [
		2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022
	],
});

$(".slider").on("change", function () {
	var $inp = $(this);
	var year = $inp.prop("value"); // reading input year
	mapGeoJSON(year);
	}
);

// add year playlist to screen
function openPlaylist(Year) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
	  tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
	  tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(Year).style.display = "block";
	// e.currentTarget.className += " active";
}