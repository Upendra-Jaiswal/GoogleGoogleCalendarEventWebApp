import React, { useState, useContext, useEffect } from "react";
import "../css/ListEvents.css"; // Import CSS
import axios from "axios";

import { AuthContext } from "../context/AuthContext";

const ListEvents = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const { isLoggedIn, login, logout, user } = useContext(AuthContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null); // To store the event being updated
  const [updateEventName, setUpdateEventName] = useState("");
  const [updateStartDateTime, setUpdateStartDateTime] = useState("");
  const [updateEndDateTime, setUpdateEndDateTime] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/eventApi/listEvents"
      );
      const items = response.data.data.items; // Extract items from response
      setEvents(items || []); // Set events with default fallback
      //consoitems[0]);
    } catch (err) {
      console.error("Error fetching events: LogIn to see events", err);
      setError("Failed to fetch events, Login to see events of your account");
    }
  };

  useEffect(() => {
    // Fetch events from backend API

    // //conso"refreshing");

    fetchEvents();
  }, [user]);

  useEffect(() => {
    // Update form fields whenever currentEvent changes
    if (currentEvent) {
      setUpdateEventName(currentEvent.summary || "");

      //   Format the datetime values to match the expected format for datetime-local input
      const formatDateTime = (dateTime) => {
        if (!dateTime) return "";
        return new Date(dateTime).toISOString().slice(0, 16); // Extract yyyy-MM-ddThh:mm format
      };

      setUpdateStartDateTime(formatDateTime(currentEvent.start?.dateTime));
      setUpdateEndDateTime(formatDateTime(currentEvent.end?.dateTime));

      setUpdateDescription(currentEvent.description || "");
    }
  }, [currentEvent]);

  const deleteEvent = async (eventId) => {
    try {
      //consoeventId);
      // Call the DELETE API to delete the event by its ID
      const response = await axios.delete(
        `http://localhost:3001/eventApi/events/${eventId}`
      );

      // After deleting, update the events state to remove the deleted event
      setEvents(events.filter((event) => event.id !== eventId));

      // Optionally, show a success message
      alert(response.data.message);
      fetchEvents();
    } catch (err) {
      setError("Failed to delete the event.");
      console.error("Error deleting the event:", err);
    }
  };

  // Toggle popup visibility
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  // Handle form submission for updating event
  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      const updatedEvent = {
        updateEventName,
        updateStartDateTime,
        updateEndDateTime,
        updateDescription,
      };

      //consoupdatedEvent, "updatesevent");

      // Call API to update event
      const response = await axios.put(
        `http://localhost:3001/eventApi/events/${currentEvent.id}`,
        updatedEvent
      );

      // Update events state after updating the event
      setEvents(
        events.map((event) =>
          event.id === currentEvent.id ? response.data : event
        )
      );

      // Close the popup
      togglePopup();
      alert("Event updated successfully!");
      fetchEvents();
    } catch (err) {
      setError("Failed to update event.");
      console.error("Error updating event:", err);
    }
  };

  // Open update popup with event data
  const openUpdatePopup = (event) => {
    setCurrentEvent(event);
    setIsPopupOpen(true);
  };

  return (
    <div className="events-container">
      <h1>Upcoming Events</h1>
      {error ? (
        <p className="error-message">{error}</p>
      ) : events.length > 0 ? (
        <table className="events-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Start Date & Time</th>
              <th>End Date & Time</th>
              <th>Link</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={index}>
                <td>{event.summary || "No Title"}</td>
                <td>
                  {event.start?.dateTime
                    ? new Date(event.start.dateTime).toLocaleString()
                    : "No Start Time"}
                </td>
                <td>
                  {event.end?.dateTime
                    ? new Date(event.end.dateTime).toLocaleString()
                    : "No End Time"}
                </td>
                <td>
                  {event.htmlLink ? (
                    <a
                      href={event.htmlLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  ) : (
                    "No Link"
                  )}
                </td>
                <td>
                  <button
                    onClick={() => openUpdatePopup(event)} // Open update popup
                    className="update-button"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No upcoming events found.</p>
      )}

      {/* Update Event Popup */}
      {isPopupOpen && currentEvent && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h2>Update Event</h2>
            <form onSubmit={handleUpdateEvent}>
              <label htmlFor="event-name">Event Name:</label>
              <input
                type="text"
                id="event-name"
                value={updateEventName}
                placeholder="Enter event name"
                onChange={(e) => setUpdateEventName(e.target.value)}
              />

              <label htmlFor="start-date">Start Date and Time:</label>
              <input
                type="datetime-local"
                id="start-date"
                value={updateStartDateTime} // Format for datetime-local input
                onChange={(e) => setUpdateStartDateTime(e.target.value)}
              />

              <label htmlFor="end-date">End Date and Time:</label>
              <input
                type="datetime-local"
                id="end-date"
                value={updateEndDateTime} // Format for datetime-local input
                onChange={(e) => setUpdateEndDateTime(e.target.value)}
              />

              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={updateDescription}
                placeholder="Enter event description"
                onChange={(e) => setUpdateDescription(e.target.value)}
              />

              <button type="submit" className="submit-btn">
                Update Event
              </button>
              <button type="button" className="close-btn" onClick={togglePopup}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListEvents;
