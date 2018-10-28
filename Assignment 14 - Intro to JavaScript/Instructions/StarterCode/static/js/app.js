// from data.js
// var tableData = data;

// reference tablebody from data.js
var tbody = d3.select("tbody");

// print ufo data from data.js
console.log(data);

// loop through ufo sighting data in data.js
// set to print ufo sighting data
// for each row in tbody we will append 

data.forEach(function(ufoSighting) {
  console.log(ufoSighting);
  var row = tbody.append("tr")

  // for each object in data.js select key and value
  // print key and value data
  // for each cell in row we will append the data

  Object.entries(ufoSighting).forEach(function([key, value]) {
    console.log(key, value);
    var cell = row.append("td")

    cell.text(value)
  })
});

var filteredData = tbody.filter(row => row.datetime == date);
  console.log(filteredData);
// var dates = filteredData.map(row => row.datetime == date);



 