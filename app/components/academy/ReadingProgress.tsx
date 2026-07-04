"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      setProgress(total > 0 ? (scrollTop / total) * 100 : 0);
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      className="fixed top-20 md:top-[118px] left-0 right-0 z-30 h-0.5 pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full bg-[#d89ca4] transition-none"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
