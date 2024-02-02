import {sequelize} from "../config/sequelize.js";
import {DataTypes, Model, Sequelize} from "sequelize";

export class User extends Model {}
User.init(
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
    gptMessages: {
      type: DataTypes.TEXT,
      defaultValue: '[]',
      allowNull: false,
      field: 'gpt_messages'
    },
    dalleMessages: {
      type: DataTypes.TEXT,
      defaultValue: '[]',
      allowNull: false,
      field: 'dalle_messages'
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      field: 'is_admin'
    },
    dalleRequestsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      field: 'dalle_requests_count'
    },
    freeRequests: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      field: 'free_requests',
    },
  },
  {
    sequelize,
    modelName: 'user',
  }
);