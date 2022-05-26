// Global variables
let map;
let lat = 30;
let lon = 25;
let zl = 2;
let max_cap = 92100;
let legend = L.control({position: 'topright'});


// map of the soul tour data
let path_MotS = "https://raw.githubusercontent.com/lsssmmns/BTSTrackerSquad/main/data/MapofTheSoul.xlsx.csv";
let markers_MotS = L.featureGroup();
let tour_MotS;
let im_MotS = "https://raw.githubusercontent.com/lsssmmns/BTSTrackerSquad/main/photos/MotS.jpeg";
// speak yourself tour data
let path_SY = "https://raw.githubusercontent.com/lsssmmns/BTSTrackerSquad/main/data/SY.csv";
let markers_SY = L.featureGroup();
let tour_SY;
let im_SY = "https://raw.githubusercontent.com/lsssmmns/BTSTrackerSquad/main/photos/sy.jpeg";
// love yourself tour data
let path_LY = "https://raw.githubusercontent.com/lsssmmns/BTSTrackerSquad/main/data/LY.csv";
let markers_LY = L.featureGroup();
let tour_LY;
let im_LY = "https://raw.githubusercontent.com/lsssmmns/BTSTrackerSquad/main/photos/ly.jpeg";
// wings tour data
let path_W = "https://raw.githubusercontent.com/lsssmmns/BTSTrackerSquad/main/data/Wings.csv";
let markers_W = L.featureGroup();
let tour_W;
let im_W = "https://raw.githubusercontent.com/lsssmmns/BTSTrackerSquad/main/photos/wings.jpg";
// tmbmil tour data
let path_tmbmil = "https://raw.githubusercontent.com/lsssmmns/BTSTrackerSquad/main/data/TMBMIL.csv";
let markers_tmbmil = L.featureGroup();
let tour_tmbmil;
let im_tmbmil = "https://raw.githubusercontent.com/lsssmmns/BTSTrackerSquad/main/photos/TMBMIL.png";
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
let layers;
// layer names listed 2014 to 2022
let layer_names = ["<span class='legendlabel'><span class='dot' style='background-color: #38517c';></span> Wings 2017</span>","<span class='legendlabel'><span class='dot' style='background-color: #76a9c7';></span> Love Yourself 2018</span>",
"<span class='legendlabel'><span class='dot' style='background-color: #271c4b';></span> Speak Yourself 2019</span>","<span class='legendlabel'><span class='dot' style='background-color: #876cac';></span> Map of the Soul 2020</span>",
]


