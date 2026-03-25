const request = require('supertest');
const app = require('../server');

describe('GET /', () => {
  it('should serve the index.html file', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('<!DOCTYPE html>');
  });
});

describe('POST /api/contact', () => {
  it('should return 400 if fields are missing', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Test' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('All fields are required');
  });
});
