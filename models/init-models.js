var DataTypes = require("sequelize").DataTypes;
var _tasks = require("./tasks");
var _users = require("./users");

function initModels(sequelize) {
  var tasks = _tasks(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);


  return {
    tasks,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
