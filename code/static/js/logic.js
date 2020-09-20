
// Function that will determine the color of a neighborhood based on the borough it belongs to
function chooseColor(d) {
    return d>5 ? 'red':
    d>4 ? "#FFEDA0":
    d>3 ? "orange":
    d>2 ? "yellow":
    d>1 ? "#bfff00":
    "#00fa00";
                            
};

function createFeatures(earthquakeData ) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData,  {

        //call the pointToLayer function to convert the pointer to circle 
        style: function(feature) {
            // console.log(feature.properties.mag)
    //define the color and radius for each circle
            return {
                color: chooseColor(parseFloat(feature.properties.mag)), 
                radius:5*parseFloat(feature.properties.mag),
            };
        },
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {
                radius: 10, 
                fillOpacity: 0.85
                
            });
        },

            onEachFeature: onEachFeature
                })
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}


function createMap(earthquakes) {

    // Define satellite and Outdoors layers
    const satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.satellite",
            accessToken: API_KEY
    });

    const Outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.outdoors",
            accessToken: API_KEY
    });

    const darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.dark",
            accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    const baseMaps = {
            "Satellite": satellite,
            "Dark map": darkmap,
            "Outdoors": Outdoors 
    };


    var tectonicplates = new L.LayerGroup();

        // Create overlay object to hold our overlay layer
    const overlayMaps = {
            Earthquakes: earthquakes,
            Tectonic: tectonicplates

    };

    // Create our map, giving it the satellite and earthquakes layers to display on load
    const myMap = L.map("map", {
            center: [37.09, -95.71],
            zoom: 5,
            layers: [satellite, earthquakes, tectonicplates]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
    }).addTo(myMap);

    
// // Create a legend to display information about our map
const info = L.control({
    position: "bottomright"
});

    // When the layer control is added, insert a div with the class of "legend"
info.onAdd = function() {
    const div = L.DomUtil.create("div", "legend");

    grades = [0, 1,2,3,4,5],
    labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
         
            '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
}
    return div;
};
// Add the info legend to the map
info.addTo(myMap);

d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json", function (platedata) {
    // Adding our geoJSON data, along with style information, to the tectonicplates
    // layer.
    L.geoJson(platedata, {
      color: "#dd1c77",
      weight: 2
    })
      .addTo(tectonicplates);
    // Then add the tectonicplates layer to the map.
    tectonicplates.addTo(myMap);
    console.log(platedata)
  });

}
(async function(){
    const queryEarthquake = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
    const data = await d3.json(queryEarthquake);
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);

})
()

// //------------------------------------------------

// // Function that will determine the color of a neighborhood based on the borough it belongs to
// function chooseColor(d) {
//     return d>5 ? 'red':
//     d>4 ? "#FFEDA0":
//     d>3 ? "orange":
//     d>2 ? "yellow":
//     d>1 ? "#BFFF00":
//     "#00FA00";
// };
// function markerSize(magnitude) {
//     if (magnitude === 0) {
//       return 1;
//     }
//     return magnitude * 5;
//   }
// // Perform a GET request to the query URL
// d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson", function (data) {
//   // Once we get a response, send the data.features object to the createFeatures function
//   createFeatures(data.features);
// });
// function createFeatures(earthquakeData) {
//     // Define a function we want to run once for each feature in the features array
//     // Give each feature a popup describing the place and time of the earthquake
//     function onEachFeature(feature, layer) {
//         layer.bindPopup("<h3>" + feature.properties.place +
//         "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
//     }
//     // Create a GeoJSON layer containing the features array on the earthquakeData object
//     // Run the onEachFeature function once for each piece of data in the array
//     var earthquakes = L.geoJSON(earthquakeData,  {
//         //call the pointToLayer function to convert the pointer to circle 
//     //     style: function(feature) {
//     //         // console.log(feature.properties.mag)
//     // //define the color and radius for each circle
//     //         return {
//     //             color: chooseColor(parseFloat(feature.properties.mag)), 
//     //             radius:5*parseFloat(feature.properties.mag),
//     //         };
//     //     },
//         pointToLayer: function(feature, latlng) {
//             var circle =  L.CircleMarker(latlng, {
//                 color: chooseColor(parseFloat(feature.properties.mag)),
//                 radius: markerSize(feature.properties.mag), 
//                 fillOpacity: 0.85
//             });
//             return circle
//         },
//             onEachFeature: onEachFeature
//                 })
//     // Sending our earthquakes layer to the createMap function
//     createMap(earthquakes);
// }
// // var faultResult = d3.json(queryFaults, function(d2){
// //     console.log(d2.features)
// //     L.geoJson(d2.features, {
// //       style: function(){
// //         return{
// //               color: "orange",
// //               fillOpacity: 0.,
// //               weight: 2
// //             }
// //       },
// //     })
// //     createMap(faultResult);
// // })
// function createMap(earthquakes) {
//     // Define satellite and Outdoors layers
//     const satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//             attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//             maxZoom: 18,
//             id: "mapbox.satellite",
//             accessToken: API_KEY
//     });
//     const Outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//             attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//             maxZoom: 18,
//             id: "mapbox.outdoors",
//             accessToken: API_KEY
//     });
//     const darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//             attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//             maxZoom: 18,
//             id: "mapbox.dark",
//             accessToken: API_KEY
//     });
//     // Define a baseMaps object to hold our base layers
//     const baseMaps = {
//             "Satellite": satellite,
//             "Dark map": darkmap,
//             "Outdoors": Outdoors 
//     };
//     var tectonicplates = new L.LayerGroup();
//     // Create overlay object to hold our overlay layer
//     const overlayMaps = {
//             Earthquakes: earthquakes,
//             Tectonic: tectonicplates
//     };
//     // Create our map, giving it the satellite and earthquakes layers to display on load
//     const myMap = L.map("map", {
//             center: [37.09, -95.71],
//             zoom: 5,
//             layers: [satellite, earthquakes, tectonicplates]
//     });
//     // Create a layer control
//     // Pass in our baseMaps and overlayMaps
//     // Add the layer control to the map
//     L.control.layers(baseMaps, overlayMaps, {
//             collapsed: false
//     }).addTo(myMap);
// // // Create a legend to display information about our map
// const info = L.control({
//     position: "bottomright"
// });
//     // When the layer control is added, insert a div with the class of "legend"
// info.onAdd = function() {
//     const div = L.DomUtil.create("div", "legend");
//     grades = [0, 1,2,3,4,5],
//     labels = [];
//     // loop through our density intervals and generate a label with a colored square for each interval
//     for (var i = 0; i < grades.length; i++) {
//         div.innerHTML +=
//             '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
//           grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
// }
//     return div;
// };
// // Add the info legend to the map
// info.addTo(myMap);
// d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json", function (platedata) {
//     // Adding our geoJSON data, along with style information, to the tectonicplates
//     // layer.
//     L.geoJson(platedata, {
//       color: "#dd1c77",
//       weight: 2
//     })
//       .addTo(tectonicplates);
//     // Then add the tectonicplates layer to the map.
//     tectonicplates.addTo(myMap);
//     console.log(platedata)
//   });
// }
// (async function(){
//     const queryEarthquake = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
//     let queryFaults='https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json'
//     const data = await d3.json(queryEarthquake);
//     // const dataFaults = await d3.json(queryFaults);
//     // Once we get a response, send the data.features object to the createFeatures function
//     createFeatures(data.features);
//     // createFeatures(faultResult);
// })()

