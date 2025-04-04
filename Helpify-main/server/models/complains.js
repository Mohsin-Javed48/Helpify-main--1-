const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Complains extends Model {
    static associate(models) {
      // Complains belongs to a user (customer)
      if (models.User) {
        Complains.belongsTo(models.User, {
          foreignKey: "userId",
          as: "customer",
        });
      }
    }
  }
  Complains.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "Complains",
      tableName: "Complains",
      timestamps: true,
    }
  );

  return Complains;
};
