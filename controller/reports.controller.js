const { Op, fn, col } = require('sequelize');
const models = require("../models");
const moment = require("moment");

exports.GET_STUDENT_WISE_DATA = async (req, res, next) => {
    const { date } = req.query;
    try {
        let result = await models.Attendence.findAll({
            where: {
                attendence_date: {
                    [Op.gte]: moment(date).subtract(1, 'days').startOf('day').toDate(),
                    [Op.lt]: moment(date).endOf('day').toDate()
                }
            },
            order: [['attendence_date', 'ASC']]
        });
        return res.status(200).send({ data: result });
    } catch (e) {
        return res.status(500).send(e);
    }
}