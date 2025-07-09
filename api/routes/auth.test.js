import request from 'supertest';
import express from 'express';
import authRoutes from './auth.routes.js';
import User from '../models/Users.js'; // Import the User model

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    type: 'client',
    phone: '1234567890',
    address: '123 Test St'
  };

  describe('POST /api/auth/register', () => {
    it('should return 400 on registration with missing data', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
      const nameError = res.body.errors.find(e => e.path === 'name');
      expect(nameError.msg).toBe('El nombre es obligatorio.');
    });

    it('should register a user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(testUser.email);

      // Verify user was saved to the database
      const savedUser = await User.findOne({ email: testUser.email });
      expect(savedUser).not.toBeNull();
      expect(savedUser.name).toBe(testUser.name);
    });

    it('should not register a user with an existing email', async () => {
      // First, register a user
      await request(app).post('/api/auth/register').send(testUser);
      
      // Then, try to register again with the same email
      const res = await request(app).post('/api/auth/register').send(testUser);

      expect(res.statusCode).toEqual(400);
      expect(res.body.msg).toBe('Ya existe ese usuario');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a user to login with
      await request(app).post('/api/auth/register').send(testUser);
    });

    it('should not login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.msg).toBe('Credenciales inválidas');
    });

    it('should login successfully with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(testUser.email);
    });
  });
});
