const {Op, fn, col, QueryTypes} = require('sequelize');
const models = require("../models");
const moment = require("moment");

exports.GET_DATE_WISE_STUDENT_DATA = async (req, res, next) => {
    const {date} = req.query;
    try {
        let result = await models.Attendence.findAll({
            where: {
                attendence_date: {
                    [Op.gte]: moment(date).startOf('day').toDate(),
                    [Op.lt]: moment(date).endOf('day').toDate()
                }
            },
            include: [
                {model: models.User, as: 'Student'},
                {model: models.User, as: 'Teacher'}
            ],
            order: [['attendence_date', 'ASC']]
        });
        return res.status(200).send({data: result});
    } catch (e) {
        return res.status(500).send(e);
    }
}

exports.GET_MONTH_WISE_STUDENT_DATA = async (req, res, next) => {
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    try {
        let monthData = await models.sequelize.query(`SELECT  DATE(attendence_date) as Date, count(DATE(attendence_date)) as count  from attendence  where attendence_date between '${startDate}' and '${endDate}' group by DATE(attendence_date);`, {type: QueryTypes.SELECT});
        return res.status(200).send({monthData: monthData});
    } catch (e) {
        return res.status(500).send(e);
    }
}

exports.GET_SUTRA_WISE_STUDENT_DATA = async (req, res, next) => {
    let sutraId = req.query.sutraId;
    try {
        let sutraData = await models.sequelize.query(`select user_id as studentId, studentName,  teacherName, days from  (SELECT 
                sa_history.start_date,
                sa_history.updatedAt,
                user_id,
                approved_by,
                DATEDIFF(sa_history.updatedAt, sa_history.start_date) as days,
                student.first_name as studentName,
                teacher.first_name as teacherName
            FROM
                pathshala.user_sutra_history as sa_history
                INNER JOIN user AS student ON student.id = sa_history.user_id
                 INNER JOIN user AS teacher ON teacher.id = sa_history.approved_by
            WHERE
                sutra_id = ${sutraId}
            GROUP BY user_id , sa_history.updatedAt
            ORDER BY sa_history.id DESC) as abc  group by user_id`, {type: QueryTypes.SELECT});
        return res.status(200).send({sutraData: sutraData});
    } catch (e) {
        return res.status(500).send(e);
    }
}

exports.GET_TEACHER_WISE_DATE_DATA = async (req, res, next) => {
    let selectedDate = req.query.date;
    let endDate = moment(selectedDate).add(1, "day").format('YYYY-MM-DD');
    let teacherId = req.query.teacherId;
    try {
        let teacherData = await models.sequelize.query(`SELECT 
            student.id as studentId,
            student.first_name as studentName,
            sutra_history.current_gatha_count as gathCount,
            sutra.name as sutraName
        FROM
            pathshala.user_sutra_history as sutra_history
             INNER JOIN user AS student ON student.id = sutra_history.user_id
              INNER JOIN sutra AS sutra ON sutra.id = sutra_history.sutra_id
        WHERE
            sutra_history.createdAt >= '${selectedDate}'
                AND sutra_history.createdAt < '${endDate}'
                AND sutra_history.approved_by = ${teacherId};`, {type: QueryTypes.SELECT});
        return res.status(200).send({teacherData: teacherData});
    } catch (e) {
        return res.status(500).send(e);
    }
}