
const User = require('./user.model');
const Sutra = require('./sutra.model');
module.exports = function (Sequelize, Types) {
    let UserSutra = Sequelize.define(
        "UserSutraHistory",
        {
            id: { type: Types.INTEGER, autoIncrement: true, primaryKey: true },
            current_gatha_count: { type: Types.INTEGER },
            start_date: { type: Types.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            end_date: { type: Types.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
        }, {
        timestamps: true,
        paranoid: true,
        freezeTableName: true,
        tableName: "user_sutra_history",
        modelName: "UserSutraHistory"
    });
    UserSutra.belongsTo(User(Sequelize, Types), {
        foreignKey: 'approved_by',
        targetKey: 'id',
        as: 'Teacher'
    });
    UserSutra.belongsTo(User(Sequelize, Types), {
        foreignKey: 'user_id',
        targetKey: 'id',
        as: 'Student'
    });
    UserSutra.belongsTo(Sutra(Sequelize, Types), {
        foreignKey: 'sutra_id',
        targetKey: 'id'
    });
    return UserSutra;
}