const { Op } = require('sequelize');
const models = require("../models");

exports.GET_ALL_SUTRA = async (req, res, next) => {
    try {
        const result = await models.Sutra.findAll({});
        res.status(200).send({data: result});
    } catch (e) {
        res.status(500).send(e);
    }
}