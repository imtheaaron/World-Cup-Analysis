var mapboxKey = 'access_token=pk.eyJ1IjoiaW10aGVhYXJvbiIsImEiOiJjamlkdmxmZ3YwZnZzM3ZwaWlwcTlpbGlmIn0._Rrocc1JmeqRP7qkoB4m4Q'; 

var bordersUrl = 'https://openlayers.org/en/v4.2.0/examples/data/geojson/countries.geojson';

//set initial variables
var cupQualifiers;
var fifaColors;
var cupColors;

var rankings;
d3.json('/rankings/', function(data) {
    rankings = data;
});

// function buildmap() {
//     var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
//         mapboxKey);

//     var baseMaps = {
//         "Light Map": lightMap,
//     };

//     var myMap = L.map("map", {
//         center: [30.3429959, -5.8608298],
//         zoom: 3,
//         layers: [lightMap] // borders, fifaColors]
//     });

// };

//build the initial map (1994)
function init() {
    // function to build the map with 1994 data
    let year = '1994';
    selector();
    makeMap(year);
    // makeMetaData(year);
    // scatter(year);
        // slider(); 
};

function selector() {
    var wcYears = ['1994', '1998', '2002', '2006', '2010', '2014', '2018'];

    var select = document.getElementById("yearSet");
    for(var i = 0; i < wcYears.length; i++) {
        var id = wcYears[i];
        var el = document.createElement("option");
        el.textContent = id;
        el.value = id;
        select.appendChild(el);
    }
};

// function to grab a year from the slider and recreate the map from that year data
function yearSelected(value) {
    var year = value;
    //INSTEAD OF REMAKING THE MAP HERE, JUST REMOVE A LAYER FROM THE LAYER GROUP WITH removeLayer()
    //THEN HAVE A FUNCTION THAT WILL CREATE A NEW LAYER WITH THE NEW DATA (also clearLayers() )
    reColorMap(year);
    // makeMetaData(year);
    // scatter(year)
};
 
// create the map with country colors for the specified year
function makeMap(year) {

    //create a map layer that will contain the country borders
    d3.json(bordersUrl, function(response) {
        
        function onEachFeature(feature, layer) {
            layer.bindPopup("<h3>" + countryInfo(feature.id, year)[0] + "</h3><p>" + "Confederation: " + countryInfo(feature.id, year)[1] +
          "<hr>" + year + " FIFA Ranking: " + countryInfo(feature.id, year)[2] + "<br>" + year + " WC Result: " + countryInfo(feature.id, year)[3] + "</p>");
        }

        cupQualifiers = L.geoJson(response, {
            onEachFeature: onEachFeature,
            style: function(feature) {
                return {
                    color: '#cc2929',
                    weight: cupBorder(feature.id, year),
                    fillOpacity: 0,
                };
            }   
        });
        
        fifaColors = L.geoJson(response, {
            onEachFeature: onEachFeature,
            style: function(feature) {
                return {
                    fillColor: fifaRankColor(feature.id, year),
                    color: '#d6d9db',
                    weight: 0,
                    fillOpacity: 0.6
                };
            }            
        });

        cupColors =  L.geoJson(response, {
            onEachFeature: onEachFeature,
            style: function(feature) {
                return {
                    fillColor: cupRecordColor(feature.id, year),
                    color: '#d6d9db',
                    fillOpacity: 0.7,
                    weight: 0
                };
            }
        });
    
        // Define map layers
        var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
        mapboxKey);

        var darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
        mapboxKey);

        var baseMaps = {
            // "Dark Map": darkMap,
            // "Light Map": lightMap,
            "Fifa Ranking": fifaColors,
            "World Cup Result": cupColors
        };

        var overlayMaps = {
            "Cup Qualifiers": cupQualifiers,
            // "Fifa Ranking": fifaColors,
            // "World Cup Result": cupColors
        };

        var myMap = L.map("map", {
            center: [29.141044, 16.498359],
            zoom: 2,
            layers: [lightMap, fifaColors, cupQualifiers]
        });

        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
            }).addTo(myMap);

        //Make the Fifa cup qualifiers border be the top layer at all times
        myMap.on("baselayerchange", function (event) {
            cupQualifiers.bringToFront();
            });

        // Adding legend to the map
        var textlabels = [
            "Worst",
            '',
            '',
            '',
            '',
            '',
            'Best'
        ];

        var legend = L.control({position: 'bottomright'});
        legend.onAdd = function () {
            var div = L.DomUtil.create('div', 'legend');
            var limits = [
                50,
                40,
                30,
                20,
                10,
                5,
                3
            ]
            var colors = [
                "#fefec9",
                "#fee491",
                "#fc9f4e",
                "#fa733d",
                "#ee3a2c",
                "#b90929",
                "#80002a"
            ]
            labels = [];
            div.innerHTML = "<h4>Rankings/<br>Results</h4>";

            // loop through our density intervals and generate a label with a colored square for each interval
            for (var i = 0; i < limits.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + colors[i] + '"></i> ' +
                    textlabels[i] + '<br>';
            }
            return div;
        };
        legend.addTo(myMap);



    //if we do code to create metadata about the particular world cup
    // let url = "/cup_data/" + year;
    // d3.json(url, function(error,response) {
    //     var data = response;
    // });

    });

};

