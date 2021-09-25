const express = require("express");
const Router = require("express-promise-router");
const router = new Router();

const { SIGNUP, SIGNIN, LOGOUT, FORGOT_PASSWORD } = require("../controller/auth.controller");
// const { UPDATE_USER } = require("../controller/user.controller");

router.post("/auth/signup", SIGNUP);
router.post("/auth/signin", SIGNIN);
router.get("/auth/logout", LOGOUT);
// router.post("/auth/forgot-password", FORGOT_PASSWORD);

// router.post("/update-user", UPDATE_USER);

module.exports = router;
