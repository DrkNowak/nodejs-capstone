import type { Exercise } from '../common/types/model';
import { insertExercise, getExercisesByUserId, getUserById } from '../database';
import { toIsoDate } from '../common/utils/date';
import { ValidationError } from '../common/errors';
import { GetExercisesParams } from '../common/types/requestParams';

export const getExercises = async ({ userId, from, to, limit }: GetExercisesParams) => {
  if (!userId) {
    throw new ValidationError('User ID is required');
  }

  const user = await getUserById(userId);

  if (!user) {
    throw new ValidationError('User not found');
  }

  const isoFrom = toIsoDate(from);
  const isoTo = toIsoDate(to);
  const parsedLimit = Number(limit);

  if (isNaN(parsedLimit) || parsedLimit < 1) {
    throw new ValidationError('Limit must be a positive number');
  }

  const exercises = await getExercisesByUserId({ userId, from: isoFrom, to: isoTo, limit: parsedLimit });

  const log = exercises.map(({ description, duration, date }) => ({
    description,
    duration,
    date,
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

  await insertExercise({ _id, description, duration: durationNumber, date: isoDate });

  return {
    _id: user._id,
    username: user.username,
    date: isoDate,
    duration: durationNumber,
    description,
  };
}
