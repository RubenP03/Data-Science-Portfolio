function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var metadataURL = `/metadata/${sample}`
    d3.json(metadataURL).then(handleSuccess).catch(handleError)

    function handleSuccess(result){
      console.log('successful data retrieval')

    // Use `.html("") to clear any existing metadata
    sampleMetaData = d3.select("#sample-metadata")
    sampleMetaData.html('')

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(function([key, value]){
      sampleMetaData.append("p").text(`${key}: ${value}`)
    })
  }
  
    function handleError(error){
      console.log('something went wrong')
    }
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var sampleURL = `/samples/${sample}`

  d3.json(sampleURL).then(handleSuccess).catch(handleError)

    // @TODO: Build a Bubble Chart using the sample data
    function handleSuccess(result){}
    var data2 = [
  {
  x: result["otu_ids"],
  y: result["sample_values"],
  hovertext: result["otu_labels"],
  mode: 'markers',
  marker: {
    size: result["sample_values"],
    color: result["otu_ids"],
    // apply a customized colorscale
    colorscale: [
      ['0.0', 'rgb(165,0,38)'],
      ['0.111111111111', 'rgb(215,48,39)'],
      ['0.222222222222', 'rgb(244,109,67)'],
      ['0.333333333333', 'rgb(253,174,97)'],
      ['0.444444444444', 'rgb(254,224,144)'],
      ['0.555555555556', 'rgb(224,243,248)'],
      ['0.666666666667', 'rgb(171,217,233)'],
      ['0.777777777778', 'rgb(116,173,209)'],
      ['0.888888888889', 'rgb(69,117,180)'],
      ['1.0', 'rgb(49,54,149)']
    ],
    }
  }
];

var layout2 = {
  xaxis: {
    title: "OTU ID"
  },
  // align the bubble chart to center
  align: "center"
};

Plotly.newPlot('bubble', data2, layout2);

function handleError(error){console.log('something went wrong. error: ', error)}


function init() {


    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    function handleSuccess(result){
      var data= [{
        labels: result["otu_ids"].slice(0, 10),
        values: ["sample_values"].slice(0, 10),
        hovertext: result["otu_labels"].slice(0, 10),
        type: 'pie'
      }];

      var layout = {
        height: 500,
        width: 500,
        align: "center",
        margin: {
          t: 0,
          pad: 0
        }
      }

    Plotly.newPlot("plot", data, layout)
    }

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
