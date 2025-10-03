import { Exercise } from '../models/models.js';

export const createExercise = async (userId, description, duration, date) => {
  const newExercise = { userId, description, duration, date };
  return newExercise;
};

// export const getExercises = async (userId) => {
//   const exercises = await Exercise.find({ userId });
//   return exercises;
// };
