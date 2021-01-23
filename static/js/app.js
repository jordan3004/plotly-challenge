// Step 1
// Horizontal bar chart
function barChart(sampleId){
  d3.json("data/samples.json").then(incomingData => {

    var sampleData = incomingData.samples;
    console.log(sampleData);

    //filtering data with ID chosen by the user
    var sampleIDS = sampleData.filter(sampleInput => sampleInput.id == sampleId);
    //console.log(sampleIDS);    

    var itemsList = sampleIDS[0];

    var sampleValues = itemsList.sample_values.slice(0, 10).reverse();
        
    var otuIds = itemsList.otu_ids.slice(0, 10).reverse();
    var stringOtuIds = otuIds.map(d => 'OTU ' + d);

    var otuLabels = itemsList.otu_labels.slice(0, 10).reverse();
        
    trace = {
      type: "bar",
      x: sampleValues,
      y: stringOtuIds,
      text: otuLabels,
      orientation: "h", 
    }

    data = [trace]; 
    Plotly.newPlot("bar", data);
  });
};

// Buble chart
function bubbleChart(sampleId){
  d3.json("data/samples.json").then(incomingData => {   
    
    var sampleData = incomingData.samples;
    console.log(sampleData);

    //filtering data with ID chosen by the user
    var sampleList = sampleData.filter(sampleObject => sampleObject.id == sampleId);    
    var itemsList = sampleList[0];

    var otuIds = itemsList.otu_ids;
    var sampleValues = itemsList.sample_values;
    var otuLables = itemsList.otu_labels;
    
  
    trace = {
      x: otuIds,
      y: sampleValues,
      text: otuLables,
      mode: "markers",
      marker: {
      color: otuIds,
      size: sampleValues,
      colorscale : "Earth" //"Bluered"
      },
      size: sampleValues,
      sizeref: 2,
      sizemode: 'area'
    };

    var layout = {
      xaxis : {
        title: "OTU ID"
      }
    };

    data = [trace]; 
    Plotly.newPlot("bubble", data, layout);
  });
};

// Display demographic info from JSON metadata 
function demographicInfo(sampleId){
  var metadataInfo = d3.select("#sample-metadata");
  d3.json("data/samples.json").then((incomingData) => {
    
    metadataInfo.html("");
    var metadataVar = incomingData.metadata;
    console.log(metadataVar);

    //filtering data with ID chosen by the user
    var itemsList = metadataVar.filter(sampleObject => sampleObject.id == sampleId);
    var list = itemsList[0];
    var wfreq = list.wfreq
    Object.entries(list).forEach(([key, value]) => {
      metadataInfo.append("h5").text(`${key} : ${value}`);
  });
  //sending washing frequiency from here to refresh the graph
  buildGauge(wfreq);
});
};


// Initiate the webpage with the default visualizations
function init(){
  var selector = d3.select("#selDataset");
  d3.json("data/samples.json").then(incomingData => {
    var nameId = incomingData.names;

    //filling the dropdown list of ID's 
    nameId.forEach(id => {selector.append("option").text(id).property("value", id);});
    
    //default ID to generate the graphs
    var defaultId = nameId[0];
    demographicInfo(defaultId);
    barChart(defaultId);
    bubbleChart(defaultId);
  });
};

// Initiate the web page
init()

// From index.html onchange of selDataset
function optionChanged(SubjectID){
  demographicInfo(SubjectID);
  barChart(SubjectID);
  bubbleChart(SubjectID);
};


//Advanced challenge Gauge Char

function buildGauge(wfreq) {

  console.log(wfreq);


  var level = parseFloat(wfreq) * 20;
  var degrees = 180 - level;
  var textlevel = level / 20;

  var radius = 0.5;

  var radians = (degrees * Math.PI) / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  var mainPath = "M -.0 -0.05 L .0 0.05 L ";
  var pathX = String(x);
  var space = " ";
  var pathY = String(y);
  var pathEnd = " Z";
  var path = mainPath.concat(pathX, space, pathY, pathEnd);

  var data = [
  {
      type: "scatter",
      x: [0],
      y: [0],
      marker: { size: 20, color: "#f2096b" },
      showlegend: false,
      name: "Washing Frequency",
      text: textlevel,
      hoverinfo: "name"
  },
  {
      values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
      rotation: 90,
      text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      textinfo: "text",
      textposition: "inside",
      
      marker: {
      colors: [
          "#85b788",
          "#8bbf8f",
          "#8dc386",
          "#b7cf90",
          "#d5e79a",
          "#e5e9b0",
          "#eae8ca",
          "#f5f2e5",
          "#f9f3ec",
          "#ffffff"
      ]
      
      },
      labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      hoverinfo: "label",
      hole: 0.5,
      type: "pie",
      showlegend: false
  }
  ];

  var layout = {
  shapes: [
      {
      type: "path",
      path: path,
      fillcolor: "#f2096b",
      line: {
          color: "#f2096b"
      }
      }
  ],
  title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
  height: 500,
  width: 500,
  xaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1,1]
  },
  yaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
  }
  };

  Plotly.newPlot("gauge", data, layout);
};