import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/db.js';

class User extends Model {
  // Method to check if password is correct
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dni: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM(
        'client',
        'admin_general',
        'admin_accounts',
        'admin_cuentas',
        'admin_savings',
        'admin_checking',
        'admin_vista'
      ),
      defaultValue: 'client',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'blocked'),
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    hooks: {
      beforeSave: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

export default User;
