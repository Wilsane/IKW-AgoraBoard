// Select the input elements for event description, start date, start time, end date, and end time
let inputs = document.querySelectorAll(
  "#eventDescription, #eventStartDate, #eventStartTime, #eventEndDate, #eventEndTime"
);

// Get the delete and update buttons by their IDs
let deleteBtn = document.getElementById("deleteEvent");
let updateBtn = document.getElementById("updateEvent");
let joinBtn = document.getElementById("btn-join");

let generateRoomId = async (e) => {
  e.preventDefault();

  // Get the event title and remove whitespaces
  const eventTitle = document.getElementById("eventTitle").textContent.trim();
  const eventTitleNoSpaces = eventTitle.replace(/\s+/g, "");

  // Get values from the specified inputs
  const startDate = document.getElementById("eventStartDate").value.trim();
  const startTime = document.getElementById("eventStartTime").value.trim();
  const endDate = document.getElementById("eventEndDate").value.trim();
  const endTime = document.getElementById("eventEndTime").value.trim();

  // Combine the values into a single string
  const combinedDetails = `${startDate}${startTime}_${endDate}${endTime}`;

  const roomID = `${eventTitleNoSpaces}_${combinedDetails}`;

  // Redirect to room.html with roomID as a query parameter
  const roomUrl = `../IKW-BlackBoard/lobby.html?roomID=${encodeURIComponent(
    roomID
  )}`;
  window.location.href = roomUrl;
};

// Wait for the DOM to fully load before running the script
document.addEventListener("DOMContentLoaded", function () {
  // Get the checkbox that controls whether the event details can be edited
  const editCheckbox = document.getElementById("flexSwitchCheckDefault");

  // Add an event listener to the checkbox to handle changes (when checked or unchecked)
  editCheckbox.addEventListener("change", function () {
    // If the checkbox is checked, enable editing for the input fields
    if (editCheckbox.checked) {
      // Remove the 'readonly' attribute from all input fields to allow editing
      inputs.forEach((input) => {
        input.removeAttribute("readonly");
      });

      // Show the 'delete' button and hide the 'update' button
      deleteBtn.classList.remove("d-none");
      updateBtn.classList.add("d-none");
    } else {
      // If the checkbox is unchecked, disable editing for the input fields
      inputs.forEach((input) => {
        input.setAttribute("readonly", true); // Set inputs as readonly
      });

      // Hide the 'delete' button and show the 'update' button
      deleteBtn.classList.add("d-none");
      updateBtn.classList.remove("d-none");
    }
  });
});

joinBtn.addEventListener("click", generateRoomId);
