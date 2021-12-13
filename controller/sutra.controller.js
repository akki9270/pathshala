const { Op } = require('sequelize');
const models = require("../models");

exports.GET_ALL_SUTRA = async (req, res, next) => {
    try {
        const { id } = req.query;
        let result = [];
        if (id) {
            result = await models.Sutra.findAll({
                where: {
                    category_id: id
                }
            });
        } else {
            result = await models.Sutra.findAll({});
        }
        res.status(200).send({data: result});
    } catch (e) {
        res.status(500).send(e);
    }
}