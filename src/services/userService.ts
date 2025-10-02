import { insertUser, checkIfUserIsInDB } from '../utils/db';

export class ConflictError extends Error {}
export class ValidationError extends Error {}

export async function createUser(username: string) {
  if (!username || typeof username !== 'string') {
    throw new ValidationError('Username is required.');
  }

  if (username.trim().length < 3) {
    throw new ValidationError('Username must be at least 3 characters.');
  }

  if (await checkIfUserIsInDB(username)) {
    throw new ConflictError('User already exists (case-insensitive).');
  }

  return insertUser(username.trim());
}
