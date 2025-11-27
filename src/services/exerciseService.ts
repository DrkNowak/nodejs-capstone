import { Exercise } from '../models/models.js';
import { insertExercise, getExercisesByUserId, getUserById } from '../utils/db';
import { ValidationError } from './errors';

export const getExercises = async (userId: string) => {
  if (!userId) {
    throw new ValidationError('User ID is required');
  }

  const exercises = await getExercisesByUserId(userId);

  return exercises;
};

export async function createExercise({ _id, description, duration, date }: Exercise) {
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

  const user = await getUserById(_id);

  if (!user) {
    throw new ValidationError('User not found');
  }

  const durationNumber = Number(duration);
  const exerciseDate = date ? new Date(date) : new Date();
  const formattedDate = exerciseDate.toDateString();

  await insertExercise(_id, description, durationNumber, formattedDate);

  const exercises = await getExercisesByUserId(_id);

  return {
    _id: user._id,
    username: user.username,
    exercises: exercises || [],
  };
}
