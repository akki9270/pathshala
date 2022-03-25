const express = require("express");
const Router = require("express-promise-router");
const router = new Router();

const { GET_STUDENT_WISE_DATA } = require('../controller/reports.controller');
router.get('/getStudentWiseData', GET_STUDENT_WISE_DATA);
module.exports = router