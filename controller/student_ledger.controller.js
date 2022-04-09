const {getAllLedger, createLedger} = require('../service/student_ledger.service');

exports.GET_ALL_STUDENT_LEDGER = async (req, res, next) => {
    try {
        let result = await getAllLedger();
        return res.status(200).send({data: result});
    } catch (e) {
        return res.status(500).send(e);
    }
};

exports.CREATE_STUDENT_LEDGER = async (req, res, next) => {
    const {year, total_attendance, sutra_count, gatha_count, reward_point, total_point, added_by} = req.query;
    try {
        let result = await createLedger({
            year,
            total_attendance,
            sutra_count,
            gatha_count,
            reward_point,
            total_point,
            added_by
        });
        return res.status(200).send({data: result});
    } catch (e) {
        return res.status(500).send(e);
    }
};