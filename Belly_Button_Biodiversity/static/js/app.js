function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `nd3.jso` to fetch the metadata for a sample
  url=`/metadata/${sample}`
  d3.json(url).then((samp)=>{
    // Use d3 to select the panel with id of `#sample-metadata`
    var metadata=d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    console.log(Object.entries(samp));

    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    for (let [key, value] of Object.entries(samp)) {
      metadata.append("div").text(`${key}: ${value}`);
    }

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  })
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  url2=`/samples/${sample}`
  d3.json(url2).then((sampledata)=>{
    var otu_ids = sampledata.otu_ids;
    var sample_values = sampledata.sample_values;
    // var labels = sampledata.labels;

    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        size: sample_values
      },
      color:otu_ids
    };
    
    var bubbledata = [trace1];
    
    var bubblelayout = {
      title: 'OTU ID',
      showlegend: false
    };
    
    Plotly.newPlot('bubble',bubbledata, bubblelayout);

    // @TODO: Build a Pie Chart
    var piedata = [{
      values: sample_values.slice(0,10),
      labels: otu_ids.slice(0,10),
      type: 'pie'
    }];
    
    var pielayout = {
      height: 400,
      width: 600
    };
    
    Plotly.newPlot('pie', piedata, pielayout);
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  })
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
