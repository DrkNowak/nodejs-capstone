type User = {
  _id: string;
  username: string;
};

type Exercise = {
  _id: string;
  description: string;
  duration: number;
  date: string;
};

type Task = {
  description: string;
  duration: number;
  date: string;
};

type Log = {
  _id: string;
  username?: string;
  count: number;
  log: Task[];
};

export { User, Log, Exercise };
