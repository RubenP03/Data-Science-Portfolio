// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create SVG wrapper, append an SVG group that will hold chart
// and shift charset
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Paramaters
var chosenXAxis = "age";

// function used for updating x-scale variable upon click on axis label
function xScale(age, chosenXAxis){
  // create scales
  var xLinearScale = d3.scaleLinear()
  .domain([d3.min(age, d => d[chosenXAxis]) * 0.8,
    d3.max(age, d => d[chosenXAxis]) * 1.2
  ])
  .range([0, width]);

  return xLinearScale
}

// function for updating cirecles group with transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(800)
    .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}

// function for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  if (chosenXAxis === "age") {
    var label = "Age:";
  }

  else {
    var label = "Poverty"
  }
// **************ASK TA FOR HELP HERE ↑↓**************
  var toolTip = d3.tip()
  .attr("class", "tooltip")
  .offset([80, -60])
  .html(function(d) {
    return (`${d.abbr}<br> ${label} ${chosenXAxis}`);
  });

 circlesGroup.call(toolTip);

 circlesGroup.on("mouseover", function(data) {
   toolTip.show(data, this);
 })

  // on mouseout
  .on("mouseout", function(data, index) {
    toolTip.hide(data);
  });

 return circlesGroup;
}

// retrieve data from CSV file
var file = "data.csv"
d3.csv(file).then(successHandle, errorHandle);

function errorHandle(error) {
  throw error;
}

function successHandle(stateData) {
  // parese data
  stateData.forEach(function(data) {
    data.age = +data.age;
    data.poverty = +data.poverty;
    data.income = +data.income;
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;
    data.healthcare = +data.healthcare;

  });
// xLinearScale function above csv import
  var xLinearScale = xScale(stateData, chosenXAxis);

// Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(stateData, d => d.smokes)])
    .range([height, 0]);

// Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

// append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

// append y axis
chartGroup.append("g")
  .call(leftAxis);

// append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", 20)
    .attr("fill", "red")
    .attr("opacity", ".5");

// Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var ageLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "age") // value to grab for event listener
      .classed("active", true)
      .text("Age (Median)");

//   var albumsLabel = labelsGroup.append("text")
//       .attr("x", 0)
//       .attr("y", 40)
//       .attr("value", "num_albums") // value to grab for event listener
//       .classed("inactive", true)
//       .text("# of Albums Released");
//

// append y axis
  chartGroup.append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 0 - margin.left)
     .attr("x", 0 - (height / 2))
     .attr("dy", "1em")
     .classed("axis-text", true)
     .text("Smokes (%)");

// x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

       // replaces chosenXAxis with value
       chosenXAxis = value;

// console.log(chosenXAxis)

// functions here found above csv import
// updates x scale for new data
  xLinearScale = xScale(stateData, chosenXAxis);

// updates x axis with transition
      xAxis = renderAxes(xLinearScale, xAxis);

// updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

// updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

// changes classes to change bold text
        if (chosenXAxis === "age") {
                smokesLabel
                  .classed("active", true)
                  .classed("inactive", false);
                // hairLengthLabel
                //   .classed("active", false)
                //   .classed("inactive", true);
              }
        else {
                smokesLabel
                  .classed("active", false)
                  .classed("inactive", true);
                // hairLengthLabel
                //   .classed("active", true)
                //   .classed("inactive", false);
              }
            }
          });

}
