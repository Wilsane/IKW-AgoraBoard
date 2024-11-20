let form = document.getElementById("lobby__form");
let displayName = sessionStorage.getItem("display_name");

if (displayName) {
  form.name.value = displayName;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  sessionStorage.setItem("display_name", form.name.value);

  let inviteCode = form.room.value;

  if (!inviteCode) {
    inviteCode = String(Math.floor(Math.random() * 100000));
  }

  window.location = `room.html?room=${inviteCode}`;
});
