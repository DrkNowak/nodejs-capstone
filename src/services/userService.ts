import { insertUser, checkIfUserIsInDB, removeUser, listUsers } from '../database';
import { ConflictError, ValidationError } from './errors';
import { User } from '../models/models';

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

export async function getUsers(): Promise<User[]> {
  return listUsers();
}

export async function deleteUser(username: string): Promise<void> {
  if (!username || typeof username !== 'string') {
    throw new ValidationError('Username is required.');
  }

  removeUser(username);
}
