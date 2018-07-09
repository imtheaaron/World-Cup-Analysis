var mapboxKey = 'access_token=pk.eyJ1IjoiaW10aGVhYXJvbiIsImEiOiJjamlkdmxmZ3YwZnZzM3ZwaWlwcTlpbGlmIn0._Rrocc1JmeqRP7qkoB4m4Q'; 

var bordersUrl = 'https://openlayers.org/en/v4.2.0/examples/data/geojson/countries.geojson';

var rankings;
d3.json('/ranking', function(data) {
    rankings = data;
});

function buildmap() {
    var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
        mapboxKey);

    var baseMaps = {
        "Light Map": lightMap,
    };

    var myMap = L.map("map", {
        center: [30.3429959, -5.8608298],
        zoom: 3,
        layers: [lightMap] // borders, fifaColors]
    });

};

//build the initial map (2018)
function init() {
    // function to build the map with 2018 data
    let year = '2014';
    // buildmap();
    makeMap(year);
    // makeMetaData(year);
    // scatter(year);
        // slider(); 
};

// function to grab a year from the slider and recreate the map from that year data
function yearSelected(value) {
    var year = value;
    //INSTEAD OF REMAKING THE MAP HERE, JUST REMOVE A LAYER FROM THE LAYER GROUP WITH removeLayer()
    //THEN HAVE A FUNCTION THAT WILL CREATE A NEW LAYER WITH THE NEW DATA (also clearLayers() )
    recolorMap(year);
    makeMetaData(year);
    scatter(year)
};
 
// create the map with country colors for the specified year
function makeMap(year) {

    //create a map layer that will contain the country borders
    d3.json(bordersUrl, function(response) {
        
        function onEachFeature(feature, layer) {
            return style = {
                "fillColor": fifaRankColor(feature.id, year),
                "color": '#d4a22a',
                "weight": 1,
            }
        }



        // var borders = L.geoJson(response);
        
        var fifaColors = L.geoJson(response, {
            style: function(feature) {
                return {
                    fillColor: fifaRankColor(feature.id, year),
                    color: '#d4a22a',
                    fillOpacity: 0.6
                };
            }
            // style: function(feature) {
                // color: '#dc0926'
                // console.log('map color: ' + fifaRankColor(feature.id, year));
                // fillColor: if (fifaRankColor(feature.id, year)) {
                //     fifaRankColor(feature.id, year);
                // }
                //     else {
                //         '#d6d9db'
                // }
                // color: '#d4a22a';
                // weight: 1;
                // // weight: cupBorder(feature.id, year);
                // opacity: 1;
                // fillOpacity: 0.8;
            
        });

            // fillColor: fifaRankColor(feature.id, year),
            // color: '#d4a22a',
            // weight: cupBorder(feature.id, year),
            // opacity: 1,
            // fillOpacity: 0.8

        var cupColors =  L.geoJson(response, {
            style: function(feature) {
                return {
                    fillColor: cupRecordColor(feature.id, year),
                    color: '#d4a22a',
                    fillOpacity: 0.6,
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
            "Light Map": lightMap,
            "Dark Map": darkMap,
        };

        var overlayMaps = {
            "Fifa Ranking": fifaColors,
            "World Cup Result": cupColors
        };

        var myMap = L.map("map", {
            center: [30.3429959, -5.8608298],
            zoom: 2,
            layers: [lightMap, fifaColors]
        });

        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
            }).addTo(myMap);

    //if we do code to create metadata about the particular world cup
    // let url = "/cup_data/" + year;
    // d3.json(url, function(error,response) {
    //     var data = response;
    // });

    });

};

// function recolorMap(year) {
//     //
// };

//create the metadata info on the specified world cup year
// function makeMetaData(year) {
//     let cup_url = "metadata/" + year;
//     d3.json(cup_url, function(error, response) {
//         cup_data = response;
//         //BUILD THE TEXT COMPONENTS FOR THE DIV WITH WC INFO
//     })
// }

function fifaRankColor(country, year) {
    let fifaQuery = "FIFA_" + year;
    //I might now need to run a for loop to get the entire rank domain using push to push each result to a list
    var fifaRankDomain = [];

    var color;

    // rankings.forEach(x => {
    //     fifaRankDomain.push(x[fifaQuery])
    // });

    var fifaColorScale = d3.scaleSequential()
        .domain([1, 100])
        .interpolator(d3.interpolateViridis);

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
    .domain([1, 36])
    .interpolator(d3.interpolateMagma);

    rankings.forEach(x => {
        if (x.ABRV == country) {
            console.log('cup result: ' + x[cupQuery]);
            if (x[cupQuery]) {
                //return the results of the function to map x.wcQuery to 
                finalColor = cupColorScale(x[cupQuery]);
                console.log(x[cupQuery])
            }
            else {
                finalColor = '#d6d9db'
            }
        }
    })
    console.log(finalColor);
    return finalColor
};

function cupBorder(country, year) {
    let cupQuery = "WC_" + year; 
    rankings.forEach(x => {
        if (x.ABRV == country) {
            if (x.cupQuery) {
                return 1;
            }
            else {
                return 0;
            }
        }
    })
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