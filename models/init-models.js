var DataTypes = require("sequelize").DataTypes;
var _task_members = require("./task_members");

function initModels(sequelize) {
  var task_members = _task_members(sequelize, DataTypes);


  return {
    task_members,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
