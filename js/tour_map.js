// Global variables
let map;
let lat = 30;
let lon = 25;
let zl = 2;
// path to csv data
let path = "data/btsWikiAwardShows.csv";
let shows = L.featureGroup();

// initialize
$( document ).ready(function() {
	createMap(lat,lon,zl);
	readCSV(path);
});

// create the map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
}

// function to read csv data
function readCSV(path){
	Papa.parse(path, {
		header: true,
		download: true,
		complete: function(data) {
			console.log(data);
			
			// map the data
			mapCSV(data);

		}
	});
}

function mapCSV(data){

	// circle options
	let circleOptions = {
		radius: 3,
		weight: 1,
		color: 'white',
		fillColor: 'rgb(230, 110, 155)',
		fillOpacity: 0.9
	}

	// loop through each entry
	data.data.forEach(function(item,index){
		// create a marker
		let show = L.circleMarker([item.Lat,item.Lon],circleOptions)
		.on('mouseover',function(){
			this.bindPopup(`<div id="pop"><p id="event">${item.Event}</p><p><b>BTS performed at the ${item.Venue} on ${item.Date}</b></p></div>`).openPopup()
		})

		// add marker to featuregroup
		shows.addLayer(show)

    })

	// add featuregroup to map
	shows.addTo(map)

}
