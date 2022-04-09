const express = require("express");
const Router = require("express-promise-router");
const router = new Router();

const { ADD_POINT } = require('../controller/user_point.controller');

router.post('/addPoint', ADD_POINT);

module.exports = router