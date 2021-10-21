const express = require("express");
const Router = require("express-promise-router");
const router = new Router();
const { CHECK_ATTENDENCE, GET_ATTENDANCE } = require('../controller/attendence.controller');


/**
 * 
 * {
 *  userId: INTEGER // Teacher's ID
 *  studentId: INTEGER // students's ID
 * }
 */
router.post('/check_attendance', CHECK_ATTENDENCE);
router.get('/attendance', GET_ATTENDANCE);

module.exports = router;