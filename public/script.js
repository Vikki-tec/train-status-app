async function getStatus() {
  const trainNumber = document.getElementById("trainNumber").value;

  try {
    const res = await fetch(`/train/${trainNumber}`);
    const data = await res.json();

    const body = data.body;
  

    // 👇 YAHI ADD KARNA HAI
    let status = body.train_status_message.toLowerCase();

    let badgeClass = "green";

    if (status.includes("not started")) {
      badgeClass = "yellow";
    } else if (status.includes("late") || status.includes("delayed")) {
      badgeClass = "red";
    }

    // Timeline HTML
    let stationsHTML = "";

    body.stations.slice(0, 5).forEach((s, index) => {
      stationsHTML += `
        <div class="timeline-item">
          <div class="dot ${index === 0 ? "active" : ""}"></div>
          <span>${s.stationName}</span>
        </div>
        ${index !== 4 ? '<div class="line"></div>' : ''}
      `;
    });

    // Final UI render
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
    document.getElementById("result").innerHTML = "Error ❌";
  }
}