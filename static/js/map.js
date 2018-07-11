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

//build the initial map (1994)
function init() {
    // function to build the map with 1994 data
    let year = '1994';
    makeMap(year);
    makeMetaData(year);
};

// function to grab a year from the slider and recreate the map from that year data
function yearSelected(value) {
    var year = value;
    reColorMap(year);
    makeMetaData(year);
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
            "Fifa Ranking": fifaColors,
            "World Cup Result": cupColors
        };

        var overlayMaps = {
            "Cup Qualifiers": cupQualifiers,
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

    });

};

//create the metadata info on the specified world cup year
function makeMetaData(year) {
    let cup_url = "metadata/" + year + "/";
    d3.json(cup_url, function(error, response) {
        let cup_data = response;
        d3.select(".card-body").html(`<h3 class="card-top-text">World Cup ${year}</h3><hr>`);
        if (year == 2018) {
            d3.select(".card-body").append("P").text("No information yet on 2018 World Cup");
        }
        else {
            let attendance = String(cup_data[0].Attendance);
            attendance = attendance.slice(0,4);
            
            d3.select(".card-body").append("h4").text("Details");
            d3.select(".card-body").append("P").text("Host Country: " + cup_data[0].Host);
            d3.select(".card-body").append("P").text("Attendance: " + attendance + " Million");
            d3.select(".card-body").append("P").text("Number of Teams: " + cup_data[0].QualifiedTeams);
            d3.select(".card-body").append("P").text("Total Goals Scored: " + cup_data[0].GoalsScored);
            d3.select(".card-body").append("hr");
            d3.select(".card-body").append("h4").text("Results");
            d3.select(".card-body").append("P").text("Winner: " + cup_data[0].Winner);
            d3.select(".card-body").append("P").text("Runner-Up: " + cup_data[0]['Runners-Up']);
            d3.select(".card-body").append("P").text("Third Place: " + cup_data[0].Third);
        }
    })
};

//generates data on each country to make popups
function countryInfo(country, year) {
    var info = []
    let query = "WC_" + year;
    let fifaQuery = "FIFA_" + year;
    rankings.forEach(x => {
        if (country == 'GRL') {
            info.push("Greenland")
            info.push("No team")
            info.push("None")
            info.push("None")
        }
        else if (x.ABRV == country) {
            info.push(x.Team);
            info.push(x.Confederation);
            if (x[fifaQuery]) {
                info.push("#" + x[fifaQuery]);
            }
            else {
                info.push('No ranking')
            };
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

init();