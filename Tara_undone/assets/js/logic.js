var mapBox = "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=" +
  "pk.eyJ1IjoidGZhdGhpbmVqYWQiLCJhIjoiY2ppZHZxc3RjMDdlbzNxcXVudHR5OGU1ZCJ9.V5KblddwO5hQE4ckY873cA";

var queryUrl = "https://openlayers.org/en/v4.2.0/examples/data/geojson/countries.geojson";

var fifa_countries = ["Brazil", "Germany", "Italy", "Argentina", "Spain", "England", "France", "Netherlands", "Uruguay", "Sweden", "Russia", "Serbia", "Mexico", "Belgium", "Poland", "Hungary", "Portugal", "Czech Republic", "Austria", "Chile", "Switzerland", "Paraguay", "USA", "Romania", "Denmark", "Korea Republic", "Croatia", "Colombia", "Costa Rica", "Scotland", "Cameroon", "Nigeria", "Bulgaria", "Turkey", "Japan", "Ghana", "Peru", "Republic of Ireland", "Northern Ireland", "Ecuador", "Algeria", "CÃ´te d'Ivoire", "South Africa", "Morocco", "Norway", "Australia", "Senegal", "German DR", "Greece", "Saudi Arabia", "Ukraine", "Tunisia", "Wales", "IR Iran", "Cuba", "Slovakia", "Slovenia", "Korea DPR", "Bosnia and Herzegovina", "Jamaica", "New Zealand", "Honduras", "Angola", "Israel", "Egypt", "Kuwait", "Trinidad and Tobago", "Bolivia", "Indonesia", "Iraq", "Togo", "Canada", "United Arab Emirates", "China PR", "Haiti", "Congo DR", "El Salvador", "Afghanistan", "Anguilla", "Albania", "Andorra", "Armenia", "Aruba", "American Samoa", "Antigua and Barbuda", "Azerbaijan", "Bahamas", "Bangladesh", "Burundi", "Benin", "Bermuda", "Burkina Faso", "Bahrain", "Bhutan", "Belarus", "Belize", "Botswana", "Barbados", "Brunei Darussalam", "Cambodia", "Cayman Islands", "Congo", "Chad", "Cook Islands", "Comoros", "Cape Verde Islands", "Central African Republic", "CuraÃ§ao", "Cyprus", "Djibouti", "Dominica", "Dominican Republic", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "Faroe Islands", "Gabon", "Gambia", "Georgia", "Gibraltar", "Guinea-Bissau", "Grenada", "Guatemala", "Guinea", "Guam", "Guyana", "Hong Kong", "India", "Iceland", "Jordan", "Kazakhstan", "Kenya", "Kyrgyz Republic", "Kosovo", "Laos", "Liberia", "Libya", "St Lucia", "Lesotho", "Lebanon", "Liechtenstein", "Lithuania", "Luxembourg", "Latvia", "Macau", "Madagascar", "Malaysia", "Moldova", "Maldives", "FYR Macedonia", "Mali", "Malta", "Montenegro", "Mongolia", "Mozambique", "Mauritius", "Montserrat", "Mauritania", "Malawi", "Myanmar", "Namibia", "Nicaragua", "New Caledonia", "Nepal", "Niger", "Oman", "Pakistan", "Panama", "Philippines", "Palestine", "Papua New Guinea", "Puerto Rico", "Qatar", "Rwanda", "Samoa", "Sudan", "Seychelles", "Singapore", "St Kitts and Nevis", "Sierra Leone", "San Marino", "Solomon Islands", "Somalia", "Sri Lanka", "South Sudan", "SÃ£o TomÃ© e PrÃ­ncipe", "Suriname", "Swaziland", "Syria", "Tahiti", "Tanzania", "Turks and Caicos Islands", "Tonga", "Thailand", "Tajikistan", "Turkmenistan", "Timor-Leste", "Chinese Taipei", "Uganda", "Uzbekistan", "Vanuatu", "Venezuela", "British Virgin Islands", "Vietnam", "St Vincent and the Grenadines", "US Virgin Islands", "Yemen", "Zambia", "Zimbabwe", "Netherlands Antilles", "RCS", "Zaire"
];

//Grabbing GeoJSON Data:
d3.json(queryUrl, function(data){
	console.log(data);
	createFeatures(data);
});

// console.log(feature.properties.name.includes(fifa_countries));


function createFeatures(FifaData) {

	function onEachFeature(feature, layer) {
		// feature.properties.name.forEach(function(chicken){
		// 	if (!fifa_countries.includes(chicken)){
		// 		layer.bindPopup("<h3>" + feature.id + "</h3><hr><p>" + feature.properties + "</p>");
		// 	}
		// })
		layer.bindPopup("<h3>" + feature.id + "</h3><hr><p>" + feature.properties + "</p>");
	};

	var country = L.geoJSON(FifaData, {
		onEachFeature: onEachFeature
	});

	createMap(country);

};



// features.properties

function createMap(country) {
	var worldMap = L.tileLayer(mapBox)

	var baseMaps = {
		"World Map" : worldMap
};

	var overlayMaps = {
		Fifa : country
};


var myMap = L.map("map",{
	center: [
		47.3769, -8.5417
	],
	zoom: 2, 
	layers: [worldMap, country]
});

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}








// slider: 
var data3 = d3.range(0, 10).map(function (d) { return new Date(1995 + d, 10, 3); });

  var slider3 = d3.sliderHorizontal()
    .min(d3.min(data3))
    .max(d3.max(data3))
    .step(1000 * 60 * 60 * 24 * 365)
    .width(400)
    .tickFormat(d3.timeFormat('%Y'))
    .tickValues(data3)
    .on('onchange', val => {
      d3.select("p#value3").text(d3.timeFormat('%Y')(val));
    });

  var g = d3.select("div#slider3").append("svg")
    .attr("width", 500)
    .attr("height", 100)
    .append("g")
    .attr("transform", "translate(30,30)");

  g.call(slider3);

  d3.select("p#value3").text(d3.timeFormat('%Y')(slider3.value()));
  d3.select("a#setValue3").on("click", () => slider3.value(new Date(1997, 11, 17)));
