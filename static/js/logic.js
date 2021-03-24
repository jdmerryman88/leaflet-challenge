// store geoJSON
const link = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// perform a GET request to the query URL
d3.json(link).then((data) => {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
    console.log(data.features);
});

function createMap(earthquakes) {
    // assign the different mapbox styles
    const satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/satellite-v9",
      accessToken: API_KEY
    });

    const grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });

    const streets = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });

    const baseMap = {
        'Satellite': satellite,
        'Grayscale': grayscale,
        'Streets': streets
    };

    const overlayMap = {
        Earthquakes: earthquakes
    };

    const myMap = L.map('map', {
        center: [36.7126875, -120.476189],
        zoom: 4,
        layers: [streets, earthquakes]
    });

    L.control.layers(baseMap, overlayMap, {
        collapsed: false
    }).addTo(myMap);

    // function to assign colors for legend and markers
    function getColor(d) {
        return d > 5 ? '#991900' :
            d > 4 ? '#9500B3' :
            d > 3 ? '#FF8000' :
            d > 2 ? '#FFEE99' :
            d > 1 ? '#3399FF' :
                    '#B7F34D';
    }

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function(myMap) {
        const div = L.DomUtil.create('div', 'info legend')
        const magnitudes = [0, 1, 2, 3, 4, 5]
        

        for (let i = 0; i < magnitudes.length; i++) {
            div.innerHTML +=
            
            '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i>' + '<br>' + magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
        }
        return div
    };
    legend.addTo(myMap);

}

function createFeatures(eqdata) {
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h4>Place: ${feature.properties.place} </h4><h4>Date:  ${new Date(feature.properties.time)} </h4><h4>Magnitude: ${feature.properties.mag} </h4><h4>USGS Event Page: <a href=  ${feature.properties.url}  " target='_blank'>Click here</a></h4>`, {maxWidth: 400})
    }

    const layerToMap = L.geoJSON(eqdata, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            let radius = feature.properties.mag * 4.5;
            let fill = feature.geometry.coordinates[2] / 30;
            if (feature.properties.mag > 5) {
                fillcolor = '#991900';
            }
            else if (feature.properties.mag >= 4) {
                fillcolor = '#9500B3';
            }
            else if (feature.properties.mag >= 3) {
                fillcolor = '#FF8000';
            }
            else if (feature.properties.mag >= 2) {
                fillcolor = '#FFEE99';
            }
            else if (feature.properties.mag >= 1) {
                fillcolor = '#3399FF';
            }
            else  fillcolor = '#b7f34d';

            return L.circleMarker(latlng, {
                radius: radius,
                color: 'black',
                fillColor: fillcolor,
                fillOpacity: fill,
                weight: 1
            });
        }
    });
    createMap(layerToMap);
}