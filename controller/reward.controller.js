const { getAllReward, createReward, getRewardById } = require('../service/reward.service');

exports.GET_ALL_REWARD = async (req, res, next) => {
    const { startDate, endDate } = req.query;
    try {
        let result = await getAllReward(startDate, endDate);
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