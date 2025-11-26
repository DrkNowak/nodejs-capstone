import { Exercise } from '../models/models.js';
import { insertExercise, getExercisesByUserId } from '../utils/db';

export async function createExercise({ _id, description, duration, date }: Exercise): Promise<Exercise> {
  const newExercise = { _id, description, duration, date };

  switch (true) {
    case !newExercise._id:
      throw new Error('User ID is required');

    case !newExercise.description || typeof newExercise.description !== 'string':
      throw new Error('Description is required and must be a string');

    case !newExercise.duration || isNaN(Number(newExercise.duration)):
      throw new Error('Duration is required and must be a number');

    case newExercise.date && isNaN(Date.parse(newExercise.date)):
      throw new Error('Date must be in YYYY-MM-DD format');
  }

  return insertExercise(newExercise._id, newExercise.description, newExercise.duration, newExercise.date);
}

export const getExercises = async (userId: string) => {
  const exercises = await getExercisesByUserId(userId);

  return exercises;
};
