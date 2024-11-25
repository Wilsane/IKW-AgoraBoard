let form = document.getElementById("lobby__form");
let displayName = sessionStorage.getItem("display_name");

// Retrieve `roomID` from the URL query parameters
const params = new URLSearchParams(window.location.search);
const roomID = params.get("roomID");

// Pre-fill the room input field if `roomID` is present in the URL
if (roomID) {
  form.room.value = roomID;
  form.room.disabled = true;
}

// Pre-fill the display name if it exists in sessionStorage
if (displayName) {
  form.name.value = displayName;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Save the display name to session storage
  sessionStorage.setItem("display_name", form.name.value);

  // Use the provided room code or generate a new one
  let roomID = form.room.value;

  if (!roomID) {
    roomID = String(Math.floor(Math.random() * 100000));
  }

  // Redirect to room.html with roomID as the query parameter
  window.location = `room.html?roomID=${roomID}`;
});
