
const User = require('../models/user.model');

module.exports = function (Sequelize, Types) {
    let Attendence = Sequelize.define(
        "Attendence",
        {
            id: { type: Types.INTEGER, autoIncrement: true, primaryKey: true },
            attendence_date: { type: Types.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            is_present: { type: Types.TINYINT, default: 0 },
            is_holiday: { type: Types.TINYINT, default: 0 },
        }, {
        timestamps: true,
        paranoid: true,
        freezeTableName: true,
        tableName: "attendence",
        modelName: "Attendence"
    });

    Attendence.belongsTo(User(Sequelize, Types), {
        foreignKey: 'added_by',
        targetKey: 'id'
    });

    Attendence.belongsTo(User(Sequelize, Types), {
        foreignKey: 'user_id',
        targetKey: 'id'
    });
    return Attendence;
}