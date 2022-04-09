const Router = require("express-promise-router");
const router = new Router();

const {GET_ALL_STUDENT_LEDGER, CREATE_STUDENT_LEDGER} = require('../controller/student_ledger.controller');

router.get('/getAllStudentLedger', GET_ALL_STUDENT_LEDGER);
router.post('/createStudentLedger', CREATE_STUDENT_LEDGER);

module.exports = router;