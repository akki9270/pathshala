
const express = require("express");
const Router = require("express-promise-router");
const router = new Router();

const { GET_EVENT_ATTENDENCE_BYID, SAVE_EVENT_ATTENDENCE } = require('../controller/events_attendence.controller');

router.get('/eventAttendence/:eventId', GET_EVENT_ATTENDENCE_BYID);
router.post('/saveEventAttendence', SAVE_EVENT_ATTENDENCE);

module.exports = router