// initialize
$( document ).ready(function() {
	createMap(lat,lon,zl);
	// light purple
    tour_MotS = readCSV(path_MotS, markers_MotS, '#876cac', tour_MotS,"Map of the Soul", im_MotS);
    // dark purple
    tour_SY = readCSV(path_SY, markers_SY, '#271c4b', tour_SY,"Speak Yourself", im_SY);
    // light blue
    tour_LY = readCSV(path_LY, markers_LY, '#76a9c7', tour_LY,"Love Yourself", im_LY);
    // dark blue 
    tour_W = readCSV(path_W, markers_W, '#38517c', tour_W, "Wings", im_W);
    //pink
	tour_tmbmil = readCSV(path_tmbmil, markers_tmbmil, '#426b7e', tour_tmbmil, "The Most Beautiful Moment in Life", im_tmbmil);
	// yellow
    tour_WU = readCSV(path_WU, markers_WU, '#e19a0c', tour_WU, "Wake Up: Open Your Eyes", im_WU);
	// red
	tour_RB = readCSV(path_RB, markers_RB, '#cd4d5e', tour_RB, "The Red Bullet", im_RB);
    layers = {
        "<span class='legendlabel'><span class='dot' style='background-color: #876cac';></span> Map of the Soul 2020</span>" : markers_MotS,
        "<span class='legendlabel'><span class='dot' style='background-color: #271c4b';></span> Speak Yourself 2019</span>" : markers_SY,
        "<span class='legendlabel'><span class='dot' style='background-color: #76a9c7';></span> Love Yourself 2018</span>" : markers_LY,
		"<span class='legendlabel'><span class='dot' style='background-color: #38517c';></span> Wings 2017</span>" : markers_W,
		"<span class='legendlabel'><span class='dot' style='background-color: #426b7e';></span> The Most Beautiful Moment in Life 2016</span>" : markers_tmbmil,
        "<span class='legendlabel'><span class='dot' style='background-color: #e19a0c';></span> Wake Up: Open Your Eyes 2015</span>" : markers_WU,
        "<span class='legendlabel'><span class='dot' style='background-color: #cd4d5e';></span> The Red Bullet 2014</span>" : markers_RB
    }
	createLegend();

    // L.control.layers(null,layers,{collapsed:false}).addTo(map);
	// markers_SY.clearLayers();
		
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

function createLegend(){
	legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend'),
		labels = ["<span class='legendlabel'><span class='dot' style='background-color: #876cac';></span> Map of the Soul 2020</span>",
        "<span class='legendlabel'><span class='dot' style='background-color: #271c4b';></span> Speak Yourself 2019</span>",
        "<span class='legendlabel'><span class='dot' style='background-color: #76a9c7';></span> Love Yourself 2018</span>",
		"<span class='legendlabel'><span class='dot' style='background-color: #38517c';></span> Wings 2017</span>",
		"<span class='legendlabel'><span class='dot' style='background-color: #426b7e';></span> The Most Beautiful Moment in Life 2016</span>",
        "<span class='legendlabel'><span class='dot' style='background-color: #e19a0c';></span> Wake Up: Open Your Eyes 2015</span>",
        "<span class='legendlabel'><span class='dot' style='background-color: #cd4d5e';></span> The Red Bullet 2014</span>"],
		ids=['mots','sy','ly','w','tmbmil','wu','rb'];
		
		for (var i = 0; i < labels.length; i++) {
			labels[i]=`<label class="container">`+labels[i]+`<input class="checkbox-effect checkbox-effect-2" type='checkbox' id=${ids[i]} value=${ids[i]} name=${ids[i]} onchange="ShowHideMarkers(this)" checked="checked"><span class="checkmark"></span></label>`;	
		}
		div.innerHTML = labels.join('<br>');
		return div;
	};
	
	legend.addTo(map);
}

// toggle markers on/off using legend
function ShowHideMarkers(chkMarker){
	var temp;
	console.log(chkMarker.id);
	switch(chkMarker.id){
		case 'mots':
			console.log('mots');
			temp = markers_MotS;
			break;
		case 'sy':
			console.log('sy');
			temp = markers_SY;
			break;
		case 'ly':
			console.log('ly');
			temp = markers_LY;
			break;
		case 'w':
			console.log('w');
			temp = markers_W;
			break;
		case 'tmbmil':
			console.log('tmbmil');
			temp = markers_tmbmil;
			break;
		case 'wu':
			console.log('wu');
			temp = markers_WU;
			break;
		case 'rb':
			console.log('tmbmil');
			temp = markers_RB;
			break;
	}
	
	if(chkMarker.checked === true){
		console.log("active");
		temp.addTo(map);
	}else{
		console.log("inactive");
		temp.removeFrom(map);
	}
}

// slider
$(".slider").ionRangeSlider({
	type: "single",
	skin: "flat",
	grid: true,
	max: 2020,
	min: 2014,
	from: 2014,
	step: 1,
	grid_num: 8,
	grid_snap: true,
	decorate_both: false,
	// values: [
		// 2014, 2015, 2016, 2017, 2018, 2019, 2020
	// ],
});

$(".slider").on("change", function () {
	var $inp = $(this);
	var year = $inp.prop("value"); // reading input year
	var id = 2020-year;
	console.log(id===0);
	// unclick all the tours
	document.querySelectorAll('input[type="checkbox"]').forEach(e => e.checked = false);
	const markers = [markers_MotS, markers_SY, markers_LY, markers_W, markers_tmbmil, markers_WU, markers_RB];
	markers.forEach(e => e.removeFrom(map));
	// markers_MotS.removeFrom(map);
	// markers_SY.removeFrom(map);
	// click the current year's tour on
	switch(id){
		case 0:
			console.log('2020');
			markers_MotS.addTo(map);
			document.getElementById("mots").checked=true;
			break;
		case 1:
			console.log('2019');
			markers_SY.addTo(map);
			document.getElementById("sy").checked=true;
			break;
		case 2:
			console.log('2018');
			markers_LY.addTo(map);
			document.getElementById("ly").checked=true;
			break;
		case 3:
			console.log('2017');
			markers_W.addTo(map);
			document.getElementById("w").checked=true;
			break;
		case 4:
			console.log('2016');
			markers_tmbmil.addTo(map);
			document.getElementById("tmbmil").checked=true;
			break;
		case 5:
			console.log('2015');
			markers_WU.addTo(map);
			document.getElementById("wu").checked=true;
			break;
		case 6:
			console.log('2014');
			markers_RB.addTo(map);
			document.getElementById("rb").checked=true;
			break;
	}
	}
);