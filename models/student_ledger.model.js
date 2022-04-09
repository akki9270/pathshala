const User = require('./user.model');
module.exports = function (Sequelize, Types) {
    let StudentLedger = Sequelize.define(
        "StudentLedger",
        {
            id: { type: Types.INTEGER, autoIncrement: true, primaryKey: true },
            year: { type: Types.INTEGER },
            total_attendance: { type: Types.INTEGER },
            sutra_count: { type: Types.INTEGER },
            gatha_count: { type: Types.INTEGER },
            reward_point: { type: Types.INTEGER },
            total_point: { type: Types.INTEGER },
        }, {
            paranoid: true,
            freezeTableName: true,
            tableName: "student_ledger",
            modelName: "StudentLedger"
        });
    StudentLedger.belongsTo(User(Sequelize, Types), {
        foreignKey: 'added_by',
        targetKey: 'id',
        as: 'Teacher'
    });
    return StudentLedger;
}