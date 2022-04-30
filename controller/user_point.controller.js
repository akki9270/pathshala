const models = require("../models");
const { updateUser } = require('../service/user.service');
const { addBonusPoint, getAllPoint, studentPointHistory } = require('../service/user_point.service');

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
        return res.status(500).send(e);
    }

}
exports.GET_ALL_POINT = async (req, res, next) => {
    try {
        let data = await getAllPoint();
        return res.status(200).send({ data });
    } catch (e) {
        return res.status(500).send(e);
    }
}

exports.GET_STUDENT_POINT_HISTORY = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { startDate, endDate } = req.query;
        let pointHistoryList =await studentPointHistory(id, startDate, endDate);
        return res.status(200).send({ 'data': pointHistoryList });
    } catch (e) {
        return res.status(500).send(e);
    }
}
