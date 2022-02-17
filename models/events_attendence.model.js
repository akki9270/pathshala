const Events = require('./events.model');
const User = require('./user.model');

module.exports = function (Sequelize, Types) {
    let EventsAttendence = Sequelize.define(
        "events_attendence",
        {
            id: { type: Types.INTEGER, autoIncrement: true, primaryKey: true }
        },
        {
            timestamps: true,
            paranoid: true,
            freezeTableName: true,
            tableName: "events_attendence",
            modelName: "EventsAttendence"
        }
    );
    EventsAttendence.belongsTo(Events(Sequelize, Types), {
        foreignKey: 'event_id',
        targetKey: 'id',
        as: 'event'
    });
    EventsAttendence.belongsTo(User(Sequelize, Types), {
        foreignKey: 'student_id',
        targetKey: 'id',
        as: 'student'
    });
    EventsAttendence.belongsTo(Events(Sequelize, Types), {
        foreignKey: 'teacher_id',
        targetKey: 'id',
        as: 'teacher'
    });
    return EventsAttendence;
}
