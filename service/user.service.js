
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

async function getUserGatha(id) {
    try {
        const userGatha = await models.UserSutra.findAll({
            where: {
                user_id: id
            },
            include: [
                { model: models.Sutra },
                { model: models.User, as: 'Student' },
                { model: models.User, as: 'Teacher' }
            ],
            order:[['id', 'DESC']],
            limit: 1
        });
        return userGatha[0];
    } catch (e) {
        throw e
    }
}

module.exports = {
    createUser,
    getUserGatha
}