// Initialize the map
const map = L.map("map").setView([28.6139, 77.2088], 10); // Change coordinates as needed

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
	attribution:
		'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Add a marker
const marker = L.marker([28.6139, 77.2088]).addTo(map);
marker.bindPopup("<b>New Delhi</b><br>Hotel Listing").openPopup();
