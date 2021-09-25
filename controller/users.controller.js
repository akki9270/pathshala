const { Op } = require('sequelize');
const models = require("../models");

exports.GET_USER_DATA = async (req, res, next) => {
    const { id } = req.query
    const result = await models.User.findAll({
        where: { id: id }
    })
    res.status(200).send({ data: result });
}