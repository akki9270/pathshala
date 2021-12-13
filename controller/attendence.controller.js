const moment = require("moment");
const { Op, fn, QueryTypes, col, literal } = require("sequelize");
const models = require("../models");
const { POINTS } = require("../_helpers/constants");



exports.CHECK_ATTENDENCE = async function (req, res) {
    const { teacherId, studentId } = req.body;
    // console.log(' payload  userId ', userId, ' StudentId ', studentId);
    let student = await models.User.findAll({ where: { id: studentId, role: 'Student' }, raw: true });
    let teacher = await models.User.findAll({ where: { id: teacherId, role: 'Teacher' }, raw: true });
    if (!student.length || !teacher.length) {
        return res.status(404).send('User not found');
    }
    student = student[0];
    teacher = teacher[0];

    let d = new Date();
    let dateString = `${d.getFullYear()}-${(d.getMonth() + 1)}-${d.getDate()}`;
    let attendence =
        await models.sequelize.query(
            `
        select * from attendence where user_id = ? AND DATE(attendence_date) = ?
        `, {
            type: QueryTypes.SELECT,
            replacements: [studentId, dateString]
        }
        )

    // console.log(' attendence ', attendence);
    if (!attendence || !attendence.length) {
        await models.Attendence.create({
            is_present: 1,
            user_id: studentId,
            added_by: teacherId,
            score: literal(' score + ' + POINTS.ATTENDENCE_SCORE)
        });
    }

    return res.status(200).send(student);
}

exports.GET_ATTENDANCE = async function (req, res, next) {
    const { id } = req.query;
    try {
        const lastWeekAttendance = await models.Attendence.findAll({
            attributes: {
                include: [
                    'id',
                    [fn('date_format', col('attendence_date'), '%b-%d'), 'attendence_date'],
                    "is_present",
                    "is_holiday",
                ],
                exclude: ['createdAt', 'updatedAt', 'deletedAt']
            },
            where: {
                user_id: id,
                attendence_date: {
                    [Op.gte]: moment().subtract(8, 'days').startOf('day').toDate(),
                    [Op.lt]: moment().endOf('day').toDate()
                },
                deletedAt: {
                    [Op.eq]: null
                }
            },
            order: [['attendence_date', 'ASC']]
        });
        return res.status(200).send(lastWeekAttendance);
    } catch (e) {
        console.log(e);
        return res.status(500).send();
    }

}
