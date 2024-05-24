const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tasks', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    task_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    task_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    task_team: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    task_details: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    task_progress: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_complete: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0-notComplete, 1-complete"
    }
  }, {
    sequelize,
    tableName: 'tasks',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
