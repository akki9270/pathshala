module.exports = function (Sequelize, Types) {
    let Sutra = Sequelize.define(
        "Sutra", {
        id: { type: Types.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: Types.STRING, allowNull: false },
        name_english: { type: Types.STRING, allowNull: false },
        gatha_count: { type: Types.INTEGER, allowNull: false },
        queue_number: { type: Types.INTEGER, allowNull: false },
        // score_1: { type: Types.INTEGER, allowNull: false },
        // score_2: { type: Types.INTEGER, allowNull: false },
        // score_3: { type: Types.INTEGER, allowNull: false },
        score: { type: Types.INTEGER, allowNull: true, defaultValue: 0},
        days_to_complete: { type: Types.INTEGER, allowNull: true, defaultValue: 0 },
        // days_to_complete_2: { type: Types.INTEGER, allowNull: false },
        // days_to_complete_3: { type: Types.INTEGER, allowNull: false }

    }, {
        timestamps: true,
        paranoid: true,
        freezeTableName: true,
        tableName: "sutra",
        modelName: "Sutra",
    });

    return Sutra;
}