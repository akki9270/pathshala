const express = require("express");
const Router = require("express-promise-router");
const router = new Router();

const { ADD_POINT, GET_ALL_POINT, GET_STUDENT_POINT_HISTORY } = require('../controller/user_point.controller');

router.post('/addPoint', ADD_POINT);
router.get('/getAllPoint', GET_ALL_POINT);
router.get('/getUserPointHistory/:id', GET_STUDENT_POINT_HISTORY);

module.exports = router