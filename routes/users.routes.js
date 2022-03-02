const express = require("express");
const Router = require("express-promise-router");
const router = new Router();

const { GET_USER_DATA, SAVE_UPDATE_USER_GATHA, UPDATE_USER_DATA } = require('../controller/users.controller');
const { GET_USER_GATHA, USER_NEXT_GATHA, UPDATE_USER_SUTRA, GET_TERMINATED_SUTRA, UPDATE_USER_SUTRA_MULTI_ENTRY } = require('../controller/user_sutra.controller');
const { GET_CATEGORY } = require('../controller/sutra-category.controller');
router.get('/getUserData', GET_USER_DATA);
router.post('/updateUser', UPDATE_USER_DATA);
router.get('/getUserGatha', GET_USER_GATHA);
router.post('/userNextGatha', USER_NEXT_GATHA);
router.post('/updateUserSutra', UPDATE_USER_SUTRA);
router.get('/getSutraCategory', GET_CATEGORY);
router.post('/saveUserAndGatha', SAVE_UPDATE_USER_GATHA)
router.get('/getAllTerminatedSutra/:id', GET_TERMINATED_SUTRA);
router.get('/updateUserMultiEntry',UPDATE_USER_SUTRA_MULTI_ENTRY)
module.exports = router