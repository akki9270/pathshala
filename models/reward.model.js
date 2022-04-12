
const User = require('./user.model');
module.exports = function (Sequelize, Types) {
    let Reward = Sequelize.define(
        "Reward",
        {
            id: { type: Types.INTEGER, autoIncrement: true, primaryKey: true },
            name: { type: Types.STRING, allowNull: false },
            required_point: { type: Types.INTEGER, allowNull: false },
            item_image_url: { type: Types.STRING },
            description: { type: Types.STRING },
            start_date: { type: Types.DATE, allowNull: false },
            end_date: { type: Types.DATE, allowNull: false },
            announcement_date: { type: Types.DATE, allowNull: false },
        }, {
        paranoid: true,
        freezeTableName: true,
        tableName: "reward",
        modelName: "Reward"
    });
    Reward.belongsTo(User(Sequelize, Types), {
        foreignKey: 'added_by',
        targetKey: 'id',
        as: 'Teacher'
    });
    return Reward;
}