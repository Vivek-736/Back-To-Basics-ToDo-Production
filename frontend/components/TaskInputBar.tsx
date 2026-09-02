"use client";

import React, { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Plus, Zap } from "lucide-react";

interface TaskInputBarProps {
  onAddTask: (title: string, priority?: "High" | "Medium" | "Low") => Promise<void>;
  loading?: boolean;
}

export default function TaskInputBar({ onAddTask, loading }: TaskInputBarProps) {
  const { isSignedIn } = useUser();
  const clerk = useClerk();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // If user is not authenticated, trigger Clerk Sign In Modal
    if (!isSignedIn) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("pending_task_title", title);
        sessionStorage.setItem("pending_task_priority", priority);
      }
      clerk.openSignIn();
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddTask(title.trim(), priority);
      setTitle("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 md:px-6 mb-6 md:mb-7">
      <form
        onSubmit={handleSubmit}
        className="w-full relative flex items-center input-bar-container rounded-2xl p-2 md:p-2.5 backdrop-blur-xl transition focus-within:border-indigo-500/50"
      >
        {/* Glowing Circular 3D (+) Button with High-Visibility Tooltip */}
        <div className="relative group mr-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              const priorities: Array<"High" | "Medium" | "Low"> = [
                "High",
                "Medium",
                "Low",
              ];
              const next =
                priorities[(priorities.indexOf(priority) + 1) % priorities.length];
              setPriority(next);
            }}
            aria-label={`Cycle priority. Current: ${priority}`}
            className="btn-3d-circle w-10 h-10 rounded-full flex items-center justify-center text-white cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* High-Visibility Inverted Custom Floating Tooltip */}
          <div className="absolute left-1/2 -top-12 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 transform scale-95 group-hover:scale-100 z-50 whitespace-nowrap">
            <div className="tooltip-box text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors">
              <span>Priority:</span>
              <span
                className={
                  priority === "High"
                    ? "text-rose-500 font-bold"
                    : priority === "Medium"
                    ? "text-amber-500 font-bold"
                    : "text-emerald-500 font-bold"
                }
              >
                {priority}
              </span>
              <span className="text-[10px] tooltip-subtext font-normal">
                (Click to switch)
              </span>
            </div>
            {/* Tooltip Arrow Pointer */}
            <div className="w-2 h-2 tooltip-arrow rotate-45 mx-auto -mt-1 transition-colors" />
          </div>
        </div>

        {/* Text Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you want to accomplish?"
          className="w-full bg-transparent text-main placeholder:text-dim text-sm md:text-base outline-none pr-3"
        />

        {/* Priority Badge Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 mr-3 shrink-0">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
              priority === "High"
                ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                : priority === "Medium"
                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
            }`}
          >
            {priority}
          </span>
        </div>

        {/* 3D Action Button: "Add Task ⚡" */}
        <button
          type="submit"
          disabled={!title.trim() || isSubmitting || loading}
          className="btn-3d-indigo text-white font-medium text-sm md:text-base px-5 py-2.5 rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
        >
          <span>Add Task</span>
          <Zap className="w-4 h-4 fill-white stroke-none" />
        </button>
      </form>
    </div>
  );
}