const express = require("express");
const Router = require("express-promise-router");
const router = new Router();

const { GET_CATEGORY, SAVE_CAT_SUTRA } = require('../controller/sutra-category.controller');

router.get('/getSutraCategory', GET_CATEGORY);
router.post('/saveCatSutra', SAVE_CAT_SUTRA);

module.exports = router;
