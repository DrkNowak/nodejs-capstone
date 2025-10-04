type User = {
  _id: string;
  username: string;
};

type Exercise = {
  username?: string;
  description: string;
  duration: string;
  date: string;
  _id: string;
};

type Task = {
  description: string;
  duration: number;
  date: string;
};

type Log = {
  username: string;
  _id: string;
  count: number;
  log: Task[];
};

export { User, Log, Exercise };
