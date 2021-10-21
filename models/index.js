/*********************************************
index.js

@desc - main sequlize init file
      - creates a model for each file in the /models directory

@author - Akshay Patwa
@version - 1.0.0
*********************************************/

"use strict";

/**********************
  Libs
**********************/

// External libs
var fs = require("fs"),
  path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const mysql = require("mysql2/promise");
const app = require("../app");
// Internal libs
var config = require("../config.js");

/**********************
  Globals
**********************/
var SQL = config.SQL;

// Sequlize instance
var db
module.exports = db = {};

init_sequelize();
/**********************
  Functions
**********************/

// Dynamically add all files in models directory
async function init_sequelize() {
  // create db if it doesn't already exist
  const { host, port, username, password, database, dialect } = config.SQL;
  const connection = await mysql.createConnection({
    host,
    port,
    user: username,
    password,
  });
  let result = await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${database}\`;`
  );
  let sequelize = {};
  try {
    sequelize = new Sequelize(database, username, password, {
      host: host,
      dialect: dialect,
      port: port,
      logging: false,
      dialectOptions: {
        // useUTC: false, //for reading from database
        dateStrings: true,
        typeCast: function (field, next) { // for reading from database
            if (field.type === 'DATETIME') {
              return field.string()
            }
              return next()
            },
        },
        timezone: '+05:30'
    });
  } catch (err) {
    console.log("err ", err);
  }

  fs.readdirSync(__dirname)
    .filter(function (file) {
      const returnFile =
        file.indexOf(".") !== 0 && file !== "index.js" && file.slice(0, -3);
      return returnFile;
    })
    .forEach(function (file) {
        console.log(' fileName ', file)
        console.log(path.join(__dirname, file.slice(0,-3)));
      // var model = sequelize["import"](path.join(__dirname, file));
      var model = require(path.join(__dirname, file.slice(0,-3)))(sequelize, DataTypes);
      db[model.name] = model;
    }); 
  console.log(" reached");
  Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName]) {
      db[modelName].associate(db);
    }
  });
  db.sequelize = sequelize;
  let connect = await sequelize.sync({ 
    // logging: console.log, force: true
  });

  console.log('connect ');
  app.startServer();
  
}
