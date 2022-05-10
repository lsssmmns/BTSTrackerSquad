// Global variables
let map;
let lat = 30;
let lon = 25;
let zl = 2;
let max_cap = 92100;

// map of the soul tour data
let path_MotS = "https://raw.githubusercontent.com/lsssmmns/BTSTrackerSquad/main/data/MapofTheSoul.xlsx.csv";
let markers_MotS = L.featureGroup();
let tour_MotS;
let im_MotS = "https://raw.githubusercontent.com/lsssmmns/BTSTrackerSquad/main/photos/MotS.jpg";
// wings tour data
let path_W = "https://raw.githubusercontent.com/lsssmmns/BTSTrackerSquad/main/data/Wings.csv";
let markers_W = L.featureGroup();
let tour_W;
let im_W = "https://raw.githubusercontent.com/lsssmmns/BTSTrackerSquad/main/photos/W.jpg";
// wake up tour data
let path_WU = "https://raw.githubusercontent.com/lsssmmns/BTSTrackerSquad/main/data/WakeUp.xlsx.csv";
let markers_WU = L.featureGroup();
let tour_WU;
let im_WU = "https://raw.githubusercontent.com/lsssmmns/BTSTrackerSquad/main/photos/wu.jpg";
// red bullet tour data
let path_RB = "https://raw.githubusercontent.com/lsssmmns/BTSTrackerSquad/main/data/RedBulletTour.xlsx.csv";
let markers_RB = L.featureGroup();
let tour_RB;
let im_RB = "https://raw.githubusercontent.com/lsssmmns/BTSTrackerSquad/main/photos/rb.jpg";


// initialize
$( document ).ready(function() {
	createMap(lat,lon,zl);
	// purple
    tour_MotS = readCSV(path_MotS,markers_MotS, '#876cac', tour_MotS,"Map of the Soul", im_MotS);
    // blue 
    tour_W = readCSV(path_W,markers_W, '#1a2a62', tour_W, "Wings", im_W);
    // yellow
    tour_WU = readCSV(path_WU,markers_WU, '#e19a0c', tour_WU, "Wake Up: Open Your Eyes", im_WU);
	// red
	tour_RB = readCSV(path_RB, markers_RB, '#cd4d5e', tour_RB, "The Red Bullet", im_RB);
    let layers = {
        "Map of the Soul 2020" : markers_MotS,
		"Wings 2017" : markers_W,
        "Wake Up: Open Your Eyes 2015" : markers_WU,
        "The Red Bullet 2014" : markers_RB
    }

    L.control.layers(null,layers).addTo(map)
});

// create the map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
}

// function to read csv data
function readCSV(path, markers, tour_color, dataset, tour_name, pic){
	Papa.parse(path, {
		header: true,
		download: true,
		complete: function(data) {
			console.log(data);
            dataset = data;
            console.log(dataset);
            mapCSV(markers, tour_color, data, tour_name, pic);
		}
	});
}

function mapCSV(markers, tour_color, data, tour_name, pic){

	// // circle options
	// let circleOptions = {
	// 	radius: 5,
	// 	weight: 1,
	// 	color: 'white',
	// 	fillColor: tour_color,
	// 	fillOpacity: 0.9
	// }
	// loop through each entry
	data.data.forEach(function(item,index){
		console.log(item.capacity)
		// circle options
		let circleOptions = {
			radius: 100*item.capacity/max_cap,
			weight: 1,
			color: 'white',
			fillColor: tour_color,
			fillOpacity: 0.7
		}
        console.log(item);
		// create a marker
		let show = L.circleMarker([item.latitude,item.longitude],circleOptions);
        // diff message if only one day vs multiday
        if(item.end != ""){
            show = show.on('mouseover',function(){
			    this.bindPopup(`<div id="pop"><p id="event" style="color:${tour_color};">${tour_name}</p><img id=im src="${pic}"><p><b>BTS performed at the ${item.venue} in ${item.city} from ${item.start} to ${item.end}</b></p></div>`).openPopup()
            });
		}else{
            show = show.on('mouseover',function(){
			    this.bindPopup(`<div id="pop"><p id="event" style="color:${tour_color};">${tour_name}</p><img id=im src="${pic}"><p><b>BTS performed at the ${item.venue} in ${item.city} on ${item.start}</b></p></div>`).openPopup()
            });
        };

		// add marker to featuregroup
		markers.addLayer(show)

    })

	// add featuregroup to map
	markers.addTo(map)

}