import { Exercise } from '../models/models.js';
import { Request, Response } from 'express';
import { ValidationError } from '../services/errors';
import { createExercise, getExercises } from '../services/exerciseService';

export const exerciseController = {
  async createExercise(req: Request, res: Response) {
    try {
      const { description, duration, date } = req.body ?? {};
      const { _id } = req.params;
      const newExercise = await createExercise({ _id, description, duration, date });

      return res.status(201).json(newExercise);
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message });
      }

      console.error('Unexpected error in createExercise:', err);

      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getExercises(req: Request, res: Response) {
    try {
      const { _id } = req.params;
      const exercises = await getExercises(_id);

      return res.status(200).json(exercises);
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message });
      }

      console.error('Unexpected error in getExercises:', err);

      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
