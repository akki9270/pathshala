const express = require("express");
const Router = require("express-promise-router");
const router = new Router();

const { GET_ALL_SUTRA } = require('../controller/sutra.controller');

router.get('/getAllSutra', GET_ALL_SUTRA);

module.exports = router