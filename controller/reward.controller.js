const {getAllReward, createReward} = require('../service/reward.service');

exports.GET_ALL_REWARD = async (req, res, next) => {
    const {date} = req.query;
    try {
        let result = await getAllReward(date);
        return res.status(200).send({data: result});
    } catch (e) {
        return res.status(500).send(e);
    }
};

exports.CREATE_REWARD = async (req, res, next) => {
    const {name, required_point, item_image_url, description, start_date, end_date, announcement_date, added_by} = req.query;
    try {
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
        return res.status(200).send({data: result});
    } catch (e) {
        return res.status(500).send(e);
    }
};