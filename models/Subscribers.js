import {sequelize} from "../config/sequelize.js";
import {DataTypes, Model, Sequelize} from "sequelize";

export class Subscribers extends Model {}
Subscribers.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    tgId: {
      type: DataTypes.BIGINT(100),
      unique: true,
      allowNull: false,
      field: 'tg_id'
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    start: {
      type: DataTypes.STRING,
      defaultValue: '0',
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'subscribers',
  }
);