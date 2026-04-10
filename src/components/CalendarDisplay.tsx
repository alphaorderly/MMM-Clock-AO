import dayjs from "dayjs";
import React from "react";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export function CalendarDisplay({ now }: { now: Date }) {
  const today = dayjs(now);
  const startOfMonth = today.startOf("month");
  const daysInMonth = today.daysInMonth();
  const startDayOfWeek = startOfMonth.day(); // 0=일 ~ 6=토

  // 달력 셀 배열 (앞쪽 빈칸 + 날짜들)
  const cells: (number | null)[] = [
    ...Array<null>(startDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // 6주 고정 (42칸)으로 맞춤
  while (cells.length < 42) cells.push(null);

  const todayNum = today.date();
  const year = today.year();
  const month = today.month() + 1;

  return (
    <div className="flex flex-col items-center w-full px-2  select-none">
      <div className="text-lg font-medium tracking-wider opacity-85 mb-3">
        {year}년 {month}월
      </div>

      <div className="grid grid-cols-7 w-full mb-1 pb-1 border-b border-white/20">
        {DAY_LABELS.map((d, i) => (
          <div
            key={d}
            className={[
              "text-center text-[15px] font-medium py-1 uppercase tracking-wide",
              i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "opacity-65",
            ].join(" ")}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 w-full gap-0.5">
        {cells.map((day, idx) => {
          const colIdx = idx % 7;
          const isToday = day === todayNum;

          let textColor = "opacity-85";
          if (colIdx === 0) textColor = "text-red-400";
          else if (colIdx === 6) textColor = "text-blue-400";

          return (
            <div key={idx} className="flex items-center justify-center">
              {day !== null && (
                <span
                  className={[
                    "text-[15px] font-light w-7 h-7 flex items-center justify-center rounded",
                    isToday ? "bg-white text-black font-medium" : textColor,
                  ].join(" ")}
                >
                  {day}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
