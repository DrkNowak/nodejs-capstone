import { Exercise } from '../models/models.js';
import { insertExercise, getExercisesByUserId } from '../utils/db';
import { ValidationError } from './errors';

export async function createExercise({ _id, description, duration, date }: Exercise): Promise<Exercise> {
  switch (true) {
    case !_id:
      throw new ValidationError('User ID is required');

    case !description || typeof description !== 'string':
      throw new ValidationError('Description is required and must be a string');

    case !duration || isNaN(Number(duration)):
      throw new ValidationError('Duration is required and must be a number');

    case date && isNaN(Date.parse(date)):
      throw new ValidationError('Date must be in YYYY-MM-DD format');
  }

  return insertExercise(_id, description, duration, date);
}

export const getExercises = async (userId: string) => {
  const exercises = await getExercisesByUserId(userId);

  return exercises;
};
