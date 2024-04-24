
var currentMarker = null;
var currentGeoJSONLayer = null;

document.addEventListener('DOMContentLoaded', function () {

    
    var map = L.map('mapid').setView([19.060294097931354, 73.523709130140517], 13); // Update coordinates to your location

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    var currentGeoJSONLayer = null;
    var currentMarker = null;

    document.getElementById('district').addEventListener('change', function () {
        console.log('test')
        const selectedDistrict = this.value;
        fetch(`/villages/${selectedDistrict}`)
            .then(response => response.json())
            .then(data => {
                const villageSelect = document.getElementById('village');
                villageSelect.innerHTML = '<option value="" disabled selected style="display:none;">Villages</option>'; // Clear existing options
                data.forEach(village => {
                    const option = document.createElement('option');
                    option.value = village;
                    option.textContent = village;
                    villageSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error loading the villages:', error));
    });
    renderGeoJSON = data => {

        

        const geoJsonData = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": data.features[0].properties,
                    "geometry": data.features[0].geometry
                }
            ]
        };

        const villageCoordinates = geoJsonData.features[0].geometry.coordinates[0][0][0];
       
        console.log('geo json--', geoJsonData.features[0].properties.Village)

        var village_name = geoJsonData.features[0].properties.Village
        const latlng = L.latLng(villageCoordinates[1], villageCoordinates[0]);
        
        if (currentMarker) {
            map.removeLayer(currentMarker);
        };
    
        
        if (currentGeoJSONLayer) {
            map.removeLayer(currentGeoJSONLayer);
        };

        currentGeoJSONLayer = L.geoJSON(geoJsonData).addTo(map);

        currentMarker = L.marker(latlng).addTo(map).bindPopup(village_name);
        map.setView(latlng, 13);

        L.popup()
        .setLatLng(latlng)
        .setContent(village_name)
        .openOn(map);

    };

        
        

    document.getElementById('village').addEventListener('change', function () {
        console.log('inside village')
        const selectedVillage = this.value;
        console.log('selectedVillage',selectedVillage);
        fetch(`/geolocation/${selectedVillage}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
           
            console.log(data)
            renderGeoJSON(data);

        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    })
});

