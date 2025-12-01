import { db } from './connection';
import type { Exercise } from '../common/types/model';
import { GetExercisesParams } from '../common/types/requestParams';

async function insertExercise({ _id, description, duration, date }: Exercise): Promise<Exercise> {
  try {
    await new Promise<void>((resolve, reject) => {
      const dbQuery = db.prepare('INSERT INTO exercises (_id, description, duration, date) VALUES (?, ?, ?, ?)');

      dbQuery.run(_id, description, duration, date, (err: Error | null) => {
        dbQuery.finalize();
        if (err) return reject(err);
        resolve();
      });
    });

    return { _id, description, duration, date };
  } catch (error) {
    throw error;
  }
}

async function getExercisesByUserId({ userId, from, to, limit }: GetExercisesParams): Promise<Exercise[]> {
  return new Promise((resolve, reject) => {
    const conditions = ['_id = ?'];
    const params: (string | number)[] = [userId];

    if (from) {
      conditions.push('date >= ?');
      params.push(from);
    }

    if (to) {
      conditions.push('date <= ?');
      params.push(to);
    }

    let query = `SELECT _id, description, duration, date FROM exercises WHERE ${conditions.join(
      ' AND '
    )} ORDER BY date ASC`;

    if (limit) {
      query += ' LIMIT ?';
      params.push(limit);
    }

    db.all(query, params, (err: Error | null, rows: Exercise[]) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

export { getExercisesByUserId, insertExercise };
