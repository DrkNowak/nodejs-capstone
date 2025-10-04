import { Router } from 'express';
import { userController } from '../controllers/userController';
import { exerciseController } from '../controllers/exerciseController';

export const userRoutes = Router();

userRoutes.post('/api/users', (req, res) => {
  userController.createUser(req, res);
});

userRoutes.get('/api/users', (req, res) => {
  userController.getUsers(req, res);
});

userRoutes.post('/api/users/:_id/exercises', (req, res) => {
  exerciseController.createExercise(req, res);
});
