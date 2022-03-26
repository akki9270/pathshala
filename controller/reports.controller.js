const { Op, fn, col, QueryTypes } = require('sequelize');
const models = require("../models");
const moment = require("moment");

exports.GET_DATE_WISE_STUDENT_DATA = async (req, res, next) => {
    const { date } = req.query;
    try {
        let result = await models.Attendence.findAll({
            where: {
                attendence_date: {
                    [Op.gte]: moment(date).startOf('day').toDate(),
                    [Op.lt]: moment(date).endOf('day').toDate()
                }
            },
            include: [
                { model: models.User, as: 'Student' },
                { model: models.User, as: 'Teacher' }
            ],
            order: [['attendence_date', 'ASC']]
        });
        return res.status(200).send({ data: result });
    } catch (e) {
        return res.status(500).send(e);
    }
}

exports.GET_MONTH_WISE_STUDENT_DATA = async (req, res, next) => {
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    try {
        let monthData = await models.sequelize.query(`SELECT  DATE(attendence_date) as Date, count(DATE(attendence_date)) as count  from attendence  where attendence_date between '${startDate}' and '${endDate}' group by DATE(attendence_date);`, { type: QueryTypes.SELECT });
        return res.status(200).send({monthData: monthData});
    } catch (e) {
        return res.status(500).send(e);
    }
}

exports.GET_SUTRA_WISE_STUDENT_DATA = async (req, res, next) => {

}