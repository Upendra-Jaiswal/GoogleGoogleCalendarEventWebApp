// controllers/tokenController.js
const Token = require("../models/tokenModel.js");
const { google } = require("googleapis");

const googleAuth = require("../googleAuth.js");
const dotenv = require("dotenv");
dotenv.config({});

const scheduleEvents = async (req, res) => {
  // Extract the values from the request body
  const { eventName, startDateTime, endDateTime, description } = req.body;

  const event = {
    summary: eventName, // Event Name
    description: description || "No description provided", // Event Description
    start: {
      dateTime: new Date(startDateTime), // Start Date and Time
      timeZone: "Asia/Kolkata", // Time zone
    },
    end: {
      dateTime: new Date(endDateTime), // End Date and Time
      timeZone: "Asia/Kolkata", // Time zone
    },
  };

  try {
    // Insert the event into Google Calendar
    const eventResponse = await googleAuth.calendar.events.insert({
      auth: googleAuth.oauth2Client,
      calendarId: "primary", // Use the primary calendar
      requestBody: event, // Event details
    });

    // Respond back with success message and event link
    res.send({
      message: "Event scheduled successfully",
      // eventLink: eventResponse,
    });
  } catch (err) {
    ////conso"There was an error contacting the Calendar service: " + err);
    res.status(500).send({ message: "Error scheduling event" });
  }
};

const listEvents = async (req, res) => {
  try {
    const response = await googleAuth.calendar.events.list({
      auth: googleAuth.oauth2Client, // Ensure this is correctly initialized
      calendarId: "primary", // Use "primary" for the main calendar
      timeMin: new Date().toISOString(), // Fetch events starting from now
      maxResults: 10, // Limit the number of events
      singleEvents: true, // Expand recurring events into individual instances
      orderBy: "startTime", // Order by the start time of events
    });

    res.send(response);
  } catch (error) {
    console.error("Error retrieving events: ", error);
    res.status(500).send({ error: "Failed to retrieve events." });
  }
};

