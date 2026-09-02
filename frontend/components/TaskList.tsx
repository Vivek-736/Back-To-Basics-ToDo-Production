"use client";

import { useState } from "react";
import { Calendar, Edit2, Trash2, Check, ChevronDown, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export interface Task {
  id: string;
  title: string;
  dueDate?: string | null;
  priority: "High" | "Medium" | "Low";
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string, current: boolean) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  onEditTask: (id: string, title: string, priority: "High" | "Medium" | "Low") => Promise<void>;
  statusFilter: "all" | "pending" | "completed";
  onStatusFilterChange: (status: "all" | "pending" | "completed") => void;
  sortBy: "priority" | "dueDate" | "title";
  onSortByChange: (sortBy: "priority" | "dueDate" | "title") => void;
}

export default function TaskList({
  tasks,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
}: TaskListProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState<"High" | "Medium" | "Low">("Medium");

  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditPriority(task.priority);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editTitle.trim()) return;
    await onEditTask(id, editTitle.trim(), editPriority);
    setEditingTaskId(null);
  };

  const handleToggle = async (task: Task) => {
    if (!task.completed) {
      try {
        confetti({
          particleCount: 35,
          spread: 50,
          origin: { y: 0.7 },
          colors: ["#6366F1", "#818CF8", "#A5B4FC"],
        });
      } catch {}
    }
    await onToggleComplete(task.id, task.completed);
  };

  const formatDisplayDate = (dateStr?: string | null) => {
    if (!dateStr) return "Today";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Upcoming";
    }
  };

  return (
    <div className="taskpulse-card rounded-3xl p-5 md:p-6 w-full flex flex-col min-h-[480px]">
      {/* Header with Title, Filters, and Sort */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-indigo-900/20 light:border-slate-200">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-main tracking-tight">My Tasks</h2>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 control-box p-1 rounded-2xl shadow-sm">
            <button
              type="button"
              onClick={() => onStatusFilterChange("all")}
              className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition ${
                statusFilter === "all"
                  ? "btn-pill-active"
                  : "btn-pill-inactive"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => onStatusFilterChange("pending")}
              className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition ${
                statusFilter === "pending"
                  ? "btn-pill-active"
                  : "btn-pill-inactive"
              }`}
            >
              Pending
            </button>
            <button
              type="button"
              onClick={() => onStatusFilterChange("completed")}
              className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition ${
                statusFilter === "completed"
                  ? "btn-pill-active"
                  : "btn-pill-inactive"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 text-xs text-sub font-medium">
          <span>Sort by</span>
          <div className="relative inline-block">
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as any)}
              className="appearance-none control-box text-xs rounded-xl px-3 py-1.5 pr-7 outline-none cursor-pointer hover:border-indigo-500/50 transition shadow-sm"
            >
              <option value="priority" className="bg-[#0f172a] text-white light:bg-white light:text-slate-900">Priority</option>
              <option value="dueDate" className="bg-[#0f172a] text-white light:bg-white light:text-slate-900">Due Date</option>
              <option value="title" className="bg-[#0f172a] text-white light:bg-white light:text-slate-900">Title</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-sub absolute right-2 top-2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Task List Items */}
      <div className="flex flex-col gap-3 pt-4 flex-1">
        {tasks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-sub">
            <Sparkles className="w-10 h-10 text-indigo-500/40 mb-3 animate-pulse" />
            <p className="text-base font-medium text-main">No tasks found</p>
            <p className="text-xs text-sub mt-1 max-w-xs">
              Add a new task above or adjust your filter to start crushing your goals!
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`task-item-card rounded-2xl p-3.5 md:p-4 flex items-center justify-between gap-3 ${
                task.completed ? "opacity-60" : ""
              }`}
            >
              {/* Checkbox and Task Details */}
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                {/* Custom Circular Checkbox */}
                <button
                  type="button"
                  onClick={() => handleToggle(task)}
                  aria-label={task.completed ? "Mark as pending" : "Mark as completed"}
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 cursor-pointer transition ${
                    task.completed
                      ? "bg-indigo-600 border-2 border-indigo-400 text-white shadow-md shadow-indigo-600/40"
                      : "border-2 border-slate-500 hover:border-indigo-500 bg-transparent"
                  }`}
                >
                  {task.completed && <Check className="w-3 h-3 stroke-3 text-white" />}
                </button>

                {/* Title and Due Date */}
                {editingTaskId === task.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="control-box rounded-lg px-2 py-1 text-sm text-main outline-none flex-1"
                    />
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value as any)}
                      className="control-box rounded-lg px-2 py-1 text-xs text-main outline-none"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    <button
                      onClick={() => handleSaveEdit(task.id)}
                      className="btn-3d-indigo text-xs px-2.5 py-1 rounded-lg text-white font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTaskId(null)}
                      className="text-xs text-sub hover:text-main px-1.5"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col min-w-0">
                    <span
                      className={`text-sm md:text-base font-medium text-main truncate ${
                        task.completed ? "line-through opacity-60" : ""
                      }`}
                    >
                      {task.title}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-sub mt-0.5 font-medium">
                      <Calendar className="w-3 h-3 text-sub" />
                      <span>{formatDisplayDate(task.dueDate)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Badges & Actions */}
              {editingTaskId !== task.id && (
                <div className="flex items-center gap-2.5 shrink-0">
                  {/* Priority Badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      task.priority === "High"
                        ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        : task.priority === "Medium"
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        task.priority === "High"
                          ? "bg-rose-500"
                          : task.priority === "Medium"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                    />
                    {task.priority}
                  </span>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => handleStartEdit(task)}
                    title="Edit task"
                    className="w-8 h-8 rounded-xl control-box flex items-center justify-center hover:text-indigo-400 hover:border-indigo-500/40 transition shadow-sm"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => onDeleteTask(task.id)}
                    title="Delete task"
                    className="w-8 h-8 rounded-xl control-box flex items-center justify-center hover:text-rose-500 hover:border-rose-500/40 transition shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}