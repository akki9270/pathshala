
const { ne, eq } = require('sequelize/lib/operators');
const { literal, col } = require('sequelize');
const models = require('../models');
const { GATHA_STATUS: { IN_PROGRESS } } = require('../_helpers/constants');
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
        const inProgressSutra = await models.UserSutraHistory.findOne({
            where: {
                user_id: id
            },
            order: [['id', 'DESC']],
            limit: 1
        });
        if (inProgressSutra && inProgressSutra.dataValues.status != IN_PROGRESS ) {
            return null;
        }
        const userGatha = await models.UserSutra.findAll({
            where: {
                user_id: id,
                start_date: { [eq]: col('end_date') }
            },
            include: [
                {
                    model: models.Sutra,
                    include: [{ model: models.SutraCategory }]
                },
                { model: models.User, as: 'Student' },
                { model: models.User, as: 'Teacher' }
            ],
            order: [['id', 'DESC']],
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