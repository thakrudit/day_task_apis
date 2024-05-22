const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('projects', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    project_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    project_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    project_team: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    project_details: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    'project-progress': {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'projects',
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
