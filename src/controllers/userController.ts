import { Request, Response } from 'express';
import { createUser, ConflictError, ValidationError } from '../services/userService';

export const userController = {
  async createUser(req: Request, res: Response) {
    try {
      const { username } = req.body ?? {};
      const user = await createUser(username);

      return res.status(201).json(user);
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
};
