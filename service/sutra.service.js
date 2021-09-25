
const models = require('../models');

async function createSutra(sutra) {
    try {
        let result = [];
        if (Array.isArray(sutra)) {
            result = await models.Sutra.bulkCreate(sutra, { individualHooks: true });
        } else if (typeof sutra == 'object') {
            result = await models.Sutra.create(sutra);
        }
        return { data: result }
    } catch (e) {
        return { isError: true, e: e };
    }
}

module.exports = {
    createSutra
}