import { Router } from 'express';
import {
  createAccount,
  getMyAccounts,
  getAllAccounts,
  blockAccount,
  getAccountBalance,
} from '../controllers/accountController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { validateSchema } from '../middleware/validation.js';
import { blockAccountSchema, createAccountSchema } from '../models/validationSchemas.js';

const router = Router();

// Apply auth token validation to all account routes
router.use(authenticateToken);

// Client actions
router.post('/', authorizeRoles('client'), validateSchema(createAccountSchema), createAccount);
router.get('/my', authorizeRoles('client'), getMyAccounts);
router.get('/:id/balance', getAccountBalance);

// Admin actions
router.get('/all', authorizeRoles('admin_general', 'admin_accounts', 'admin_cuentas'), getAllAccounts);
router.put('/:id/block', authorizeRoles('admin_general', 'admin_accounts', 'admin_cuentas'), validateSchema(blockAccountSchema), blockAccount);

export default router;
