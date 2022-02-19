const models = require('../models');
const { TIMELOGGER } = require('../winston');

async function createEvent(event) {
    try {
        let result = [];
        if (Array.isArray(event)) {
            result = await models.Event.bulkCreate(event, { individualHooks: true });
        } else if (typeof event == 'object') {
            result = await models.Event.create(event);
        }
        return { data: result }
    } catch (e) {
        return { isError: true, e: e };
    }
}

async function getEventById(id) {
    try {
        const result = await models.Events.findOne({ where: { id } })
        return result;
    } catch (e) {
        TIMELOGGER.error({message: e.message || 'something went wrong', method: 'getEventById'});
        return e;
    }
}

async function getAllEvent() {
    try {
        const result = await models.Events.findAll({});
        return result;
    } catch (e) {
        TIMELOGGER.error({message: e.message || 'something went wrong', method: 'getEventById'});
        return e;
    }
}
module.exports = {
    createEvent,
    getEventById,
    getAllEvent
}