const { Op, literal, where, QueryTypes } = require('sequelize');
const { TIMELOGGER } = require('../winston');
const moment = require("moment");
const eventsService = require('../service/events.service');
const models = require("../models");

exports.CREATE_EVENT = async (req, res, next) => {
    try {
        const {id, event_date, event_name, description, banner_url, points } = req.body;
        if(!event_date || moment().isAfter(event_date)) {
            return res.status(400).send({message: 'Event Date should be greater than today'});
        }
        if(id) {
            let event = await eventsService.getEventById(id);

            let update = await event.update({
                ...req.body
            }, { where: { id }});
            let updatedEvent = await eventsService.getEventById(id);
            return res.status(200).send(updatedEvent);
        } else {
            let result = await models.Events.create({
                event_date,
                description,
                event_name,
                banner_url,
                points,
                is_active: 1
            });
            result = await eventsService.getEventById(result.insertId);
            return res.status(200).send({data: result});
        }
    } catch (e) {
        TIMELOGGER.error({ method: 'CREATE_EVENT', message: e.message || 'Something went wrong'});
        return res.status(500).send('somrthing went wrong');
    }
}

exports.UPDATE_EVENT = async (req, res, next) => {
    try {
        const { id } = req.body;
        let event = await eventsService.getEventById(id);

        let update = await event.update({
            ...req.body
        }, { where: { id }});
        let updatedEvent = await eventsService.getEventById(id);
        return res.status(200).send(updatedEvent);
    } catch (e) {
        TIMELOGGER.error({ method: 'CREATE_EVENT', message: e.message || 'Something went wrong'});
        return res.status(500).send('somrthing went wrong');
    }
}

exports.DELETE_EVENT = async (req, res, next) => {
    try {
        const { id } = req.query;
        let event = await eventsService.getEventById(id);
        await event.destroy({ where: { id }});
        return res.status(200).send({ message: 'deleted Successfully' })
    } catch (e) {
        TIMELOGGER.error({ method: 'CREATE_EVENT', message: e.message || 'Something went wrong'});
        return res.status(500).send('somrthing went wrong');
    }
}

exports.GET_ALL_EVENT = async (req, res, next) => {
    try {
        let data = await eventsService.getAllEvent();
        return res.status(200).send({ data });
    } catch (e) {
        TIMELOGGER.error({ method: 'CREATE_EVENT', message: e.message || 'Something went wrong'});
        return res.status(500).send('somrthing went wrong');
    }
}

exports.GET_EVENT_BY_ID = async (req, res, next) => {
    try {
        const id = req.params.id;
        let data = await eventsService.getEventById(id);
        return res.status(200).send({ data });
    } catch (e) {
        TIMELOGGER.error({ method: 'CREATE_EVENT', message: e.message || 'Something went wrong'});
        return res.status(500).send('somrthing went wrong');
    }
}