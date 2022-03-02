const express = require("express");
const Router = require("express-promise-router");
const router = new Router();

const { CREATE_EVENT, UPDATE_EVENT, DELETE_EVENT, GET_ALL_EVENT, GET_EVENT_BY_ID } = require('../controller/events.controller');


router.post('/createEvent', CREATE_EVENT);
router.post('/updateEvent', UPDATE_EVENT);
router.delete('/deleteEvent', DELETE_EVENT);
router.get('/getAllEvent', GET_ALL_EVENT);
router.get('/getEventById/:id', GET_EVENT_BY_ID);

module.exports = router