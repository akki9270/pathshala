
const models = require('../models');

async function createUser(user) {
    try {
        let result = [];
        if (Array.isArray(user)) {
            result = await models.User.bulkCreate(user, { individualHooks: true });
        } else if (typeof user == 'object') {
            result = await models.User.create(user);
        }
        return { data: result }
    } catch (e) {
        return { isError: true, e: e };
    }
}

module.exports = {
    createUser
}