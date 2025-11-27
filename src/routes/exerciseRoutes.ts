import { Router } from 'express';
import { exerciseController } from '../controllers/exerciseController';

export const exerciseRoutes = Router();

exerciseRoutes.post('/api/users/:_id/exercises', (req, res) => {
  exerciseController.createExercise(req, res);
});

exerciseRoutes.get('/api/users/:_id/exercises', (req, res) => {
  exerciseController.getExercises(req, res);
});
