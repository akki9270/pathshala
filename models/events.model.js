const User = require('./user.model');

module.exports = function (Sequelize, Types) {
    let Events = Sequelize.define(
        "events",
        {
            id: { type: Types.INTEGER, autoIncrement: true, primaryKey: true },
            event_date: { type: Types.DATE, allowNull: false },
            event_name: { type: Types.STRING, allowNull: false },
            description: { type: Types.TEXT('long') },
            banner_url: { type: Types.STRING },
            points: { type: Types.INTEGER },
            is_active: { type: Types.TINYINT }
        },
        {
            timestamps: true,
            paranoid: true,
            freezeTableName: true,
            tableName: "events",
            modelName: "Events"
        }
    );
    return Events;
}
