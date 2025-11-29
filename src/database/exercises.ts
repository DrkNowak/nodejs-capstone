import { db } from './connection';

async function insertExercise(
  _id: string,
  description: string,
  duration: number,
  date: string
): Promise<{ _id: string; description: string; duration: number; date: string }> {
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

async function getExercisesByUserId(
  userId: string,
  from?: string,
  to?: string,
  limit?: number
): Promise<{ _id: string; description: string; duration: number; date: string }[]> {
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

    let query = `SELECT _id, description, duration, date FROM exercises WHERE ${conditions.join(' AND ')} ORDER BY date ASC`;

    if (limit) {
      query += ' LIMIT ?';
      params.push(limit);
    }

    db.all(
      query,
      params,
      (err: Error | null, rows: { _id: string; description: string; duration: number; date: string }[]) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      }
    );
  });
}

export { getExercisesByUserId, insertExercise };
