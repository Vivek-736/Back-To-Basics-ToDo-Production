"use client";

import React, { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import TaskInputBar from "@/components/TaskInputBar";
import TaskList, { Task } from "@/components/TaskList";
import FocusTimer from "@/components/FocusTimer";
import Footer from "@/components/Footer";
import { useAuth } from "@clerk/nextjs";
import {
  fetchTasksApi,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
} from "@/lib/api";

export default function Home() {
  const { getToken, isSignedIn } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all");
  const [sortBy, setSortBy] = useState<"priority" | "dueDate" | "title">("priority");
  const [isLoading, setIsLoading] = useState(false);

  // Load user tasks from backend
  const loadTasks = useCallback(async () => {
    if (!isSignedIn) {
      setTasks([]);
      return;
    }

    try {
      setIsLoading(true);
      const token = await getToken();
      if (!token) return;

      const serverTasks = await fetchTasksApi(token, statusFilter, sortBy);
      if (Array.isArray(serverTasks)) {
        setTasks(serverTasks);
      }
    } catch (err) {
      console.warn("Backend unavailable, tasks will persist locally:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, getToken, statusFilter, sortBy]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Check for pending task from session storage after sign-in
  useEffect(() => {
    if (isSignedIn && typeof window !== "undefined") {
      const pendingTitle = sessionStorage.getItem("pending_task_title");
      const pendingPriority = sessionStorage.getItem("pending_task_priority") as any;

      if (pendingTitle) {
        sessionStorage.removeItem("pending_task_title");
        sessionStorage.removeItem("pending_task_priority");
        handleAddTask(pendingTitle, pendingPriority || "Medium");
      }
    }
  }, [isSignedIn]);

  // Add Task
  const handleAddTask = async (
    title: string,
    priority: "High" | "Medium" | "Low" = "Medium"
  ) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      dueDate: new Date().toISOString(),
      priority,
      completed: false,
    };

    // Optimistic update
    setTasks((prev) => [newTask, ...prev]);

    if (isSignedIn) {
      try {
        const token = await getToken();
        if (token) {
          const created = await createTaskApi(token, {
            title,
            priority,
            dueDate: newTask.dueDate || undefined,
          });
          setTasks((prev) =>
            prev.map((t) => (t.id === newTask.id ? created : t))
          );
        }
      } catch (err) {
        console.error("Failed to persist task to backend:", err);
      }
    }
  };

  // Toggle completion
  const handleToggleComplete = async (id: string, current: boolean) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !current } : t))
    );

    if (isSignedIn) {
      try {
        const token = await getToken();
        if (token && !id.startsWith("task-")) {
          await updateTaskApi(token, id, { completed: !current });
        }
      } catch (err) {
        console.error("Failed to update task completion:", err);
      }
    }
  };

  // Delete task
  const handleDeleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));

    if (isSignedIn) {
      try {
        const token = await getToken();
        if (token && !id.startsWith("task-")) {
          await deleteTaskApi(token, id);
        }
      } catch (err) {
        console.error("Failed to delete task:", err);
      }
    }
  };

  // Edit task
  const handleEditTask = async (
    id: string,
    title: string,
    priority: "High" | "Medium" | "Low"
  ) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title, priority } : t))
    );

    if (isSignedIn) {
      try {
        const token = await getToken();
        if (token && !id.startsWith("task-")) {
          await updateTaskApi(token, id, { title, priority });
        }
      } catch (err) {
        console.error("Failed to update task details:", err);
      }
    }
  };

  // Filter tasks
  const filteredTasks = tasks
    .filter((task) => {
      if (statusFilter === "pending") return !task.completed;
      if (statusFilter === "completed") return task.completed;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "priority") {
        const weights = { High: 3, Medium: 2, Low: 1 };
        return (weights[b.priority] || 0) - (weights[a.priority] || 0);
      }
      if (sortBy === "dueDate") {
        return new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime();
      }
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <Header />

        {/* Task Input Bar */}
        <TaskInputBar onAddTask={handleAddTask} loading={isLoading} />

        {/* Main Content: 2 Columns (Tasks on Left, Focus Timer on Right) */}
        <main className="w-full max-w-7xl mx-auto px-3 md:px-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Tasks (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 w-full">
            <TaskList
              tasks={filteredTasks}
              onToggleComplete={handleToggleComplete}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              sortBy={sortBy}
              onSortByChange={setSortBy}
            />
          </div>

          {/* Right Column: Focus Timer (Spans 1 col on lg) */}
          <div className="lg:col-span-1 w-full">
            <FocusTimer />
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}