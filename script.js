var map = L.map('map').setView([37.8, -96], 4);

// Define the default tile layer (day mode)
let dayTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(map);

// Define the dark tile layer (night mode with vibrant details)
let nightTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
});

// Dark mode toggle functionality
document.getElementById('darkModeToggle').addEventListener('click', function() {
    if (map.hasLayer(dayTileLayer)) {
        map.removeLayer(dayTileLayer);
        nightTileLayer.addTo(map);
    } else {
        map.removeLayer(nightTileLayer);
        dayTileLayer.addTo(map);
    }
});

// Function to get color based on duration
function getColor(duration) {
    if (duration >= 900) {
        return "blue";
    } else {
        return "red";
    }
}

// Create a marker cluster group
var markers = L.markerClusterGroup();

// Fetch the CSV data
fetch('scrubbed.csv')
    .then(response => response.text())
    .then(data => {
        let rows = data.split('\n').slice(1);  // Split by rows and remove header

        // Process each row
        rows.forEach(row => {
            let columns = row.split(',');
            let datetime = columns[0];
            let city = columns[1];
            let state = columns[2];
            let shape = columns[4];
            let duration = parseFloat(columns[5]);
            let comments = columns[7];
            let latitude = parseFloat(columns[9]);
            let longitude = parseFloat(columns[10]);

            // Check if latitude and longitude are valid numbers
            if (!isNaN(latitude) && !isNaN(longitude)) {
                let markerOptions = {
                    radius: 6,
                    fillColor: getColor(duration),
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                };

                // Create a circle marker
                let marker = L.circleMarker([latitude, longitude], markerOptions);

                // Bind a tooltip with basic information
                marker.bindTooltip(`Date: ${datetime}<br>City: ${city}<br>State: ${state}<br>Shape: ${shape}`);

                // Bind a popup with detailed information
                marker.bindPopup(`Date: ${datetime}<br>City: ${city}<br>State: ${state}<br>Shape: ${shape}<br>Duration: ${duration} seconds<br>Comments: ${comments}`);

                // Add the marker to the marker cluster group
                markers.addLayer(marker);
            }
        });

        // Add the marker cluster group to the map
        map.addLayer(markers);
    });
