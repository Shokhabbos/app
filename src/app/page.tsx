"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

import { useTodo } from "@/Query";
import { TaskType } from "@/interfaces/interface";
import { todoUtils } from "@/utils/todoUtils";
import Todo from "@/components/Todo";
import Loading from "@/components/loading/Loading";
import React, { useState } from "react";
import { MenuItem, Pagination, Select } from "@mui/material";

export default function Home() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");
  const getTasks = useTodo();
  const data = getTasks?.data?.data;

  // add task
  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const inputValue = event.target.task.value.trim();
    if (inputValue.length === 0) {
      toast.error("Write something!");
    } else {
      addTask.mutate({
        title: inputValue,
        id: uuidv4(),
      });
      toast.success("Task added succesfully");
    }
    event.target.task.value = "";
  };

  // add task function
  const addTask = useMutation({
    mutationFn: todoUtils.addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ type: "all" });
    },
    onError: (err) => {
      console.log(err, "error to add task");
    },
  });

  // filter
  let filterData: TaskType[] = data;

  switch (filter) {
    case "all":
      filterData = data;
      break;

    case "completed":
      filterData = data.filter((item: TaskType) => item.completed == true);
      break;

    case "uncompleted":
      filterData = data.filter((item: TaskType) => item.completed === false);
      break;
  }

  // pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = filterData
    ? Math.ceil(filterData.length / itemsPerPage)
    : 0;

  const handleChange = (event: any, value: any) => {
    setPage(value);
    console.log(event.target.value);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = page * itemsPerPage;

  const currentPageData = filterData?.slice(startIndex, endIndex);

  // loading
  if (getTasks.isLoading) return <Loading />;

  return (
    <main className="container mx-auto p-4">
      <div className="max-w-md mx-auto">
        <form className="flex items-center mb-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter task"
            className="flex-grow px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:border-blue-500"
            name="task"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Add Task
          </button>
        </form>
        <div className="text-end">
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={filter}
            label="filter"
            onChange={(e) => setFilter(e.target.value)}
            className="mb-5"
          >
            <MenuItem value={"all"}>all</MenuItem>
            <MenuItem value={"completed"}>completed</MenuItem>
            <MenuItem value={"uncompleted"}>uncompleted</MenuItem>
          </Select>
        </div>
        <ul>
          {currentPageData.length ? (
            currentPageData.map((task: TaskType) => (
              <Todo key={task.id} todo={task} todos={data} />
            ))
          ) : (
            <p className="text-gray-500">No tasks yet :(</p>
          )}
        </ul>
        <div>
          <div className="w-full  mb-24 flex items-center justify-center">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChange}
              color="primary"
              className={`${currentPageData.length ? "" : "hidden"}`}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
