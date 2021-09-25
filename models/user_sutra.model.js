
const User = require('../models/user.model');
const Sutra = require('../models/sutra.model');
module.exports = function (Sequelize, Types) {
    let UserSutra = Sequelize.define(
        "UserSutra",
        {
            id: { type: Types.INTEGER, autoIncrement: true, primaryKey: true },
            current_gatha_count: { type: Types.INTEGER },
            start_date: { type: Types.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            end_date: { type: Types.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
        }, {
        timestamps: true,
        paranoid: true,
        freezeTableName: true,
        tableName: "user_sutra",
        modelName: "UserSutra"
    });
    UserSutra.belongsTo(User(Sequelize, Types), {
        foreignKey: 'approved_by',
        targetKey: 'id'
    });
    UserSutra.belongsTo(User(Sequelize, Types), {
        foreignKey: 'user_id',
        targetKey: 'id'
    });
    UserSutra.belongsTo(Sutra(Sequelize, Types), {
        foreignKey: 'sutra_id',
        targetKey: 'id'
    });
    return UserSutra;
}