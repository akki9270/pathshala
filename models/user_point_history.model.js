const User = require('./user.model');
module.exports = function (Sequelize, Types) {
    let UserPoint = Sequelize.define(
        "UserPointHistory",
        {
            id: { type: Types.INTEGER, autoIncrement: true, primaryKey: true },
            point: { type: Types.INTEGER },
            description: { type: Types.STRING, allowNull: false },
            isPointAdded: { type: Types.TINYINT, defaultValue: '1' }
        }, {
        paranoid: true,
        freezeTableName: true,
        tableName: "user_point_history",
        modelName: "UserPointHistory"
    });
    UserPoint.belongsTo(User(Sequelize, Types), {
        foreignKey: 'added_by',
        targetKey: 'id',
        as: 'Teacher'
    });

    UserPoint.belongsTo(User(Sequelize, Types), {
        foreignKey: 'user_id',
        targetKey: 'id',
        as: 'Student'
    });
    return UserPoint;
}