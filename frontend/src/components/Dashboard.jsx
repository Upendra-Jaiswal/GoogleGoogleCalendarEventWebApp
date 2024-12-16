import React, { useState, useContext, useEffect } from "react";
import "../css/Dashboard.css";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { isLoggedIn, login, logout } = useContext(AuthContext);
  const [eventName, setEventName] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [description, setDescription] = useState("");

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleLogout = () => {
    logout();
    // setIsLoggedIn(false);
    //  setUser(null);
  };
  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create event data object
    const eventData = {
      eventName,
      startDateTime,
      endDateTime,
      description,
    };

    try {
      //consoeventData, "sending these data");

      // Send POST request to backend
      const response = await fetch(
        "http://localhost:3001/eventApi/scheduleevent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Event scheduled successfully!");
        // Close the popup after successful event creation
        togglePopup();
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error during event creation:", error);
      alert("An error occurred while scheduling the event.");
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to Google Calendar Event Creator</h1>
        <p>
          Seamlessly schedule events and integrate them directly into your
          Google Calendar. Manage your time like a pro!
        </p>
        {/* {!isLoggedIn && (
          <button className="login-btn" onClick={login}>
            Login with Google
          </button>
        )} */}

        <section className="features-section">
          <h2>What You Can Do</h2>
          <ul>
            <li>Create calendar events effortlessly</li>
            <li>Set start and end times with detailed descriptions</li>
            <li>Automatically sync your events to Google Calendar</li>
          </ul>
        </section>
      </header>

      {isLoggedIn ? (
        <>
          <section className="actions-section">
            <button className="create-event-btn" onClick={togglePopup}>
              Create Event
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </section>
        </>
      ) : (
        <section className="actions-section">
          <button className="login-btn" onClick={login}>
            Login with Google
          </button>
          {/* <button className="create-event-btn" onClick={togglePopup}>
          Create Event
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button> */}
        </section>
      )}

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h2>Create Event</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="event-name">Event Name:</label>
              <input
                type="text"
                id="event-name"
                placeholder="Enter event name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
              />

              <label htmlFor="start-date">Start Date and Time:</label>
              <input
                type="datetime-local"
                id="start-date"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                required
              />

              <label htmlFor="end-date">End Date and Time:</label>
              <input
                type="datetime-local"
                id="end-date"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                required
              />

              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                placeholder="Enter event description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <button type="submit" className="submit-btn">
                Create Event
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

export default Dashboard;
