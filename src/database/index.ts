export { db, initDB, killDBConnection } from './connection';
export { checkIfUserIsInDB, getUserById, insertUser, listUsers, removeUser } from './users';
export { insertExercise, getExercisesByUserId } from './exercises';
