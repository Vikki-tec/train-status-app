async function getStatus() {
  const trainNumber = document.getElementById("trainNumber").value;

  if (!trainNumber) {
    alert("Enter train number");
    return;
  }

  document.getElementById("result").innerHTML = "Loading... ⏳";

  try {
    const res = await fetch(`/train/${trainNumber}`);
    const data = await res.json();

    const body = data.body || {};

    // 🔥 SAFE stations
    const stations = body.stations || [];

    // 🔥 FIND CURRENT INDEX (SAFE)
    let currentIndex = stations.findIndex(
      s => s.stationCode === body.current_station
    );

    if (currentIndex === -1) currentIndex = 0;

    const totalStations = stations.length || 1;

    // 🔥 PROGRESS %
    const progressPercent =
      totalStations > 1
        ? (currentIndex / (totalStations - 1)) * 100
        : 0;

    // 🔥 BADGE LOGIC
    let badgeClass = "running";

    const statusText = (body.train_status_message || "").toLowerCase();

    if (statusText.includes("not started")) {
      badgeClass = "not-started";
    } else if (statusText.includes("late")) {
      badgeClass = "late";
    }

    // 🔥 VISIBLE STATIONS (CURRENT + NEXT)
    const visibleStations = stations.slice(currentIndex, currentIndex + 5);

    let stationsHTML = "";

    visibleStations.forEach((s, index) => {
      const isCurrent = index === 0;

      stationsHTML += `
        <div class="timeline-item">
          <div class="dot ${isCurrent ? "active" : ""}"></div>
          <span>
            ${s.stationName || "N/A"}
            ${isCurrent ? '<span class="train">🚆</span>' : ""}
          </span>
        </div>
        ${
          index !== visibleStations.length - 1
            ? `<div class="line"></div>`
            : ""
        }
      `;
    });

    // 🔥 FINAL UI
    document.getElementById("result").innerHTML = `
      <div class="card">
        <h2>🚆 Train Status</h2>

        <p><b>Status:</b> 
          <span class="badge ${badgeClass}">
            ${body.train_status_message || "No data"}
          </span>
        </p>

        <p><b>Current Station:</b> ${
          body.current_station || "N/A"
        }</p>
        <p><b>Updated:</b> ${
          body.time_of_availability || "N/A"
        }</p>
      </div>

      <div class="card">
        <h3>🚆 Live Progress</h3>

        <div class="progress-container">
          <div class="progress-bar" style="width: ${progressPercent}%"></div>
          <div class="train-icon" style="left: ${progressPercent}%">🚆</div>
        </div>
      </div>

      <div class="card">
        <h3>📍 Route Timeline</h3>
        <div class="timeline">
          ${stationsHTML}
        </div>
      </div>
    `;
  } catch (err) {
    console.error(err);
    document.getElementById("result").innerHTML = "Error ❌";
  }
}