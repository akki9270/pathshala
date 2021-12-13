module.exports = function (Sequelize, Types) {
    let SutraCategory = Sequelize.define(
        "SutraCategory", {
        id: { type: Types.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: Types.STRING, allowNull: false },
        name_english: { type: Types.STRING, allowNull: false },
    }, {
        timestamps: true,
        paranoid: true,
        freezeTableName: true,
        tableName: "SutraCategory",
        modelName: "SutraCategory",
    });

    return SutraCategory;
}