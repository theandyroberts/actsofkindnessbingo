"use client";

import { useState, useEffect } from "react";

const DEADLINE = new Date("2026-03-13T23:59:59");

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const now = new Date();
    const diff = DEADLINE.getTime() - now.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      expired: false,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (timeLeft.expired) {
    return (
      <div className="text-center">
        <p className="text-lg font-semibold text-pink-600">
          The game has ended! Thanks for playing!
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-3 sm:gap-4">
      {[
        { value: timeLeft.days, label: "Days" },
        { value: timeLeft.hours, label: "Hours" },
        { value: timeLeft.minutes, label: "Min" },
        { value: timeLeft.seconds, label: "Sec" },
      ].map((item) => (
        <div
          key={item.label}
          className="bg-white rounded-xl shadow-sm px-3 py-2 sm:px-5 sm:py-3 text-center min-w-[60px]"
        >
          <div className="text-2xl sm:text-3xl font-bold text-pink-600">
            {String(item.value).padStart(2, "0")}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
