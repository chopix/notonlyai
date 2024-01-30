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
    period: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    start: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'subscribers',
  }
);