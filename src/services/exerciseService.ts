import { Exercise } from '../models/models.js';
import { insertExercise, getExercisesByUserId, getUserById } from '../utils/db';
import { toIsoDate } from '../utils/date';
import { ValidationError } from './errors';

export const getExercises = async (
  userId: string,
  { from, to, limit }: { from?: string; to?: string; limit?: string | number } = {}
) => {
  if (!userId) {
    throw new ValidationError('User ID is required');
  }

  const user = await getUserById(userId);

  if (!user) {
    throw new ValidationError('User not found');
  }

  const isoFrom = toIsoDate(from);
  const isoTo = toIsoDate(to);
  const parsedLimit = typeof limit === 'string' ? Number(limit) : limit;

  if (parsedLimit !== undefined && (isNaN(Number(parsedLimit)) || Number(parsedLimit) < 0)) {
    throw new ValidationError('Limit must be a positive number');
  }

  const exercises = await getExercisesByUserId(userId, isoFrom, isoTo, parsedLimit);

  const log = exercises.map((exercise) => ({
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date,
  }));

  return {
    username: user.username,
    _id: user._id,
    count: log.length,
    log,
  };
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
  const isoDate = toIsoDate(exerciseDate);

  if (!isoDate) return;

  await insertExercise(_id, description, durationNumber, isoDate);

  return {
    _id: user._id,
    username: user.username,
    date: isoDate,
    duration: durationNumber,
    description,
  };
}
