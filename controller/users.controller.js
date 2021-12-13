const { Op, fn, col } = require('sequelize');
const models = require("../models");
const { getUserGatha } = require('../service/user.service');
const moment = require("moment");

exports.GET_USER_DATA = async (req, res, next) => {
    const { id } = req.query
    const result = await models.User.findAll({
        where: { id: id }
    });
    const userGatha = await getUserGatha(id);
    const presentDays = await models.Attendence.count({
        distinct: true,
        col: 'id',
        where: {
            user_id: id,
            attendence_date: {
                [Op.gte]: moment().startOf('year').startOf('day').toDate()
            }
        }
    });

    // if(result && result.length) {
    //     result[0]['dataValues']['presentDays'] = presentDays;
    // }

    console.log(' userGatha ', userGatha);
    return res.status(200).send({ data: result, gatha: userGatha, presentDays });
}

exports.SAVE_UPDATE_USER_GATHA = async (req, res, next) => {
    try {

        const {
            user_id, firstName, lastName, middleName,
            motherName, address, dob, gender, contact1,
            contact2, email, selectedSutra,
            currentGathaCount, house_number, street, area_code,
            city, teacherId } = req.body;

        let mobile = [contact1, contact2];
        let insertedUser;
        let userId;
       mobile = mobile.filter(i => i).join(',');
        let user = {
            first_name: firstName, middle_name: middleName, last_name: lastName,
            display_name: firstName + ' ' + lastName,
            date_of_birth: dob, gender, email, role: 'Student',
            mobile, street, house_number, area_code,
            city, country: 'India', is_active: 1
        }
        if (user_id > 0) {
            // update user record
            userId = user_id;
            await models.User.update(user, {
                where: { id: user_id }
            })
        } else {
            // create new user record
            insertedUser = await models.User.create(user);
            console.log(' insertedUser ', insertedUser);
            userId = insertedUser.id
        }
        // user Sutra After creating / updating User
        const result = await models.UserSutra.create({
            current_gatha_count: currentGathaCount,
            sutra_id: selectedSutra.id,
            approved_by: teacherId,
            user_id: userId
        });

        return res.status(200).send({ data: userId })
    } catch (e) {
        console.log('e ', e);
        return res.status(500).send(e)
    }

}