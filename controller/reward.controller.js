const { getAllReward, createReward, getRewardById } = require('../service/reward.service');
const { QueryTypes } = require("sequelize");
const models = require('../models');

exports.GET_ALL_REWARD = async (req, res, next) => {
    try {
        let result = await getAllReward();
        return res.status(200).send({ data: result });
    } catch (e) {
        return res.status(500).send(e);
    }
};

exports.CREATE_REWARD = async (req, res, next) => {
    try {
        const { id, name, required_point, item_image_url, description, start_date, end_date, announcement_date, added_by } = req.body;
        if (id) {
            let reward = await getRewardById(id);

            let update = await reward.update({
                ...req.body
            }, { where: { id } });
            let updatedReward = await getRewardById(id);
            return res.status(200).send(updatedReward);
        } else {
            let result = await createReward({
                name,
                required_point,
                item_image_url,
                description,
                start_date,
                end_date,
                announcement_date,
                added_by
            });
            return res.status(200).send({ data: result });
        }
    } catch (e) {
        return res.status(500).send(e);
    }
};

exports.GET_REWARD_BY_ID = async (req, res, next) => {
    try {
        const id = req.params.id;
        let data = await getRewardById(id);
        return res.status(200).send({ data });
    } catch (e) {
        return res.status(500).send(e);
    }
}

exports.DELETE_REWARD = async (req, res, next) => {
    try {
        const id = req.params.id;
        let reward = await getRewardById(id);
        await reward.destroy({ where: { id } });
        return res.status(200).send({ message: 'deleted Successfully' })
    } catch (e) {
        return res.status(500).send(e);
    }
}

exports.GET_REWARD_BY_DATE = async (req, res, next) => {
    let startDate = req.query.start_date;
    let endDate = req.query.end_date;
    try {
        let dateReward = await models.sequelize.query(`SELECT * from reward  
                                                        where start_date LIKE '${startDate}%' and end_date LIKE '${endDate}%' and deletedAt IS null;`
            , { type: QueryTypes.SELECT });

        return res.status(200).send({ dateReward: dateReward });
    } catch (e) {
        return res.status(500).send(e);
    }
}