import { Router } from 'express';
import { userController } from '../controllers/userController';

export const userRoutes = Router();

userRoutes.post('/api/users', (req, res) => {
  userController.createUser(req, res);
});

userRoutes.get('/api/users', (req, res) => {
  userController.createUser(req, res);
});
