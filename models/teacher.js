'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Teacher.belongsTo(models.User, { foreignKey: 'userId', as: 'isUser' })
    }
  };
  Teacher.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    teachingStyle: DataTypes.TEXT,
    duringTime: DataTypes.STRING,
    url: DataTypes.STRING,
    appointment: DataTypes.JSON,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Teacher',
    tableName: 'Teachers',
    underscored: true
  })
  return Teacher
}
