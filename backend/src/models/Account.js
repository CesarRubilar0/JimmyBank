import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Account extends Model {}

Account.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    account_type: {
      type: DataTypes.ENUM('VISTA', 'CORRIENTE', 'AHORRO'),
      allowNull: false,
    },
    account_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    balance: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      get() {
        const rawValue = this.getDataValue('balance');
        return rawValue ? parseInt(rawValue, 10) : 0;
      },
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'blocked'),
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    modelName: 'Account',
    tableName: 'accounts',
    underscored: true,
  }
);

export default Account;
