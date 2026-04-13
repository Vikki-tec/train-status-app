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

    const body = data.body;

    // 🔥 Badge Logic
    let badgeClass = "running";

    if (body.train_status_message.toLowerCase().includes("not started")) {
      badgeClass = "not-started";
    } else if (body.train_status_message.toLowerCase().includes("late")) {
      badgeClass = "late";
    }

    // 📍 Timeline build
    let stationsHTML = "";

    body.stations.slice(0, 5).forEach((s, index) => {
      const isCurrent = s.stationCode === body.current_station;

      stationsHTML += `
        <div class="timeline-item">
         <div class="dot ${isCurrent ? "active" : ""}"></div>
         <span>
           ${s.stationName}
           ${isCurrent ? '<span class="train">🚆</span>' : ""}
         </span>
        </div>
        ${index !== 4 ? `<div class="line"></div>` : ""}
      `;
    });

    // 🔥 FINAL UI
    document.getElementById("result").innerHTML = `
      <div class="card">
        <h2>🚆 Train Status</h2>

        <p><b>Status:</b></p>
        <div class="badge ${badgeClass}">
          ${body.train_status_message}
        </div>

        <p><b>Current Station:</b> ${body.current_station}</p>
        <p><b>Updated:</b> ${body.time_of_availability}</p>
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