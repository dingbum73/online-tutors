'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Record extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Record.belongsTo(models.User, { foreignKey: 'userId' })
      Record.belongsTo(models.Teacher, { foreignKey: 'teacherId' })
    }
  };
  Record.init({
    userId: DataTypes.INTEGER,
    teacherId: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    duringTime: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Record',
    tableName: 'Records',
    underscored: true
  })
  return Record
}
