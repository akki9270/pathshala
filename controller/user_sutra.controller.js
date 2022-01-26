const models = require("../models");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { Op, literal, where } = require('sequelize');
const { TIMELOGGER } = require('../winston');
const userService = require('../service/user.service');
const { POINTS, GATHA_STATUS: { IN_PROGRESS, DONE } } = require('../_helpers/constants');

exports.GET_USER_GATHA = async function (req, res, next) {

    try {
        const { id } = req.query;
        const userGatha = await userService.getUserGatha(id);
        return res.status(200).send(userGatha);
    } catch (e) {
        console.log('Error ', e);
        TIMELOGGER.error({ message: `GET_USER_GATHA ${JSON.stringify(req.query)}`});
        return res.status(500).send('something went wrong');
    }
}
exports.USER_NEXT_GATHA = async function(req, res, next) {
    const t = await models.sequelize.transaction();
    try {
        const { studentId, teacherId } = req.body;
        // console.log('studentId ', studentId, ' teacherId ', teacherId)
        let sutra = {};
        const {current_gatha_count, Sutra} = await userService.getUserGatha(studentId);
        // sequelize.literal('current_gatha_count + 1')
        // console.log('current_gatha_count ', current_gatha_count , typeof current_gatha_count, 'Sutra ', Sutra.gatha_count, typeof Sutra.gatha_count);
        let uSutra = await models.UserSutra.findOne({ where: { user_id: studentId, sutra_id: Sutra.id }, order: [['id', 'DESC']], limit: 1 });

        let latestSutraHistory = await models.UserSutraHistory.findOne(
            { where: { current_gatha_count, user_id: studentId, sutra_id: Sutra.id }, order: [['id', 'DESC']], limit: 1 }
        );
        await latestSutraHistory.update(
            { status: DONE, approved_by: teacherId }, { transaction: t });
        if (current_gatha_count < Sutra.gatha_count) {
            // increament Gatha count by 1
            await uSutra.update({ current_gatha_count: literal('current_gatha_count + 1'), approved_by: teacherId }, { transaction: t});
            //  await models.UserSutra.update(
            //     {
            //     current_gatha_count: literal('current_gatha_count + 1'),
            //     approved_by: teacherId
            //     },
            //     {
            //         where: {
            //             user_id: studentId,
            //             sutra_id: Sutra.id
            //         },
            //         individualHooks: true
            //     }
            // );
            await models.User.update({
                score: literal('score + ' + (POINTS.GATHA_SCORE)),
            }, { where: { id: studentId }, transaction: t });
            sutra = await userService.getUserGatha(studentId);
        } else if (current_gatha_count == Sutra.gatha_count) {
            // 1. close current Sutra
            // 2. start next Sutra
            
            await uSutra.update(
                { end_date: literal('NOW()'), approved_by: teacherId },
                { where: { user_id: studentId, sutra_id: Sutra.id }, transaction: t }
            );
            await models.UserSutra.create({
                user_id: studentId,
                sutra_id: (Sutra.id + 1),
                approved_by: teacherId,
                current_gatha_count: 1,
                start_date: literal('NOW()')
            });
            await models.User.update(
            { score: literal('score + ' + (POINTS.SUTRA_SCORE + POINTS.GATHA_SCORE)), }, 
            { where: { id: studentId }, transaction: t }
            )
            sutra = await userService.getUserGatha(studentId);
        };
        t.commit();
        return res.status(200).send({data: sutra})
    } catch (e) {
        t.rollback();
        TIMELOGGER.error({ message: `USER_NEXT_GATHA ${JSON.stringify(e)}` })
        return res.status(500).send(e)
    }
}

exports.UPDATE_USER_SUTRA = async (req, res, next) => {
    const { studentId, teacherId, gathaCount, sutraId } = req.body;
    const t = await models.sequelize.transaction();
    try {
        const data = {
            current_gatha_count: gathaCount,
            sutra_id: sutraId,
            approved_by: teacherId,
            user_id: studentId
        }
    const result = await models.UserSutra.create(data, { transaction: t });
    t.commit();
    return res.status(200).send({data: 'success'})
    } catch (e) {
        t.rollback();
        return res.status(500).send(e);
    }
}