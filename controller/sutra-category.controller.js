const { Op } = require('sequelize');
const models = require("../models");

exports.GET_CATEGORY = async (req, res, next) => {
    try {
        const result = await models.SutraCategory.findAll({});
        res.status(200).send({data: result});
    } catch (e) {
        res.status(500).send(e);
    }
}

exports.SAVE_CAT_SUTRA = async (req, res, next) => {
    try {
        console.log(' req body ****** ', req.body);
        let data = req.body;
        if (data.selectedSutraCategory) {
            data.category_id = data.selectedSutraCategory.id;
        }
        const result = await models.Sutra.create({
            category_id: data.category_id,
            name: data.name,
            name_english: data.name_english,
            gatha_count: data.gatha_count
        });
        // const result = 
        res.status(200).send(result);
    } catch(e) {
        res.status(500).send(e);
    }
}