const { Op, QueryTypes } = require('sequelize');
const models = require("../models");
const { GATHA_STATUS } = require('../_helpers/constants');

exports.GET_ALL_SUTRA = async (req, res, next) => {
    try {
        const { categoryId, studentId } = req.query;
        let result = [];
        if (categoryId) {
            result = await models.Sutra.findAll({
                where: { category_id: categoryId }
            });
        } else {
            result = await models.Sutra.findAll({});
        }
        if (studentId) {
          let gathaCount = await models.sequelize.query(
                `
                SELECT 
    ush.current_gatha_count, ush.sutra_id
FROM
    user_sutra_history ush
        JOIN
    (SELECT 
        MAX(id) AS id, sutra_id
    FROM
        user_sutra_history
    WHERE
        user_id = ?
            AND status = ?
    GROUP BY sutra_id) ush1 ON ush.id = ush1.id
                `
            ,
            {
                type: QueryTypes.SELECT,
                replacements: [studentId, GATHA_STATUS.TERMINATED]
            });
            if (gathaCount && gathaCount.length) {
                for (g of gathaCount) {
                    let idx = result.findIndex(i => i.id === g.sutra_id);
                    result[idx]['dataValues']['current_gatha_count'] = g.current_gatha_count;
                }
            }
        }
        res.status(200).send({data: result});
    } catch (e) {
        res.status(500).send(e);
    }
}