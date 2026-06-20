import { Router } from 'express';
import { login, register, refresh } from '../controllers/authController.js';
import { validateSchema } from '../middleware/validation.js';
import { loginSchema, registerSchema } from '../models/validationSchemas.js';

const router = Router();

router.post('/register', validateSchema(registerSchema), register);
router.post('/login', validateSchema(loginSchema), login);
router.post('/refresh', refresh);

export default router;
