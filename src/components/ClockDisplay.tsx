import React from "react";

export function ClockDisplay({ now }: { now: Date }) {
  const h = now.getHours().toString().padStart(2, "0");
  const m = now.getMinutes().toString().padStart(2, "0");
  const s = now.getSeconds().toString().padStart(2, "0");

  const weekdays = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const weekday = weekdays[now.getDay()];
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  return (
    <div className="flex flex-col items-center gap-1">
      {/* 3-column typographic time */}
      <div className="flex items-stretch gap-0">
        {/* 시 */}
        <div className="flex items-center px-4">
          <span className="tabular-nums text-[40px] font-extralight leading-none">
            {h}
          </span>
        </div>
        {/* separator */}
        <div className="w-px bg-white/15 self-stretch mx-1" />
        {/* 분 */}
        <div className="flex items-center px-4">
          <span className="tabular-nums text-[40px] font-extralight leading-none">
            {m}
          </span>
        </div>
        {/* separator */}
        <div className="w-px bg-white/15 self-stretch mx-1" />
        {/* 초 */}
        <div className="flex items-center px-4">
          <span className="tabular-nums text-[40px] font-extralight leading-none opacity-60">
            {s}
          </span>
        </div>
      </div>
      {/* date */}
      <div className="text-[15px] font-light tracking-[0.08em] opacity-75 mt-1">
        {year}년 {month}월 {day}일&nbsp;{weekday}
      </div>
    </div>
  );
}
