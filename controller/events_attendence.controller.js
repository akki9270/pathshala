const { Op, literal, where, QueryTypes } = require('sequelize');
const { TIMELOGGER } = require('../winston');
const moment = require("moment");
// const eventsService = require('../service/events.service');
const models = require("../models");

exports.GET_EVENT_ATTENDENCE_BYID = async (req, res, next) => {
    try {
        let { eventId } = req.params;
        let result = await models.events_attendence.findAll({
            where: {
                event_id: eventId
            },
            include: [
                { model: models.User, as: 'student' },
                { model: models.User, as: 'teacher' }
            ],
            order: [['id', 'desc']]
        });
        return res.status(200).send({ data: result });
    } catch (e) {
        TIMELOGGER.error({ method: 'GET_EVENT_ATTENDENCE_BYID', message: e.message || 'something wen wrong'});
        return res.status(500).send('Something went wrong');
    }
 }

exports.SAVE_EVENT_ATTENDENCE = async (req, res, next) => {
    try {
        let { eventId, studentId, teacherId } = req.body;
        let data = {
            event_id: eventId,
            student_id: studentId
        }
        const isExisting = await models.events_attendence.findOne({ where: { ...data } });
        if (isExisting && isExisting.length) {
            return res.status(400).send('Already added present');
        }
        let result = models.events_attendence.create({ ...data, teacher_id: teacherId });
        let event = await models.Events.findOne({ where : { id: eventId } });
        if (event && event.length) {
            event = event[0];
        }
        let student = await models.User.findOne({ where: { id: studentId } });
        await student.update({
            score: literal('score + ' + event.points),
        });

        return res.status(200).send({ data: 'success'});
    } catch (e) {
        TIMELOGGER.error({ method: 'GET_EVENT_ATTENDENCE_BYID', message: e.message || 'something wen wrong'});
        return res.status(500).send('Something went wrong');
    }
}