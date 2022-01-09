const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const expressJwt = require("express-jwt");
const authRoutes = require('./routes/auth.routes');
const attendenceRoutes = require('./routes/attendence.routes');
const userRoutes = require("./routes/users.routes");
const sutraRoutes = require("./routes/sutra.route");
const sutraCategoryRoutes = require('./routes/sutra-category.routes');
const summaryRoutes = require('./routes/summary.routes');

const userService = require('./service/user.service');
const sutraService = require('./service/sutra.service');
const sutraCategoryService = require('./service/sutra-category.service');
// node_xj = require("xls-to-json");
const models = require('./models');
const imageUrl = "http://hiteshvidhikar.com/pathshala/images/";
const imageSuffix = ".jpg";

// const calculationRoutes = require('./routes/calculation.routes');
dotenv.config('dev');
const { TIMELOGGER } = require('./winston');
const PORT = process.env.PORT || 8075;
const app = express();
const config = require('./config');

// To iniate database connection and table creation
require('./models');

// middlewares
// prevent CORS problems
app.use(cors())
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});
app.use(cookieParser());
app.use(morgan('dev'));
app.use(bodyparser.json());

// express-jwt middleware for Authentication
// app.use(expressJwt(
//     {
//         credentialsRequired: true, 
//         secret: process.env.JWT_SECRET || config.JWT_SECRET, 
//         userProperty: 'auth', 
//         algorithms: ['HS256']
//     }).unless(
//         {
//             path: config.PUBLIC_URLs
//         })
//     );

// app.use(function(err, req, res, next) {
//     if(err.name === 'UnauthorizedError') {
//       res.status(err.status).send({message: err.message});
//       return;
//     }
//  next()
// });
app.use("/api", authRoutes);
app.use("/api", attendenceRoutes);
app.use("/api", userRoutes);
app.use("/api", sutraRoutes);
app.use("/api", sutraCategoryRoutes);
app.use("/api", summaryRoutes)
// convert xls to json
// node_xj(
//     {
//         input: "student_master.ods", // input xls
//         output: "output.json", // output json
//        sheet: "sutra_master", // specific sheetname
//        // rowsToSkip: 5, // number of rows to skip at the top of the sheet; defaults to 0
//         allowEmptyKey: false, // avoids empty keys in the output, example: {"": "something"}; default: true
//     },
//     function (err, result) {
//         // if (err) {
//         //     console.error(err);
//         // } else {
//         //     console.log(result);
//         // }
//     }
// );

async function InsertData() {
    let studentData = await models.User.findAll({
        where: { role: 'Student' }
    });
    let sutraData = await models.Sutra.findAll({});
    let sutraCategory = await models.SutraCategory.findAll({});
    if (studentData && !studentData.length) {
        const jsonData = require('./student.json');
        let allStudents = []
        jsonData.forEach((user, index) => {
            // user.ref_id = Number(user.id);
            if (user.fullName.indexOf(' ') > 0) {
                let names = user.fullName.split(' ');
                user.first_name = names[0];
                user.middle_name = names.length > 1 ? names[1] : '';
                user.last_name = names.length > 2 ? names[2] : '';
                user.role = user.role ? user.role : 'student';
            }
            if (user.dob == '' || !user.dob) {
                user.date_of_birth = null;
            } else {
                let d = new Date(user.dob)
                let dateArray = [`${d.getFullYear()}-${(d.getMonth()+1)}-${d.getDate()}`];
                user.date_of_birth = dateArray[0];
            }
            user.profile_image = imageUrl + user.id + imageSuffix;
            user.display_name = user.displayName;
            // console.log(' user at index ', index);
            allStudents.push(user)
        });
        TIMELOGGER.info(' Student data Length ' + allStudents.length, { user: 'System' });
        userService.createUser(allStudents).then(res => {
            //  console.log(' res ', res);
            TIMELOGGER.info(' Users Added successfully ');
        }).catch(error => {
            TIMELOGGER.error(' createUser ' + JSON.stringify(error));
        });
    }
    if (sutraData && !sutraData.length) {
        // insert static data.
        let sutraDataJson = require('./sutra.json');
        sutraDataJson.forEach( it => {
            it["id"] = it.queue_number;
            if(it.score == "") {
                it.score = 0;
            }
            if (it.days_to_complete == "") {
                it.days_to_complete = 0;
            }
            it["category_id"] = 1;
        })
       let result = await sutraService.createSutra(sutraDataJson);
    //    console.log(' sutra Data', result);
    }
    if(sutraCategory && !sutraCategory.length) {
        const jsonData = require('./category.json');
        let result = await sutraCategoryService.createCategory(jsonData);
    }
}
exports.startServer = () => {
    InsertData();
    app.listen(PORT, () => {
        console.log(`Running on port ${PORT}`);
    });
}