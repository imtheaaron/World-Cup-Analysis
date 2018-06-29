var mapboxKey = 'access_token=pk.eyJ1IjoiaW10aGVhYXJvbiIsImEiOiJjamlkdmxmZ3YwZnZzM3ZwaWlwcTlpbGlmIn0.'
+ '_Rrocc1JmeqRP7qkoB4m4Q'; 

var bordersUrl = 'INSERT URL FOR COUNTRY BORDERS GEOJSON HERE'

//build the initial map (2018)
function init() {
    // function to build the map with 2018 data
    let year = '2018';
    slider();    
    makeMap(year); 
    makeMetaData(year);
    scatter(year);
};

// function to grab a year from the slider and recreate the map from that year data
function yearSelected(value) {
    var year = value;
    makeMap(year);
};
 
// create the map with country colors for the specified year
function makeMap(year) {
    
    //create a map layer that will contain the country borders
    d3.json(bordersUrl, function(data) {
        let response = data
        var borders = d3.geoJson(response)
    });

    let url = "/country_data/" + year;
    d3.json(url, function(error,response) {
        var data = response;

    });

    //we are going to have to add coloring to each country this will be done with the
    //fifaRankColor() and cupRecordColor() functions

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
    //PERHAPS MAP THE RANKINGS TO A RANGE OF COLORS?
    // var yScale = d3.scaleLinear()
    //   .domain([0, d3.max(testScores)])
    //   .range([0, svgHeight]);
    // color = yScale(country))
};

function cupRecordColor(country, year) {

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