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
  d3.csv("data.csv", function(err, stateData) {
    // parse data
    stateData.forEach(function(data) {
      data.state = data.State;
      data.abbreviation = data.aberviation;
      data.rent = +data.Median_Rent;
      data.xChosen = +data.Exercised;
      data.drank = +data.Drank;
      data.own_home = +data.Own_Home;
      data.yChosen = +data.Healthy;
      data.unemployed = +data.Unemployed;
      data.college_educated = +data.College_educated;
      data.income = +data.Median_Income;
      data.population = +data.Population;
    });

    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain(d3.extent(stateData, data => data.xChosen))
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(stateData, data => data.yChosen)])
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
      .data(stateData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.xChosen))
      .attr("cy", d => yLinearScale(d.yChosen))
      .attr("r", d => (d.population*0.00001/5))
      .attr("fill", "lightseagreen")
      .attr("stroke-width", "3")
      .attr("stroke", "black")
      .attr("opacity", 0.8);

    // Step 1: Initialize Tooltip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .direction("s")
      .offset([10, -50])
      .html(function(d) {
        return (`<strong>${d.state}</strong><br>Population:<br>${d.population.toLocaleString()}<hr>Exercise: ${Math.round(d.xChosen)}%<hr>Healthy: ${Math.round(d.yChosen)}%`);
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
    .text("Exercised (%)")
    .attr("id", "exerciseAxis");

    chartGroup.append("text")
    .attr("class", "healthAxis")
    .attr("transform", `translate(${-37}, ${height / 2}) rotate(270)`)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "black")
    .text("Healthy (%)");

    // var axisLabels = chartGroup.selectAll("text")
    // axisLabels.on("click", xChosen = data.rent);

  });


}