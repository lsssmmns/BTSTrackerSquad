// Global variables
let map;
let lat = 30;
let lon = 25;
let zl = 2;

// red bullet tour data
let path_RB = "https://raw.githubusercontent.com/lsssmmns/BTSTrackerSquad/main/data/RedBulletTour.xlsx.csv";
let markers_RB = L.featureGroup();
let tour_RB;
// wake up tour data
let path_WU = "https://raw.githubusercontent.com/lsssmmns/BTSTrackerSquad/main/data/WakeUp.xlsx.csv";
let markers_WU = L.featureGroup();
let tour_WU;
// map of the soul tour data
let path_MotS = "https://raw.githubusercontent.com/lsssmmns/BTSTrackerSquad/main/data/MapofTheSoul.xlsx.csv";
let markers_MotS = L.featureGroup();
let tour_MotS;


// initialize
$( document ).ready(function() {
	createMap(lat,lon,zl);
    // red
	tour_RB = readCSV(path_RB, markers_RB, '#e42120', tour_RB);
    // purple
    tour_WU = readCSV(path_WU,markers_WU, '#696ec9', tour_WU);
    // blue
    tour_MotS = readCSV(path_MotS,markers_MotS, '#0458b4', tour_MotS);
});

// create the map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
}

// function to read csv data
function readCSV(path, markers, tour_color, dataset){
	Papa.parse(path, {
		header: true,
		download: true,
		complete: function(data) {
			console.log(data);
            dataset = data;
            console.log(dataset);
            mapCSV(markers, tour_color, data);
		}
	});
}

function mapCSV(markers, tour_color, data){

	// circle options
	let circleOptions = {
		radius: 3,
		weight: 1,
		color: 'white',
		fillColor: tour_color,
		fillOpacity: 0.9
	}

	// loop through each entry
	data.data.forEach(function(item,index){
        console.log(item);
		// create a marker
		let show = L.circleMarker([item.latitude,item.longitude],circleOptions);
        // diff message if only one day vs multiday
        if(item.end != undefined){
            show = show.on('mouseover',function(){
			    this.bindPopup(`<div id="pop"><p id="event">${item.tour}</p><p><b>BTS performed at the ${item.venue} in ${item.city} from ${item.start} to ${item.end}</b></p></div>`).openPopup()
            });
		}else{
            show = show.on('mouseover',function(){
			    this.bindPopup(`<div id="pop"><p id="event" style="color:${tour_color};">${item.tour}</p><p><b>BTS performed at the ${item.venue} in ${item.city} on ${item.start}</b></p></div>`).openPopup()
            });
        };

		// add marker to featuregroup
		markers.addLayer(show)

    })

	// add featuregroup to map
	markers.addTo(map)

}
