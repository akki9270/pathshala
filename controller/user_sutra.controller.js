const models = require("../models");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { Op, literal, where, QueryTypes } = require('sequelize');
const { TIMELOGGER } = require('../winston');
const userService = require('../service/user.service');
const sutraService = require('../service/sutra.service');
const { POINTS, GATHA_STATUS: { IN_PROGRESS, DONE, TERMINATED } } = require('../_helpers/constants');

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
        const { studentId, teacherId, currentGathaCount, sutraId } = req.body;
        // console.log('studentId ', studentId, ' teacherId ', teacherId)
        let sutra = {};
        let isRevisedGatha = false;
        let Sutra = await sutraService.getSutraById(sutraId);
        // const {current_gatha_count, Sutra} = await userService.getUserGatha(studentId);
        // sequelize.literal('current_gatha_count + 1')
        // console.log('current_gatha_count ', current_gatha_count , typeof current_gatha_count, 'Sutra ', Sutra.gatha_count, typeof Sutra.gatha_count);
        let uSutra = await models.UserSutra.findOne({ where: { user_id: studentId, sutra_id: sutraId }, order: [['id', 'DESC']], limit: 1 });

        let latestSutraHistory = await models.UserSutraHistory.findOne(
            { where: { current_gatha_count: currentGathaCount, user_id: studentId, sutra_id: sutraId }, order: [['id', 'DESC']], limit: 1 }
        );
        let gathaCount = await models.UserSutraHistory.findAll({
            where: {
                user_id: studentId,
                status: DONE,
                sutra_id: sutraId,
                current_gatha_count: currentGathaCount
            }
        });
        isRevisedGatha =  gathaCount && gathaCount.length > 0;
        if (latestSutraHistory) {
            await latestSutraHistory.update(
                { status: DONE, approved_by: teacherId }, { transaction: t });
        }
        if (currentGathaCount < Sutra.gatha_count) {
            // increament Gatha count by 1
            await uSutra.update({ current_gatha_count: literal('current_gatha_count + 1'), approved_by: teacherId }, { transaction: t, individualHooks: true});
            if (!isRevisedGatha) {
                await models.User.update(
                    { score: literal('score + ' + (POINTS.GATHA_SCORE)), }, 
                    { where: { id: studentId }, transaction: t }
                    )
                }
        } else if (currentGathaCount == Sutra.gatha_count) {
            
            await uSutra.update(
                { end_date: literal('NOW()'), approved_by: teacherId },
                { where: { user_id: studentId, sutra_id: Sutra.id }, transaction: t }
            );
            // await models.UserSutra.create({
            //     user_id: studentId,
            //     sutra_id: (Sutra.id + 1),
            //     approved_by: teacherId,
            //     current_gatha_count: 1,
            //     start_date: literal('NOW()')
            // });

            if (!isRevisedGatha) {
                await models.User.update(
                    { score: literal('score + ' + (POINTS.SUTRA_SCORE + POINTS.GATHA_SCORE)), }, 
                    { where: { id: studentId }, transaction: t }
                    )
                }
        };
            sutra = await userService.getUserGatha(studentId);
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
    let existingInprogressGatha = await models.UserSutraHistory.findOne({
        where: { user_id: studentId, status: IN_PROGRESS },
        order: [['id', 'DESC']],
        limit: 1
    });
    if(existingInprogressGatha) {
        await existingInprogressGatha.update({ status: TERMINATED }, { transaction: t });
    }
    try {
        const ExistingUserSutraData = await models.UserSutra.findAll({
            where: {
                current_gatha_count: gathaCount,
                sutra_id: sutraId,
                // approved_by: teacherId,
                user_id: studentId
            },
            order: [['id', 'DESC']],
            limit: 1
        });
        const data = {
            current_gatha_count: gathaCount,
            sutra_id: sutraId,
            approved_by: teacherId,
            user_id: studentId
        }
        if (!ExistingUserSutraData || !ExistingUserSutraData.length) { 
            const result = await models.UserSutra.create(data, { transaction: t });
        }
    t.commit();
    return res.status(200).send({data: 'success'})
    } catch (e) {
        t.rollback();
        TIMELOGGER.error({ message: `USER_NEXT_GATHA ${JSON.stringify(e)}` })
        return res.status(500).send(e);
    }
}


exports.GET_TERMINATED_SUTRA = async (req, res, next) => {
    try {
        const { id } = req.params;
        let data = [];
        data = await models.sequelize.query(`select * from user_sutra_history where status = '${TERMINATED}' AND user_id = ${id}`, { type: QueryTypes.SELECT })
        return res.status(200).send({ data });
    } catch (e) {
        TIMELOGGER.error({ message: `GET_TERMINATED_SUTRA ${JSON.stringify(e)}` })
        return res.status(500).send(e)
    }
}


exports.UPDATE_USER_SUTRA_MULTI_ENTRY = async (req,res,next) => {
    try {
        let data = await models.sequelize.query(`select user_id, sutra_id, count(*) as count from user_sutra group by user_id, sutra_id`, { type: QueryTypes.SELECT });
        if (data && data.length) {
            for (let i in data) {
                let studentId = data[i].user_id;
                let sutraId = data[i].sutra_id;
                if(data[i].count > 1) {
                    let sutraDetails = await models.sequelize.query(`select id from user_sutra where user_id = ${studentId} AND sutra_id = ${sutraId}`, { type: QueryTypes.SELECT })
                    let ids = sutraDetails.map(i => i.id);
                    let latestId = Math.max(...ids);
                    ids = ids.filter(i => i != latestId).join(',');
                    // remove extra entry for same sutraid for given user
                    await models.sequelize.query(`DELETE FROM user_sutra where id IN (${ids})`);
                }
            }
        }
        return res.status(200).send({data: 'success'})
    } catch (e) {
        return res.status(500).send(e)
    }
}
