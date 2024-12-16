const express = require("express");
const {
  scheduleEvents,
  listEvents,
  deleteEvent,
  updateEvent,
} = require("../controllers/eventController.js");

const router = express.Router();

router.get("/listEvents", listEvents);
router.post("/scheduleevent", scheduleEvents);
router.delete("/events/:eventId", deleteEvent);
router.put("/events/:eventId", updateEvent);

module.exports = router;
