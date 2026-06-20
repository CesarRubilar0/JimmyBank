import User from './User.js';
import Account from './Account.js';

// Setup associations
User.hasMany(Account, { foreignKey: 'user_id', as: 'accounts' });
Account.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export { User, Account };
export default { User, Account };
