import sequelize from '../config/db.js';
import { User, Account } from '../models/index.js';
import logger from '../config/logger.js';

export const syncDatabase = async (force = false) => {
  try {
    logger.info(`Syncing database tables (force=${force})...`);
    await sequelize.sync({ force });
    logger.info('Database tables synced successfully.');

    // Seed default users if users table is empty
    const userCount = await User.count();
    if (userCount === 0) {
      logger.info('Seeding default users into the database...');

      const seedUsers = [
        {
          email: 'admin@bank.com',
          password: 'Jimmy1234',
          first_name: 'Admin',
          last_name: 'General',
          dni: '11111111-1',
          phone: '+56911111111',
          address: 'Santiago, Chile',
          role: 'admin_general',
          status: 'active',
        },
        {
          email: 'admincuentas@bank.com',
          password: 'Jimmy1234',
          first_name: 'Admin',
          last_name: 'Cuentas',
          dni: '22222222-2',
          phone: '+56922222222',
          address: 'Santiago, Chile',
          role: 'admin_cuentas',
          status: 'active',
        },
        {
          email: 'cliente@bank.com',
          password: 'Jimmy1234',
          first_name: 'Juan',
          last_name: 'Pérez',
          dni: '33333333-3',
          phone: '+56933333333',
          address: 'Santiago, Chile',
          role: 'client',
          status: 'active',
        },
      ];

      // Bulk create will trigger beforeSave hook for hashing passwords
      await User.bulkCreate(seedUsers, { validate: true, individualHooks: true });
      logger.info('Seeding completed successfully.');

      // Also create an initial bank account for client to test dashboard immediately
      const client = await User.findOne({ where: { email: 'cliente@bank.com' } });
      if (client) {
        await Account.create({
          user_id: client.id,
          account_type: 'VISTA',
          account_number: '1234567890',
          balance: 1500,
          status: 'active',
        });
        logger.info('Seed account created for client cliente@bank.com.');
      }
    } else {
      logger.info('Database already has data. Skipping seeders.');
    }
  } catch (error) {
    logger.error('Error during database synchronization or seeding:', error);
    throw error;
  }
};

export default syncDatabase;
