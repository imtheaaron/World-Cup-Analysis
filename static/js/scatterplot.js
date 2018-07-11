d3.select(window).on("resize", makeResponsive);

//this function will remake the chart when the window is resized
makeResponsive();

function makeResponsive() {
    
    //if the svg already exists, remove it so we can start fresh
    var svgArea = d3.select(".chart").select("svg");
    if (!svgArea.empty()) {
        svgArea.remove();
      }
    
    //base measurements on window dimensions
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
    var labelArea = 120;
    var tPadBot = 40;
    var tPadLeft = 40;

    var leftTextX = margin.right -10;
    var leftTextY = (svgHeight) / 2 +0;
    var bottomTextY = svgHeight-15;
    var bottomTextX = (width) / 2 +0;


    //append the svg, chart group, and axis groups
    var svg = d3
    .select(".chart")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

    var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    svg.append("g").attr("class", "yText");
    var yText = d3.select(".yText");
    svg.append("g").attr("class", "xText");
    var xText = d3.select(".xText");    
    
    
    //reposition axis groups when screen resizes
    function yTextRefresh() {
        yText.attr("transform","translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)")
        };

    function xTextRefresh() {
        xText.attr("transform","translate(" + bottomTextX + ", " + bottomTextY + ")")
        };

    yTextRefresh();    
    xTextRefresh();

    //add the text to axis, the class "data-name" will be crucial for telling d3 what data to use
    yText
      .append("text")
      .attr("y", 26)
      .attr("data-name", "FIFA_1994")
      .attr("data-axis", "y")
      .attr("class", "aText active y")
      .text("World Cup Result");

    xText
      .append("text")
      .attr("y", 0)
      .attr("data-name", "WC_1994")
      .attr("data-axis", "x")
      .attr("class", "aText active x")
      .text("Qualifiers Ranked by FIFA Rank");
    
    //import the data with d3's custom csv method
    d3.json(`/rankings/`, function(jsonData) {
        visualize(jsonData);
    });

    var slider = document.getElementById("mySlider");
    var year = slider.value;



    //create a function that will plot our circles axis and tooltips
    function visualize(theData) {
        var curX = `Qualifiers_${year}`;
        var curY = `WC_${year}`;
        var FIFA_Rank = `FIFA_${year}`;
        var WC_All_Time = "WC_All_Time";
      
        var xMin;
        var xMax;
        var yMin;
        var yMax;
        var rMax;

        //create and call tool tips
        var toolTip = d3
        .tip()
        .attr("class", "tooltip")
        .offset([80, 145])
        .html(function(d) {
            return (`<h3>${d.Team}</h3><strong>FIFA Rank: ${Math.round(d[FIFA_Rank])}<br>World Cup Finish: ${Math.round(d[curY])}<br></strong><br>All Time World Cup Rank: ${(Math.round(d[WC_All_Time]))}`);
        });
        svg.call(toolTip); //?? why do we call toolTip on the SVG??//


        
        //BUILDING AXIS
        //this function finds min/max of selected data for building axis
        function xMinMax() {
            xMin = -1;
            xMax = d3.max(theData, function(d) {
              return parseFloat(d[curX]) * 1.02;
            });
          }

        
        function yMinMax() {
            yMin = -4;
            yMax = d3.max(theData, function(d) {
                return parseFloat(d[curY]) * 1.02;
            });
        }

        function rMax() {
          rMax = d3.max(theData, function(d) {
            return parseFloat(d[WC_All_Time]) * 1.05;
          })
        }

        xMinMax();
        yMinMax();
        rMax();

        //feed scale to axis with D3's scaleLinear and axisBottom/Left functions
        var xScale = d3
            .scaleLinear()
            .domain([xMax, xMin])
            .range([labelArea, width+labelArea]);

        var yScale = d3
            .scaleLinear()
            .domain([yMin, yMax])
            .range([0, svgHeight-60]);
    
        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);
        
        //set axis .ticks() attribute based on screen size
        function tickCount() {
            if (width <= 500 || height <=400) {
              xAxis.ticks(4);
              yAxis.ticks(5);
            }
            else {
              xAxis.ticks(8);
              yAxis.ticks(10);
            }
          }
          tickCount();

        //append our newly made axis
        svg
        .append("g")
        .call(xAxis)
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + (svgHeight-60) + ")");
        svg
        .append("g")
        .call(yAxis)
        .attr("class", "yAxis")
        .attr("transform", "translate(" + (labelArea) + ", 0)");

        // ADDING OUR ACTUAL DATA AKA "THE CIRCLES"
        // this new group will contain all future circles and their labels
        var theCircles = svg.selectAll("g theCircles").data(theData).enter()
        //.filter(function (d) { return (d[curX] > 0)});
        
        
        // This line will divide overperformers from underperformers
        var lineGroup = chartGroup.append("line")
        .attr("x1", 20)
        .attr("y1", svgHeight-labelArea+10)
        .attr("x2", width+5)
        .attr("y2", -20)
        .attr("stroke-width", 1)
        .attr("stroke", "grey");
        
         //This text identifies the performance regions of the plot
        theCircles.append("text")
        .text("overperformed")
        .attr("dx", svgWidth-width+60)
        .attr("dy", svgHeight-height-labelArea+40)
        .attr("class", "performanceText")

        theCircles.append("text")
        .text("underperformed")
        .attr("dx", width-labelArea-150)
        .attr("dy", height)
        .attr("class", "performanceText")

       
        //This function will help us resize our circles with the screen
        var radiusFactor;
        function getRadiusFactor() {
            if (width <= 500 || height <=250) {
                radiusFactor = 2;
                }
            else {
                radiusFactor = 1;
                }
            }
        getRadiusFactor();

        //this function can determine radius based on ranking data
        var getRadius = function(rank) {
          if (rank <= 1)
            return 50;
          else if (rank <= 2)
            return 48;
          else if (rank <= 3)
            return 46;
          else if (rank <= 5)
            return 44;
          else if (rank <= 10)
            return 40;
          else if (rank <= 20)
            return 30;
          else if (rank <= 30)
            return 25;
          else if (rank <= 40)
            return 20;
          else
            return 15;
        };

        // PLACE LABELS with same scales we will use to place circles (labels go first bc circles will overlap)
        theCircles
        .append("text")
        .text(function(d) {return d.Display_ABRV;})
        .attr("dx", function(d) {if (d[curY]>0) return xScale(d[curX]); else return 100})
        .attr("dy", function(d) {if (d[curX]>0) return yScale(d[curY]) + getRadius(d[WC_All_Time]) * (0.28/radiusFactor); else return height+labelArea})
        .attr("font-size", function(d) {return (getRadius(d[WC_All_Time])/radiusFactor)-6})
        .attr("class", "countryText")
        .attr("opacity", function(d) {
          if (d[curY]<1) 
            return 0;
          else
            return 0.7;
        });


        //append circles to the circles group (d = the piece of "theData" being added)
        theCircles
        .append("circle")
        .attr("cx", function(d) {if (d[curY]>0) return xScale(d[curX]); else return 100})
        .attr("cy", function(d) {if (d[curX]>0) return yScale(d[curY]); else return height+labelArea})
        .attr("r", function(d) {return getRadius(d[WC_All_Time])/radiusFactor;})
        // .attr("fill", "lightseagreen")
        .attr("fill", "IndianRed")
        .attr("opacity", function(d) {
          if (d[curY]<1) 
            return 0;
          else
            return 0.7;
        })
        .attr("stroke", "black")
        .attr("stroke-width", 3)
        .attr("class", function(d) {
          return "stateCircle " + d.Display_ABRV;
        })
        .on("mouseover", function(d) {
            toolTip.show(d);
            d3.select(this).style("fill", "red");
        })
        .on("mouseout", function(d) {
            toolTip.hide(d);
            // d3.select(this).style("fill", "lightseagreen");
            d3.select(this).style("fill", "IndianRed");
        });






        //MAKE THE CHART REMAKE AND TRANSITION BASED ON THE SLIDER

        d3.select(slider).on("mouseup", function() {
            year = parseFloat(this.value);

            curX = `Qualifiers_${year}`;
            curY = `WC_${year}`;
            FIFA_Rank = `FIFA_${year}`;
            
            xMinMax();
            yMinMax();
            xScale.domain([xMax, xMin]);
            yScale.domain([yMin, yMax]);
            svg.select(".xAxis").transition().duration(2000).call(xAxis.ticks(5));
            svg.select(".yAxis").transition().duration(2000).call(yAxis);
            // Each state circle gets a transition for it's new attribute.
            d3.selectAll("circle").each(function() {
              d3.select(this)
              .transition()
              .attr("cx", function(d) {if (d[curY]>0) return xScale(d[curX]); else return 100})
              .attr("cy", function(d) {if (d[curX]>0) return yScale(d[curY]); else return height+labelArea})
              .attr("opacity", function(d) {
                if (d[curY]<1) 
                  return 0;
                else
                  return 0.7;
              })
              .duration(2000);
              });
        
            // We need change the location of the state texts, too.
            d3.selectAll(".countryText").each(function() {
              d3.select(this)
              .transition()
              .attr("dx", function(d) {if (d[curY]>0) return xScale(d[curX]); else return 100})
              .attr("dy", function(d) {if (d[curX]>0) return yScale(d[curY]) + getRadius(d[WC_All_Time]) * (0.28/radiusFactor); else return height+labelArea})
              .attr("opacity", function(d) {
                if (d[curY]<1) 
                  return 0;
                else
                  return 0.7;
              })
              .duration(2000);
              });
          });
  
    }
}