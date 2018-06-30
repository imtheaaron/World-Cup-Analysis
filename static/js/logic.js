var mapboxKey = 'access_token=pk.eyJ1IjoiaW10aGVhYXJvbiIsImEiOiJjamlkdmxmZ3YwZnZzM3ZwaWlwcTlpbGlmIn0.'
+ '_Rrocc1JmeqRP7qkoB4m4Q'; 

var bordersUrl = 'INSERT URL FOR COUNTRY BORDERS GEOJSON HERE'

//build the initial map (2018)
function init() {
    // function to build the map with 2018 data
    let year = '2018';
    d3.json('/db')
    slider();    
    makeMap(year); 
    makeMetaData(year);
    scatter(year);
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
  
    d3.json('/db', )
    //create a map layer that will contain the country borders
    d3.json(bordersUrl, function(data) {
        let response = data
        var borders = L.geoJson(response)
        var fifaColors = L.geoJson(response, {
            fillColor: fifaRankColor(feature.id, year),
            color: '#d4a22a',
            weight: cupBorder(feature.id, year),
            opacity: 1,
            fillOpacity: 0.8
        })
        var cupColors =  L.geoJson(response, {
            fillColor: cupRecordColor(feature.id, year),
            color: '#d4a22a',
            weight: 0,
            opacity: 0,
            fillOpacity: 0.8
        })
    });

    // Define map layers
    var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
    mapboxKey);

    var baseMaps = {
        "Light Map": lightMap,
    };

    var overlayMaps = {
        "Fifa Ranking": fifaColors,
        "World Cup Result": cupColors
    };

    var myMap = L.map("map", {
        center: [30.3429959, -5.8608298],
        zoom: 2,
        layers: [lightMap, borders, fifaColors]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
        }).addTo(myMap);

    //if we do code to create metadata about the particular world cup
    // let url = "/cup_data/" + year;
    // d3.json(url, function(error,response) {
    //     var data = response;
    // });

};

function recolorMap(year) {
    //
};

//create the metadata info on the specified world cup year
function makeMetaData(year) {
    let cup_url = "cup_data/" + year;
    d3.json(cup_url, function(error, response) {
        cup_data = response;
        //BUILD THE TEXT COMPONENTS FOR THE DIV WITH WC INFO
    })
}

function fifaRankColor(country, year) {
    let fifaQuery = "FIFA_" + year;
    //I might now need to run a for loop to get the entire rank domain using push to push each result to a list
    var fifaRankDomain = [];

    rankings.forEach(x => {
        fifaRankDomain.push(x.fifaQuery)
    });

    var fifaColorScale = d3.scaleSequential()
        .extent(fifaRankDomain)
        .interpolator(d3.interpolateInferno);

    rankings.forEach(x => {
        if (x.ABRV == country) {
            return fifaColorScale(x.fifaQuery);
        }
    });
};

function cupRecordColor(country, year) {
    let cupQuery = "WC_" + year;

    var cupRankDomain = []
    rankings.forEach(x => {
        cupRankDomain.push(x.cupQuery)
    });
    console.log('cup domain: ' + cupRankDomain);

    var cupColorScale = d3.scaleSequential()
    .extent(cupRankDomain)
    .interpolator(d3.interpolateMagma);

    rankings.forEach(x => {
        if (x.ABRV == country) {
            if (x.cupQuery) {
                //return the results of the function to map x.wcQuery to 
                return cupColorScale(x.cupQuery);
            }
            else {
                return "#949797"
            }
        }
    })
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

function slider() {
    // LOGIC TO BUILD SLIDER GOES HERE
    var years = [
        '1994',
        '1998',
        '2002',
        '2006',
        '2010',
        '2014',
        '2018'
    ];

};

function scatter(year) {
    //BUILD THE SCATTER PLOT FROM FIFA RANKINGS VS. WORLD CUP RESULT DATA
};