/**********************************************
config.js

@desc - config file for test suite
@authors - Akshay Patwa
@version - 1.0.0
**********************************************/
//var os = require('os');

/**********************
  Globals
**********************/
var ENVIRON = "PROD";

exports.HOST_URL = process.env.API_URL;
exports.ENVIRON = ENVIRON;

// SQL specifics
exports.SQL = {
  "username": process.env.DB_USERNAME || "root",
  //"password": "process.env.SQL_PASSWORD",
  "password": process.env.DB_PASSWORD || "password",
  "database": process.env.DB_NAME ||"PATHSHALA",
  "host": process.env.DB_HOST||"localhost",
     // "host":"localhost",
  // "host": "host.docker.internal", // for docker image
  "port": process.env.DB_PORT||"3306",
  "dialect": "mysql"
};

// URLs that does not require Authentication
exports.PUBLIC_URLs = [
  // '/api/auth/signup',
  '/api/auth/signin',
  '/api/auth/logout',
  // '/api/auth/forgot-password',
  // '/api/update-user'
]

exports.SECRET = process.env.SECRET || '9211dc48153ba70a02d0df6414530231';
exports.JWT_SECRET = process.env.JWT_SECRET || '9211dc48153ba70a02d0df6414530231';
exports.LOG_FILE_PATH = process.env.LOG_FOLDER||'./log/';
