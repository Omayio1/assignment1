function filterProjects() {
  const filter = document.getElementById("filter").value.toLowerCase();
  const projects = document.querySelectorAll(".project");

  projects.forEach((project) => {
    const text = project.textContent.toLowerCase();
    project.style.display = text.includes(filter) ? "" : "none";
  });
}

let locationVisible = false;
let map;
let marker;

function toggleLocation() {
  const locationDetails = document.getElementById("location-details");
  const toggleLocationBtn = document.getElementById("toggleLocationBtn");

  if (locationVisible) {
    locationDetails.style.display = "none";
    toggleLocationBtn.textContent = "Show Location";
    document.getElementById("location-output").innerHTML = "";
    if (map) {
      map.remove();
      map = null;
    }
  } else {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      document.getElementById("location-output").innerHTML =
        "Geolocation is not supported by this browser.";
    }
    locationDetails.style.display = "block";
    toggleLocationBtn.textContent = "Hide Details";
  }
  locationVisible = !locationVisible;
}

function showPosition(position) {
  const locationOutput = document.getElementById("location-output");
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  locationOutput.innerHTML = `Latitude: ${lat}<br>Longitude: ${lon}`;

  map = L.map("map").setView([lat, lon], 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);

  marker = L.marker([lat, lon]).addTo(map);
}

function showError(error) {
  const locationOutput = document.getElementById("location-output");
  switch (error.code) {
    case error.PERMISSION_DENIED:
      locationOutput.innerHTML = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      locationOutput.innerHTML = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      locationOutput.innerHTML = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      locationOutput.innerHTML = "An unknown error occurred.";
      break;
  }
}

function getWeather() {
  const location = document.getElementById("weather-location").value;
  if (!location) {
    alert("Please enter a location.");
    return;
  }

  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (
        data &&
        data.hourly &&
        data.hourly.temperature_2m &&
        data.hourly.temperature_2m.length > 0
      ) {
        const temperature = data.hourly.temperature_2m[0];
        const weatherDetails = document.getElementById("weather-details");
        weatherDetails.innerHTML = `
          <h2>Temperature in ${location}</h2>
          <p>Temperature: ${temperature}°C</p>
        `;
        document.getElementById("weather-modal").style.display = "block";
      } else {
        throw new Error("Temperature data is incomplete or not available");
      }
    })
    .catch((error) => {
      console.error("Error fetching temperature data:", error);
      alert("Could not fetch temperature data. Please try again later.");
    });
}

function closeModal() {
  document.getElementById("weather-modal").style.display = "none";
}
