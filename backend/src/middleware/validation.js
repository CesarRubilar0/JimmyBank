import logger from '../config/logger.js';

export const validateSchema = (schema) => {
  return async (req, res, next) => {
    try {
      // Validate req.body, req.query, or req.params depending on what is defined in the Zod schema
      const dataToValidate = {};
      if (schema.body) dataToValidate.body = req.body;
      if (schema.query) dataToValidate.query = req.query;
      if (schema.params) dataToValidate.params = req.params;

      // If the schema is just a flat schema, validate body by default
      const parsed = await (schema.parseAsync ? schema.parseAsync(req.body) : schema.safeParseAsync(req.body));
      
      if (parsed.success === false) {
        const errors = parsed.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        return res.status(400).json({ error: 'Validation Error', details: errors });
      }

      // Assign back validated data to request
      req.validatedBody = parsed.data;
      next();
    } catch (error) {
      if (error.name === 'ZodError') {
        const errors = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        return res.status(400).json({ error: 'Validation Error', details: errors });
      }
      logger.error('Validation middleware unexpected error:', error);
      next(error);
    }
  };
};

export default validateSchema;
