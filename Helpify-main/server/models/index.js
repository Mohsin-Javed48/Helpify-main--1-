"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

// Add connection pool configuration to prevent timeouts
const poolConfig = {
  max: 10, // Maximum number of connection in pool
  min: 0, // Minimum number of connection in pool
  acquire: 60000, // Maximum time (ms) that pool will try to get connection before throwing error
  idle: 10000, // Maximum time (ms) that a connection can be idle before being released
  evict: 1000, // How frequently to check for idle connections to evict
  retry: {
    max: 3, // How many times to retry connecting
  },
};

// Merge pool config with existing config
const connectionConfig = {
  ...config,
  pool: poolConfig,
  dialectOptions: {
    ...config.dialectOptions,
    connectTimeout: 60000, // Increase connection timeout
  },
};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(
    process.env[config.use_env_variable],
    connectionConfig
  );
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    connectionConfig
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Add handler for connection issues
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