//create the metadata info on the specified world cup year
// function makeMetaData(year) {
//     let cup_url = "metadata/" + year;
//     d3.json(cup_url, function(error, response) {
//         cup_data = response;
//         //BUILD THE TEXT COMPONENTS FOR THE DIV WITH WC INFO
//     })
// }

//generates data on each country to make popups
function countryInfo(country, year) {
    var info = []
    let query = "WC_" + year;
    let fifaQuery = "FIFA_" + year;
    rankings.forEach(x => {
        if (x.ABRV == country) {
            info.push(x.Team);
            info.push(x.Confederation);
            info.push("#" + x[fifaQuery]);
            if (year == 2018) {
                info.push('No results yet')
            }
            else {
                if (x[query]) {
                    info.push("Finished #" + x[query])
                }
                else {
                    info.push("Did not Play")
                }
            }
        }
    })
    return info;
};

function fifaRankColor(country, year) {
    let fifaQuery = "FIFA_" + year;
    //I might now need to run a for loop to get the entire rank domain using push to push each result to a list
    var fifaRankDomain = [];

    var color;

    // rankings.forEach(x => {
    //     fifaRankDomain.push(x[fifaQuery])
    // });

    var fifaColorScale = d3.scaleSequential()
        .domain([50, 1])
        .interpolator(d3.interpolateYlOrRd);

    rankings.forEach(x => {
        if (x.ABRV == country) {
            // console.log('got color: ' + fifaColorScale(x[fifaQuery]))
            // console.log(x.ABRV, 'fifa rank: ' + x[fifaQuery]);
            if (x[fifaQuery]) {
                color = fifaColorScale(x[fifaQuery]);
            }
            else {
                color = '#d6d9db'
            }
        }
    });
    // console.log('color: ' + color);
    return color;
};

function cupRecordColor(country, year) {
    let cupQuery = "WC_" + year;

    var cupRankDomain = []
    rankings.forEach(x => {
        cupRankDomain.push(x[cupQuery])
    });
    // console.log('cup domain: ' + cupRankDomain);

    var finalColor;

    var cupColorScale = d3.scaleSequential()
    .domain([16, 1])
    .interpolator(d3.interpolateYlOrRd);

    rankings.forEach(x => {
        if (x.ABRV == country) {
            // console.log(x.ABRV + ' cup result: ' + x[cupQuery]);
            if (x[cupQuery]) {
                //return the results of the function to map x.wcQuery to 
                finalColor = cupColorScale(x[cupQuery]);
                // console.log(x[cupQuery])
            }
            else {
                finalColor = '#d6d9db'
            }
        }
    });
    // console.log('final color: ' + finalColor);
    return finalColor
};

function cupBorder(country, year) {
    let cupQuery = "WC_" + year; 
    var borderWeight;
    rankings.forEach(x => {
        if (x.ABRV == country) {
            if (x[cupQuery]) {
                borderWeight = 3;
            }
            else {
                borderWeight = 0;
            }
        }
    });
    return borderWeight;
};

function reColorMap(year) {    
    
    cupQualifiers.eachLayer(function (layer) {
        layer.setStyle({
            weight: cupBorder(layer.feature.id, year)
        });
        layer.bindPopup("<h3>" + countryInfo(layer.feature.id, year)[0] + "</h3><p>" + "Confederation: " + countryInfo(layer.feature.id, year)[1] +
        "<hr>" + year + " FIFA Ranking: " + countryInfo(layer.feature.id, year)[2] + "<br>" + year + " WC Result: " + countryInfo(layer.feature.id, year)[3] + "</p>");
        // var idLayer = layer._leaflet_id;
        // var country = layer.feature.id;
        // map._layers[idLayer].setStyle({weight: cupBorder(country, year)});
    });
        
    fifaColors.eachLayer(function (layer) {
        layer.setStyle( {
            fillColor: fifaRankColor(layer.feature.id, year)
        });
        layer.bindPopup("<h3>" + countryInfo(layer.feature.id, year)[0] + "</h3><p>" + "Confederation: " + countryInfo(layer.feature.id, year)[1] +
        "<hr>" + year + " FIFA Ranking: " + countryInfo(layer.feature.id, year)[2] + "<br>" + year + " WC Result: " + countryInfo(layer.feature.id, year)[3] + "</p>");   
    });  

    cupColors.eachLayer(function (layer) {
        layer.setStyle({
            fillColor: cupRecordColor(layer.feature.id, year)
        });
        layer.bindPopup("<h3>" + countryInfo(layer.feature.id, year)[0] + "</h3><p>" + "Confederation: " + countryInfo(layer.feature.id, year)[1] +
        "<hr>" + year + " FIFA Ranking: " + countryInfo(layer.feature.id, year)[2] + "<br>" + year + " WC Result: " + countryInfo(layer.feature.id, year)[3] + "</p>");   
    });

};

// function slider() {
//     // LOGIC TO BUILD SLIDER GOES HERE
//     var years = [
//         '1994',
//         '1998',
//         '2002',
//         '2006',
//         '2010',
//         '2014',
//         '2018'
//     ];

init();