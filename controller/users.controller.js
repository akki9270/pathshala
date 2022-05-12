const { Op, fn, col } = require('sequelize');
const models = require("../models");
const { getUserGatha } = require('../service/user.service');
const moment = require("moment");
const { GATHA_STATUS: { IN_PROGRESS, TERMINATED }, USER_ROLES: { TEACHER, STUDENT } } = require('../_helpers/constants');

exports.GET_USER_DATA = async (req, res, next) => {
    const { id } = req.query
    try {
        let result = await models.User.findAll({
            where: { id: id }
        });
        let prevMonthAttendance;
        let userGatha = {};
        let presentDays = {};
        if (result && result.length) {
            if (result[0].role == STUDENT) {
                userGatha = await getUserGatha(id);
                presentDays = await models.Attendence.count({
                    distinct: true,
                    col: 'id',
                    where: {
                        user_id: id,
                        attendence_date: {
                            [Op.gte]: moment().startOf('month').startOf('day').toDate()
                        }
                    }
                });
                prevMonthAttendance = await models.Attendence.count({
                    distinct: true,
                    col: 'id',
                    where: {
                        user_id: id,
                        attendence_date: {
                            [Op.gte]: moment().subtract(1, 'month').startOf('month').startOf('day').toDate(),
                            [Op.lte]: moment().subtract(1, 'month').endOf('month').startOf('day').toDate()
                        }
                    }
                });
            }
        }
        if (result && result.length) {
            result[0]['dataValues']['presentDays'] = presentDays;
            result[0]['dataValues']['prevMonthAttendance'] = prevMonthAttendance;
        }

        console.log(' userGatha ', userGatha);
        return res.status(200).send({ data: result, gatha: userGatha, presentDays, prevMonthAttendance });
    } catch (e) {
        console.log(e)
        return res.status(500).send(e);
    }
}

exports.SAVE_UPDATE_USER_GATHA = async (req, res, next) => {
    try {

        const {
            user_id, firstName, lastName, middleName,
            motherName, address, dob, gender, contact1,
            contact2, email, selectedSutra,
            currentGathaCount, house_number, street, area_code,
            city, teacherId, isNew, revisionMode } = req.body;

        let mobile = [contact1, contact2];
        let insertedUser;
        let userId;
        mobile = mobile.filter(i => i).join(',');
        let user = {
            first_name: firstName, middle_name: middleName, last_name: lastName, mother_name: motherName,
            display_name: firstName + ' ' + lastName,
            date_of_birth: dob, gender, email, role: 'Student',
            mobile, street, house_number, area_code,
            city, country: 'India', is_active: 1
        }
        if (isNew) {
            if (user_id && user_id > 0) {
                let existingUser = await models.User.findAll({ where: { id: user_id } });
                if (existingUser && existingUser.length) {
                    return res.status(400).send({ data: 'User Already exists with id ' + user_id });
                }
                userId = user_id;
                user['id'] = user_id;
                insertedUser = await models.User.create(user);
            } else {
                // create new user record
                insertedUser = await models.User.create(user);
                // console.log(' insertedUser ', insertedUser);
                userId = insertedUser.id
            }

        } else {
            // update user record
            userId = user_id;
            await models.User.update(user, { where: { id: user_id } });
        }
        const ExistingUserSutraData = await models.UserSutra.findOne({
            where: {
                current_gatha_count: currentGathaCount,
                sutra_id: selectedSutra.id,
                // approved_by: teacherId,
                user_id: userId
            },
            order: [['id', 'DESC']],
            limit: 1
        });
        let existingInprogressGatha = await models.UserSutraHistory.findOne({
            where: { user_id: userId, status: IN_PROGRESS },
            order: [['id', 'DESC']],
            limit: 1
        });
        if (existingInprogressGatha) {
            if (!(existingInprogressGatha.sutra_id == selectedSutra.id && existingInprogressGatha.current_gatha_count == currentGathaCount)) {
                await existingInprogressGatha.update({ status: TERMINATED });
            }
        }
        if (!ExistingUserSutraData) {
            // user Sutra After creating / updating User
            const result = await models.UserSutra.create({
                current_gatha_count: currentGathaCount,
                sutra_id: selectedSutra.id,
                approved_by: teacherId,
                user_id: userId,
                revision_mode: revisionMode
            });
        } else {
            await ExistingUserSutraData.update({ revision_mode: revisionMode })
        }

        return res.status(200).send({ data: { id: userId } })
    } catch (e) {
        console.log('e ', e);
        return res.status(500).send(e)
    }

}

exports.UPDATE_USER_DATA = async (req, res, next) => {
    let { id } = req.body;

    try {
        let User = await models.User.findOne({ where: { id } });
        if (!User) {
            return res.status(404).send('User not found');
        }
        let data = Object.assign({}, req.body);
        delete data.id;

        await User.update({ ...data }, { where: { id } });
        return res.status(200).send({ data: 'Updated Successfully' });
    } catch (e) {
        console.log('e ', e);
        return res.status(500).send(e)
    }
}

exports.STUDENT_USER = async (req, res, next) => {

    try {
        let students = await models.User.findAll({ where: { role: 'Student' } });
        return res.status(200).send({ data: students });
    } catch (e) {
        return res.status(500).send(e)
    }
}

exports.TEACHER_USER = async (req, res, next) => {

    try {
        let students = await models.User.findAll({ where: { role: 'Teacher' } });
        return res.status(200).send({ data: students });
    } catch (e) {
        return res.status(500).send(e)
    }
}