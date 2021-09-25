const { Op, Sequelize, QueryTypes } = require("sequelize");
const models = require("../models");



exports.CHECK_ATTENDENCE = async function (req, res) {
    const { userId, studentId } = req.body;
    console.log(' payload ', userId, studentId);
    let student = await models.User.findAll({ where: { ref_id: studentId }, raw: true });
    let teacher = await models.User.findAll({ where: { id: userId }, raw: true });
    console.log(' student ', student);
    console.log(' teacher ', teacher);
    if (!student.length || !teacher.length) {
        return res.status(404).send('User not found');
    }
    student = student[0];
    teacher = teacher[0];

    let d = new Date();
    let dateString = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    // where user_id = ${student.id} AND DATE(attendence_date) = '${d.getFullYear()-d.getMonth()-d.getDate()}'
    let attendence = 
    await models.sequelize.query(
        `
        select * from attendence where user_id = ? AND DATE(attendence_date) = ?
        `, { 
            type: QueryTypes.SELECT,
            replacements: [student.id, dateString],
            logging: console.log
        }
    )
    // await models.Attendence.findAll({
    //     where: {
    //         user_id: student.id,
    //         attendence_date: Sequelize.fn('NOW')
    //     },
    //     raw: true
    // });

    console.log(' attendence ', attendence);
    // await models.Attendence.create({
    //     is_present: 1,
    //     user_id: student.id,
    //     added_by: teacher.id
    // });

    return res.status(200).send(student);
}