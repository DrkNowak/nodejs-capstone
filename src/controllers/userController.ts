import { Request, Response } from 'express';
import { createUser, getUsers, ConflictError, ValidationError, deleteUser } from '../services/userService';

export const userController = {
  async createUser(req: Request, res: Response) {
    try {
      const { username } = req.body ?? {};
      const newUser = await createUser(username);

      return res.status(201).json(newUser);
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message });
      }

      if (err instanceof ConflictError) {
        return res.status(409).json({ error: err.message });
      }

      console.error('Unexpected error in createUser:', err);

      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getUsers(_: any, res: Response) {
    const users = await getUsers();

    return res.status(200).json(users);
  },

  async deleteUser(req: Request, res: Response) {
    try {
      const { username } = req.body ?? {};

      await deleteUser(username);

      return res.status(204).send();
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message });
      }

      console.error('Unexpected error in deleteUser:', err);

      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
