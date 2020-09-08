
// Function that will determine the color of a neighborhood based on the borough it belongs to
function chooseColor(mag) {
     if (mag>=5){
        return "#CD5C5C"};
        if (mag>=4 & mag<5){
            return "#EF820D"};
            if (mag>=3 & mag<4){
                return "#F9A602"};
                if (mag>=2 & mag<3){
                    return "#FADA5E"};
                    if (mag>=1 & mag<2){
                        return "#C&EA46"};
                        if(mag>=0 & mag<1){
                            return "#3BB143"
                        };
                            
}




function createFeatures(earthquakeData) {

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
            console.log(feature.properties.mag)
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

    // Create overlay object to hold our overlay layer
    const overlayMaps = {
            Earthquakes: earthquakes
    };

    // Create our map, giving it the satellite and earthquakes layers to display on load
    const myMap = L.map("map", {
            center: [37.09, -95.71],
            zoom: 5,
            layers: [satellite, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
    }).addTo(myMap);

    
// // Create a legend to display information about our map
// const info = L.control({
//     position: "bottomright"
// });

//     // When the layer control is added, insert a div with the class of "legend"
// info.onAdd = function() {
//     const div = L.DomUtil.create("div", "legend");
//     return div;
// };
// // Add the info legend to the map
// info.addTo(myMap);

}
(async function(){
    const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
    const data = await d3.json(queryUrl);
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
})()

