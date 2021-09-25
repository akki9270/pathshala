const express = require("express");
const Router = require("express-promise-router");
const router = new Router();
const { CHECK_ATTENDENCE } = require('../controller/attendence.controller');


/**
 * 
 * {
 *  userId: INTEGER // Teacher's ID
 *  studentId: INTEGER // students's ID
 * }
 */
router.post('/check_attendence', CHECK_ATTENDENCE);


module.exports = router;