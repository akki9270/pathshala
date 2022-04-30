const express = require("express");
const Router = require("express-promise-router");
const router = new Router();

const { ADD_POINT, GET_ALL_POINT } = require('../controller/user_point.controller');

router.post('/addPoint', ADD_POINT);
router.get('/getAllPoint', GET_ALL_POINT);

module.exports = router