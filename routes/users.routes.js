const express = require("express");
const Router = require("express-promise-router");
const router = new Router();

const { GET_USER_DATA } = require('../controller/users.controller');

router.get('/getUserData', GET_USER_DATA);

module.exports = router