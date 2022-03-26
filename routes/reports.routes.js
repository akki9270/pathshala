const express = require("express");
const Router = require("express-promise-router");
const router = new Router();

const { GET_DATE_WISE_STUDENT_DATA, GET_MONTH_WISE_STUDENT_DATA, GET_SUTRA_WISE_STUDENT_DATA} = require('../controller/reports.controller');
router.get('/getDateWiseStudentData', GET_DATE_WISE_STUDENT_DATA);
router.get('/getMonthWiseStudentData', GET_MONTH_WISE_STUDENT_DATA);
router.get('/getSutraWiseStudentData', GET_SUTRA_WISE_STUDENT_DATA);
module.exports = router