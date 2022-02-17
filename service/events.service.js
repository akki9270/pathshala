const models = require('../models');
const { TIMELOGGER } = require('../winston');

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
    getEventById,
    getAllEvent
}