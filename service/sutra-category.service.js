const models = require('../models');

async function createCategory(category) {
    try {
        let result = [];
        if (Array.isArray(category)) {
            result = await models.SutraCategory.bulkCreate(category, { individualHooks: true });
        } else if (typeof category == 'object') {
            result = await models.SutraCategory.create(category);
        }
        return { data: result }
    } catch (e) {
        return { isError: true, e: e };
    }   
}

async function getCategory() {
    try {
        const sutraCategory = await models.UserSutra.findAll({});
        return sutraCategory;
    } catch (e) {
        throw e
    }
}

module.exports = {
    createCategory,
    getCategory
}