const deleteEvent = async (req, res) => {
  // Extract the event ID from the request parameters
  const { eventId } = req.params;

  //consoeventId);

  // Check if the event ID is provided
  if (!eventId) {
    return res.status(400).send({ message: "Event ID is required" });
  }

  try {
    // Delete the event from Google Calendar using the event ID
    await googleAuth.calendar.events.delete({
      auth: googleAuth.oauth2Client,
      calendarId: "primary", // Use the primary calendar
      eventId: eventId, // The ID of the event to delete
    });

    // Respond back with success message
    res.send({
      message: "Event deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting the event: ", err);
    res.status(500).send({ message: "Error deleting event" });
  }
};

const updateEvent = async (req, res) => {
  const { eventId } = req.params; // Extract the event ID from the request parameters
  const {
    updateEventName,
    updateStartDateTime,
    updateEndDateTime,
    updateDescription,
  } = req.body; // Extract the updated event details from the request body

  // Check if the event ID and updated details are provided
  if (
    !eventId ||
    !updateEventName ||
    !updateStartDateTime ||
    !updateEndDateTime
  ) {
    return res.status(400).send({ message: "All fields are required" });
  }

  // Create the updated event object
  const updatedEvent = {
    summary: updateEventName, // Updated Event Name
    description: updateDescription || "No description provided", // Updated Event Description (optional)
    start: {
      dateTime: new Date(updateStartDateTime), // Updated Start Date and Time
      timeZone: "Asia/Kolkata", // Time zone
    },
    end: {
      dateTime: new Date(updateEndDateTime), // Updated End Date and Time
      timeZone: "Asia/Kolkata", // Time zone
    },
  };

  //consoupdatedEvent, "updated event");

  try {
    // Update the event in Google Calendar using the event ID
    const eventResponse = await googleAuth.calendar.events.update({
      auth: googleAuth.oauth2Client,
      calendarId: "primary", // Use the primary calendar
      eventId: eventId, // The event ID to update
      requestBody: updatedEvent, // Updated event details
    });

    // Respond back with success message and event details
    res.send({
      message: "Event updated successfully",
      updatedEvent: eventResponse.data, // Optionally return updated event details
    });
  } catch (err) {
    console.error("Error updating the event: ", err);
    res.status(500).send({ message: "Error updating event" });
  }
};

module.exports = {
  scheduleEvents,
  listEvents,
  deleteEvent,
  updateEvent,
};

// const Event = require("../models/eventModel.js");
// const Token = require("../models/tokenModel.js");
// const { google } = require("googleapis");
// const googleAuth = require("../googleAuth.js");
// const dotenv = require("dotenv");
// dotenv.config({});

// const scheduleEvents = async (req, res) => {
//   // Extract the values from the request body
//   const { eventName, startDateTime, endDateTime, description } = req.body;

//   // Validate token
//   const userToken = await Token.findOne({ userId: req.userId }); // Assuming userId is set from authentication middleware
//   if (!userToken) {
//     return res.status(401).send({ message: "Invalid or expired token" });
//   }

//   const event = {
//     summary: eventName, // Event Name
//     description: description || "No description provided", // Event Description
//     start: {
//       dateTime: new Date(startDateTime), // Start Date and Time
//       timeZone: "Asia/Kolkata", // Time zone
//     },
//     end: {
//       dateTime: new Date(endDateTime), // End Date and Time
//       timeZone: "Asia/Kolkata", // Time zone
//     },
//   };

//   try {
//     // Insert the event into Google Calendar
//     const eventResponse = await googleAuth.calendar.events.insert({
//       auth: googleAuth.oauth2Client,
//       calendarId: "primary", // Use the primary calendar
//       requestBody: event, // Event details
//     });

//     // Create the event in the local database and associate it with the user
//     const newEvent = new Event({
//       userId: req.userId, // Associate with the user
//       googleEventId: eventResponse.data.id, // Store the Google Calendar event ID
//       eventName: eventName,
//       startDateTime: new Date(startDateTime),
//       endDateTime: new Date(endDateTime),
//       description: description || "No description provided",
//     });

//     await newEvent.save();

//     // Respond back with success message and event details
//     res.send({
//       message: "Event scheduled successfully",
//       eventLink: eventResponse.data.htmlLink, // Link to the event in Google Calendar
//     });
//   } catch (err) {
//     console.error("Error scheduling event: ", err);
//     res.status(500).send({ message: "Error scheduling event" });
//   }
// };

// const listEvents = async (req, res) => {
//   try {
//     const userToken = await Token.findOne({ userId: req.userId });
//     if (!userToken) {
//       return res.status(401).send({ message: "Invalid or expired token" });
//     }

//     const response = await googleAuth.calendar.events.list({
//       auth: googleAuth.oauth2Client, // Ensure this is correctly initialized
//       calendarId: "primary", // Use "primary" for the main calendar
//       timeMin: new Date().toISOString(), // Fetch events starting from now
//       maxResults: 10, // Limit the number of events
//       singleEvents: true, // Expand recurring events into individual instances
//       orderBy: "startTime", // Order by the start time of events
//     });

//     // Filter events associated with the user from local database
//     const userEvents = await Event.find({ userId: req.userId });

//     res.send({
//       calendarEvents: response.data.items,
//       userEvents: userEvents,
//     });
//   } catch (error) {
//     console.error("Error retrieving events: ", error);
//     res.status(500).send({ error: "Failed to retrieve events." });
//   }
// };

// const deleteEvent = async (req, res) => {
//   // Extract the event ID from the request parameters
//   const { eventId } = req.params;

//   // Validate token
//   const userToken = await Token.findOne({ userId: req.userId });
//   if (!userToken) {
//     return res.status(401).send({ message: "Invalid or expired token" });
//   }

//   // Check if the event ID is provided
//   if (!eventId) {
//     return res.status(400).send({ message: "Event ID is required" });
//   }

//   try {
//     // Delete the event from Google Calendar using the event ID
//     await googleAuth.calendar.events.delete({
//       auth: googleAuth.oauth2Client,
//       calendarId: "primary", // Use the primary calendar
//       eventId: eventId, // The ID of the event to delete
//     });

//     // Delete the event from the local database
//     await Event.deleteOne({ googleEventId: eventId, userId: req.userId });

//     // Respond back with success message
//     res.send({
//       message: "Event deleted successfully",
//     });
//   } catch (err) {
//     console.error("Error deleting the event: ", err);
//     res.status(500).send({ message: "Error deleting event" });
//   }
// };

// const updateEvent = async (req, res) => {
//   const { eventId } = req.params; // Extract the event ID from the request parameters
//   const {
//     updateEventName,
//     updateStartDateTime,
//     updateEndDateTime,
//     updateDescription,
//   } = req.body; // Extract the updated event details from the request body

//   // Validate token
//   const userToken = await Token.findOne({ userId: req.userId });
//   if (!userToken) {
//     return res.status(401).send({ message: "Invalid or expired token" });
//   }

//   // Check if the event ID and updated details are provided
//   if (
//     !eventId ||
//     !updateEventName ||
//     !updateStartDateTime ||
//     !updateEndDateTime
//   ) {
//     return res.status(400).send({ message: "All fields are required" });
//   }

//   // Create the updated event object
//   const updatedEvent = {
//     summary: updateEventName, // Updated Event Name
//     description: updateDescription || "No description provided", // Updated Event Description (optional)
//     start: {
//       dateTime: new Date(updateStartDateTime), // Updated Start Date and Time
//       timeZone: "Asia/Kolkata", // Time zone
//     },
//     end: {
//       dateTime: new Date(updateEndDateTime), // Updated End Date and Time
//       timeZone: "Asia/Kolkata", // Time zone
//     },
//   };

//   try {
//     // Update the event in Google Calendar using the event ID
//     const eventResponse = await googleAuth.calendar.events.update({
//       auth: googleAuth.oauth2Client,
//       calendarId: "primary", // Use the primary calendar
//       eventId: eventId, // The event ID to update
//       requestBody: updatedEvent, // Updated event details
//     });

//     // Update the event in the local database
//     const updatedLocalEvent = await Event.findOneAndUpdate(
//       { googleEventId: eventId, userId: req.userId },
//       {
//         eventName: updateEventName,
//         startDateTime: new Date(updateStartDateTime),
//         endDateTime: new Date(updateEndDateTime),
//         description: updateDescription || "No description provided",
//       },
//       { new: true }
//     );

//     // Respond back with success message and event details
//     res.send({
//       message: "Event updated successfully",
//       updatedEvent: eventResponse.data, // Optionally return updated event details
//     });
//   } catch (err) {
//     console.error("Error updating the event: ", err);
//     res.status(500).send({ message: "Error updating event" });
//   }
// };

// module.exports = {
//   scheduleEvents,
//   listEvents,
//   deleteEvent,
//   updateEvent,
// };
