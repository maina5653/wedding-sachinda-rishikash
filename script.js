const weddingDate = new Date("2026-12-10T13:00:00+05:30");

function updateCountdown() {
  const now = new Date();
  const difference = weddingDate - now;

  if (difference <= 0) {
    ["days", "hours", "minutes", "seconds"].forEach((id) => {
      document.getElementById(id).textContent = "0";
    });
    return;
  }

  const days = Math.floor(difference / 86400000);
  const hours = Math.floor((difference / 3600000) % 24);
  const minutes = Math.floor((difference / 60000) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  document.getElementById("days").textContent = String(days);
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

const form = document.getElementById("rsvp-form");
const status = document.getElementById("form-status");

try {
  const saved = JSON.parse(localStorage.getItem("wedding-rsvp"));
  if (saved?.name) {
    document.getElementById("guest-name").value = saved.name;
  }
  if (saved?.response) {
    const option = form.querySelector(`input[value="${saved.response}"]`);
    if (option) option.checked = true;
  }
  if (saved?.message) {
    document.getElementById("guest-message").value = saved.message;
  }
} catch (_) {
  // RSVP storage is optional; the form still works without it.
}

form.addEventListener("submit", (event) => {
  event.preventEvent?.();
  event.preventDefault();

  const data = new FormData(form);
  const response = {
    name: data.get("name").trim(),
    response: data.get("response"),
    message: data.get("message").trim(),
    submittedAt: new Date().toISOString()
  };

  if (!response.name || !response.response) {
    status.textContent = "Please add your name and response.";
    return;
  }

  localStorage.setItem("wedding-rsvp", JSON.stringify(response));

  const action = response.response === "Coming"
    ? "Thank you — we’re delighted you’ll join us!"
    : "Thank you — your blessings mean so much to us.";

  status.textContent = action;
  form.querySelector("button").textContent = "RSVP Saved";
});
