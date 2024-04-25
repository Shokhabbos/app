import { customAxios } from "@/configs/axios.config";

export const todoUtils = {
  getTodos: async () => {
    const data = await customAxios.get("tasks");
    return data;
  },
  addTodo: async ({ title, id }: { title: string; id: string }) => {
    const task = {
      title,
      id,
    };
    const data = customAxios.post("tasks", task);
    return data;
  },
  editTodo: async ({ id, complete }: { id: number; complete: boolean }) => {
    const data = await customAxios.put(`tasks/${id}`, {
      completed: complete,
    });
    return data;
  },
  deleteTodo: async (id: number) => {
    const data = await customAxios.delete(`tasks/${id}`);
    return data;
  },
};
