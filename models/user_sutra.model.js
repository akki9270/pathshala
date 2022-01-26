
const User = require('../models/user.model');
const Sutra = require('../models/sutra.model');
const models = require('../models');
const { GATHA_STATUS } = require('../_helpers/constants');
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
        modelName: "UserSutra",
        hooks: {
            afterUpdate: (Instance, option) => {
                // console.log( ' ***** UPDATE ', Instance, option); 
                if (Instance && Instance.dataValues && Instance.dataValues.current_gatha_count.val) {
                    delete Instance.dataValues.id;
                    Instance.dataValues.status = GATHA_STATUS.IN_PROGRESS;
                    Instance.dataValues.current_gatha_count = 
                    Instance.dataValues.current_gatha_count == 1 ? 1 : (Instance._previousDataValues.current_gatha_count + 1);
                    models.UserSutraHistory.create(Instance.dataValues, { transaction: option.transaction});
                }
            },
            afterCreate: async (Instance, option) => {
                // console.log( ' ***** CREATE ', Instance, option); 
                if (Instance && Instance.dataValues) {
                    delete Instance.dataValues.id;
                    // Instance.dataValues.current_gatha_count = Instance.dataValues.current_gatha_count;
                    Instance.dataValues.status = GATHA_STATUS.IN_PROGRESS;
                    await models.UserSutraHistory.create(Instance.dataValues, { transaction: option.transaction });
                }
            }
        }
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