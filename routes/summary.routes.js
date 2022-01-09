const express = require("express");
const Router = require("express-promise-router");
const router = new Router();

const { GET_ATTENDANCE_SUMMARY, GET_SUTRA_SUMMARY, GET_USER_SUTRA_HISTORY } = require('../controller/summary.controller')

router.get('/getAttandanceSummary', GET_ATTENDANCE_SUMMARY);
router.get('/getSutraSummary', GET_SUTRA_SUMMARY);
router.get('/getUserSutraSummary', GET_USER_SUTRA_HISTORY);

module.exports = router;