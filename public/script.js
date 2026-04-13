async function getStatus() {
  const trainNumber = document.getElementById("trainNumber").value;

  try {
    const res = await fetch(`http://localhost:3000/train/${trainNumber}`);
    const data = await res.json();

    const body = data.body;

    let stationsHTML = "";
    body.stations.slice(0, 5).forEach(station => {
      stationsHTML += `<li>${station.stationName}</li>`;
    });

    document.getElementById("result").innerHTML = `
      <div class="card">
        <h2>🚆 Train Status</h2>
        <p><b>Status:</b> ${body.train_status_message}</p>
        <p><b>Current Station:</b> ${body.current_station}</p>
        <p><b>Last Updated:</b> ${body.time_of_availability}</p>
      </div>

      <div class="card">
        <h3>📍 Next Stations</h3>
        <ul>${stationsHTML}</ul>
      </div>
    `;
  } catch (error) {
    console.error(error);
    document.getElementById("result").innerHTML = "Error ❌";
  }
}

// 🌙 Dark Mode
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}