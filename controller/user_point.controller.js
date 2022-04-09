const models = require("../models");
const { updateUser } = require('../service/user.service');
const { addBonusPoint } = require('../service/user_point.service');

exports.ADD_POINT = async (req, res, next) => {
    try {
        const { point, description, isPointAdded, added_by, user_id } = req.body;

        let studentObj = await models.User.findOne({
            where: {
                id: user_id
            }
        });

        let user = {
            id: user_id,
            score: studentObj.score
        }
        if (isPointAdded === 1) {
            user.score = Number(studentObj.score) + Number(point);
        } else {
            user.score = Number(studentObj.score) - Number(point);
        }
        await updateUser(user);
        let result = await addBonusPoint({
            point,
            description,
            isPointAdded,
            added_by,
            user_id
        });
        return res.status(200).send(result);

    } catch (e) {
        return res.status(500).send('somrthing went wrong');
    }
}