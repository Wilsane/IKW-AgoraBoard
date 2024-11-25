// Get references to the DOM elements used for scheduling
let title = document.getElementById("scheduleTitle");
let description = document.getElementById("scheduleDescription");
let eventType = document.getElementById("eventType");
let startDate = document.getElementById("scheduleStartDate");
let startTime = document.getElementById("scheduleStartTime");
let endDate = document.getElementById("scheduleEndDate");
let endTime = document.getElementById("scheduleEndTime");
let toastEvent = document.getElementById("toastEvent");

// Initialize an empty array to store schedule events and a variable for the calendar instance
let scheduleList = [];
let calendar;

// Function to retrieve values from the input elements for the event details
let getElements = async () => {
  return {
    title: title.value,
    description: description.value,
    eventType: eventType.value,
    startDate: startDate.value,
    startTime: startTime.value,
    endDate: endDate.value,
    endTime: endTime.value,
  };
};

// Function to clear all input fields after form submission
function clearElements() {
  title.value = "";
  description.value = "";
  eventType.value = "";
  startDate.value = "";
  startTime.value = "";
  endDate.value = "";
  endTime.value = "";
}

// Function to handle the event submission
let submitSchedule = async (e) => {
  e.preventDefault(); // Prevent form from reloading the page
  const {
    title,
    description,
    eventType,
    startDate,
    startTime,
    endDate,
    endTime,
  } = await getElements();

  // Log the event details to the console for debugging
  console.log(
    `title:\t${title}\ndescription:\t${description}\nStart Date:\t${startDate}\nStart Time:\t${startTime}\nEnd Date:\t${endDate}\nEnd Time:\t${endTime}`
  );

  // Add the event to the schedule list
  scheduleList.push({
    title,
    description,
    eventType,
    startDate,
    startTime,
    endDate,
    endTime,
  });

  // Save the updated schedule list to localStorage
  await save();

  // If the calendar instance exists, add the new event to the calendar
  if (calendar) {
    calendar.addEvent({
      title: title,
      start: `${startDate}T${startTime}`,
      end: `${endDate}T${endTime}`,
      eventType: `${eventType}`,
      description: description,
    });
  }

  // Update and show the toast notification with the event title
  toastEvent.innerText = title;
  let toastElement = document.getElementById("liveToast");
  let toast = new bootstrap.Toast(toastElement);
  toast.show();

  // Clear the input fields after submission
  clearElements();
};

// Function to save the schedule list to localStorage as a JSON string
let save = async () => {
  localStorage.setItem("scheduleList", JSON.stringify(scheduleList));
};

// Function to load the schedule list from localStorage
let load = async () => {
  const savedList = localStorage.getItem("scheduleList");
  try {
    // Parse the saved schedule list back into an array
    scheduleList = savedList ? JSON.parse(savedList) : [];
  } catch (error) {
    console.error("Error parsing scheduleList from localStorage:", error);
    scheduleList = []; // Reset to an empty array if parsing fails
  }
};

// Function to render event cards (future implementation placeholder)
let renderEventCards = async () => {
  scheduleList.forEach((eventData) => {
    const {
      title,
      description,
      eventType,
      startDate,
      startTime,
      endDate,
      endTime,
    } = eventData;
    // Code to render event cards can be added here
  });
};

// Function to display event details in an Offcanvas component when an event is clicked
const showEventDetails = (event) => {
  document.getElementById("eventTitle").textContent = event.title;
  document.getElementById("eventDescription").value =
    event.extendedProps.description;
  document.getElementById("eventStartDate").value = event.start
    .toISOString()
    .split("T")[0];
  document.getElementById("eventStartTime").value =
    event.start.toLocaleTimeString();
  document.getElementById("eventEndDate").value = event.end
    .toISOString()
    .split("T")[0];
  document.getElementById("eventEndTime").value =
    event.end.toLocaleTimeString();
  document.getElementById("btn-join").innerHTML = event.extendedProps.eventType;

  // Show the Offcanvas to display event details
  const offcanvas = new bootstrap.Offcanvas(
    document.getElementById("eventOffcanvas")
  );

  offcanvas.show();
};

// Function to initialize the calendar and render events
let draw = async (data) => {
  const calendarEl = document.getElementById("calendar");
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    nowIndicator: true,
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    events: data, // Populate calendar with events
    eventClick: function (info) {
      showEventDetails(info.event); // Display event details in the Offcanvas
    },
  });

  // Log the event start and end times for debugging
  data.forEach((event) => {
    console.log(`Start Date:\t${event.start}\nEnd Date:\t${event.end}`);
  });

  // Render the calendar
  calendar.render();
};

// Initialize the app by loading existing events, rendering them, and drawing the calendar
(async () => {
  await load(); // Load events from localStorage
  renderEventCards(); // Render event cards

  // Prepare the event data for the FullCalendar draw method
  const calendarEvents = scheduleList.map((event) => ({
    title: event.title,
    start: `${event.startDate}T${event.startTime}`,
    end: `${event.endDate}T${event.endTime}`,
    description: event.description,
    eventType: event.eventType,
  }));

  // Call the draw method with the event data
  await draw(calendarEvents);
})();

// Add event listener to the submit button to handle schedule submission
document
  .querySelector("#submitSchedule")
  .addEventListener("click", submitSchedule);
