"use client";

import { useState, useEffect, useRef } from "react";
import { Timer, Play, Pause, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";

export default function FocusTimer() {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(25);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const presets = [25, 15, 45, 60];

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            try {
              confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.6 },
                colors: ["#38BDF8", "#6366F1", "#A855F7"],
              });
            } catch {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleSelectPreset = (minutes: number) => {
    setSelectedMinutes(minutes);
    setTimeLeft(minutes * 60);
    setIsRunning(false);
  };

  const handleToggleTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(selectedMinutes * 60);
    }
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedMinutes * 60);
  };

  // Format time MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Calculate circular progress SVG
  const totalSeconds = selectedMinutes * 60;
  const progressFraction = totalSeconds > 0 ? timeLeft / totalSeconds : 0;
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (1 - progressFraction) * circumference;

  // Calculate coordinates of the glowing indicator dot along the circular path
  const angleInDegrees = (1 - progressFraction) * 360 - 90;
  const angleInRadians = (angleInDegrees * Math.PI) / 180;
  const dotX = 110 + radius * Math.cos(angleInRadians);
  const dotY = 110 + radius * Math.sin(angleInRadians);

  return (
    <div className="taskpulse-card rounded-3xl p-5 md:p-6 w-full flex flex-col justify-between relative overflow-hidden">
      {/* Subtle Dot Grid Background */}
      <div className="timer-dot-pattern absolute inset-0 opacity-40 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2 relative z-10">
        <Timer className="w-5 h-5 text-indigo-500 stroke-[2.2]" />
        <h2 className="text-xl font-bold text-main tracking-tight">Focus Timer</h2>
      </div>

      {/* Center Circular Radial Countdown Ring */}
      <div className="flex flex-col items-center justify-center my-6 relative z-10">
        <div className="relative w-56 h-56 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 220 220">
            <defs>
              <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="50%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>

            {/* Background Muted Track */}
            <circle
              cx="110"
              cy="110"
              r={radius}
              stroke="var(--timer-track)"
              strokeWidth="5"
              fill="transparent"
            />

            {/* Glowing Active Progress Arc */}
            <circle
              cx="110"
              cy="110"
              r={radius}
              stroke="url(#timer-gradient)"
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500 ease-out"
            />
          </svg>

          {/* Glowing Indicator Dot */}
          <div
            className="absolute w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_12px_#38BDF8] pointer-events-none transition-all duration-300"
            style={{
              left: `${dotX}px`,
              top: `${dotY}px`,
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* Digital Time Display in Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl md:text-5xl font-bold text-main tracking-tight">
              {formattedTime}
            </span>
            <span className="text-xs font-semibold text-sub mt-1">Focus Time</span>
          </div>
        </div>

        {/* Preset Selector Pills */}
        <div className="flex items-center gap-2 mt-4">
          {presets.map((mins) => (
            <button
              key={mins}
              type="button"
              onClick={() => handleSelectPreset(mins)}
              className={`px-3.5 py-1 rounded-xl text-xs font-semibold cursor-pointer transition ${
                selectedMinutes === mins
                  ? "btn-pill-active"
                  : "control-box text-sub hover:text-main"
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>
      </div>

      {/* 3D Action Buttons */}
      <div className="flex flex-col gap-2.5 relative z-10 w-full">
        {/* Main 3D Start/Pause Button */}
        <button
          type="button"
          onClick={handleToggleTimer}
          className="btn-3d-indigo w-full py-3 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 fill-white stroke-none" />
              <span>Pause Focus</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white stroke-none" />
              <span>Start Focus</span>
            </>
          )}
        </button>

        {/* Secondary 3D Reset Button */}
        <button
          type="button"
          onClick={handleReset}
          className="btn-3d-dark w-full py-2.5 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}