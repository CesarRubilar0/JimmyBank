import request from 'supertest';
import app from '../src/server.js';
import sequelize from '../src/config/db.js';

describe('API Health Check', () => {
  // Close database connection after tests
  afterAll(async () => {
    await sequelize.close();
  });

  it('should return 200 OK for /health', async () => {
    // Note: since connection boots asynchronously, we just test if route is defined
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
  });
});
