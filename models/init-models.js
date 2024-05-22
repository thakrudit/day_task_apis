var DataTypes = require("sequelize").DataTypes;
var _projects = require("./projects");
var _users = require("./users");

function initModels(sequelize) {
  var projects = _projects(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);


  return {
    projects,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
