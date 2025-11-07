import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/main';

describe('API Health Check', () => {
  it('should return healthy status', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      message: 'API is running'
    });
  });
});
