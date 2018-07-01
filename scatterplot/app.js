d3.select(window).on("resize", makeResponsive);

// When the browser loads, makeResponsive() is called.
makeResponsive();

// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // SVG wrapper dimensions are determined by the current width and
  // height of the browser window.
  var svgWidth = window.innerWidth - 100;
  var svgHeight = window.innerHeight - 100;

  var margin = {
    top: 50,
    bottom: 100,
    right: 50,
    left: 100
  };

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

  // Append SVG element
  var svg = d3
    .select(".chart")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

  // Append group element
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
 

  // Read CSV
  d3.json("rankings_json.txt", function(err, rankings_data) {
    // parse data
    rankings_data.forEach(function(data) {
      if(data.WC_1994 < 1){
        
      } else{
        data.team = data.Team;
        data.abbreviation = data.ABRV;
        data.WC = +data.WC_1994;
        data.FIFA = +data.FIFA_1994;
        data.all_time = +data.WC_All_Time;
      }
    });

    // create scales
    // var xLinearScale = d3.scaleLinear()
    //   .domain(d3.extent(rankings_data, data => data.WC_1994))
    //   .range([0, width]);

    var xLinearScale = d3.scaleLinear()
      .domain([d3.max(rankings_data, data => data.FIFA), 1])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.max(rankings_data, data => data.WC), 0])
      .range([height, 0]);

    // create axes
    var xAxis = d3.axisBottom(xLinearScale).ticks(12);
    var yAxis = d3.axisLeft(yLinearScale).ticks(12);

    // append axes
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);

    // append circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(rankings_data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.FIFA))
      .attr("cy", d => yLinearScale(d.WC))
      .attr("r", d => (30))
      .attr("fill", "lightseagreen")
      .attr("stroke-width", "3")
      .attr("stroke", "black")
      .attr("opacity", 0.8)
      .append('line')
      .attr("cx", )

    // var circle = chartGroup.append("line")
    //   .attr("x1", 24)
    //   .attr("y1", 24)
    //   .attr("x2", 1)
    //   .attr("y2", 1);

    // Step 1: Initialize Tooltip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .direction("s")
      .offset([10, -50])
      .html(function(d) {
        return (`<strong>${d.team}</strong><br>All Time Rank: ${data.all_time}<br>WC Finish: ${Math.round(data.WC)}<br>FIFA Rank: ${Math.round(data.FIFA)}`);
      });

    // Step 2: Create the tooltip in chartGroup.
    chartGroup.call(toolTip);

    // Step 3: Create "mouseover" event listener to display tooltip
    circlesGroup.on("mouseover", function(d) {
      toolTip.show(d);
      d3.select(this).attr("fill", "red");
    })
    // Step 4: Create "mouseout" event listener to hide tooltip
      .on("mouseout", function(d) {
        toolTip.hide(d);
        circlesGroup.attr("fill", "lightseagreen");
      });

    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + 37})`) //Will disappear from view if out of SVG!
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "black")
    .text("FIFA Rank")
    .attr("id", "exerciseAxis");

    chartGroup.append("text")
    .attr("class", "healthAxis")
    .attr("transform", `translate(${-37}, ${height / 2}) rotate(270)`)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "black")
    .text("World Cup Result");

    // var axisLabels = chartGroup.selectAll("text")
    // axisLabels.on("click", xChosen = data.rent);

  });


}