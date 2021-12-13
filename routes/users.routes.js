const express = require("express");
const Router = require("express-promise-router");
const router = new Router();

const { GET_USER_DATA, SAVE_UPDATE_USER_GATHA } = require('../controller/users.controller');
const { GET_USER_GATHA, USER_NEXT_GATHA, UPDATE_USER_SUTRA } = require('../controller/user_sutra.controller');
const { GET_CATEGORY } = require('../controller/sutra-category.controller');
router.get('/getUserData', GET_USER_DATA);
router.get('/getUserGatha', GET_USER_GATHA);
router.post('/userNextGatha', USER_NEXT_GATHA);
router.post('/updateUserSutra', UPDATE_USER_SUTRA);
router.get('/getSutraCategory', GET_CATEGORY);
router.post('/saveUserAndGatha', SAVE_UPDATE_USER_GATHA)

module.exports = router