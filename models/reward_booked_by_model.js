const User = require('./user.model');
const Reward = require('./reward.model');
module.exports = function (Sequelize, Types) {
    let RewardBookedBy = Sequelize.define(
        "RewardBookedBy",
        {
            id: { type: Types.INTEGER, autoIncrement: true, primaryKey: true }
        }, {
        paranoid: true,
        freezeTableName: true,
        tableName: "reward_booked_by",
        modelName: "RewardBookedBy"
    });
    RewardBookedBy.belongsTo(User(Sequelize, Types), {
        foreignKey: 'user_id',
        targetKey: 'id',
        as: 'Student'
    });
    RewardBookedBy.belongsTo(Reward(Sequelize, Types), {
        foreignKey: 'reward_id',
        targetKey: 'id',
        as: 'Reward'
    });
    return RewardBookedBy;
}