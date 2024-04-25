export interface TaskType {
  id: number;
  title: string;
  name: string;
  completed: boolean;
}

export interface TodoProps {
  todo: {
    id: number;
    title: string;
    completed: boolean;
  };
  todos: TaskType[];
}
