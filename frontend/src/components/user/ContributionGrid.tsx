"use client";

import { useState } from "react";
import type { Contribution } from "@/types/models";
import type { MouseEvent } from "react";

interface ContributionGridProps {
  contributions: Contribution[];
  year: number;
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const CELL_SIZE = 12;
const CELL_GAP = 2;

const intensityClasses = [
  "fill-[var(--contr-0)]",
  "fill-[var(--contr-1)]",
  "fill-[var(--contr-2)]",
  "fill-[var(--contr-3)]",
  "fill-[var(--contr-4)]",
];

function getIntensity(count: number): string {
  if (count === 0) return intensityClasses[0];
  if (count <= 3) return intensityClasses[1];
  if (count <= 6) return intensityClasses[2];
  if (count <= 9) return intensityClasses[3];
  return intensityClasses[4];
}

interface TooltipData {
  date: string;
  count: number;
  left: number;
  top: number;
  flipBelow: boolean;
}

export function ContributionGrid({ contributions, year }: ContributionGridProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const contribMap = new Map<string, number>();
  for (const c of contributions) {
    contribMap.set(c.date, c.count);
  }

  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  const startDay = startDate.getDay();

  const weeks: { date: Date; count: number }[][] = [];
  let currentWeek: { date: Date; count: number }[] = [];

  for (let d = 0; d < startDay; d++) {
    currentWeek.push({ date: new Date(startDate.getTime() - (startDay - d) * 86400000), count: 0 });
  }

  const cursor = new Date(startDate);
  while (cursor <= endDate) {
    const dateStr = cursor.toISOString().slice(0, 10);
    const count = contribMap.get(dateStr) ?? 0;
    currentWeek.push({ date: new Date(cursor), count });
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      const lastDate = currentWeek[currentWeek.length - 1].date;
      const nextDate = new Date(lastDate);
      nextDate.setDate(nextDate.getDate() + 1);
      currentWeek.push({ date: nextDate, count: 0 });
    }
    weeks.push(currentWeek);
  }

  const svgWidth = weeks.length * (CELL_SIZE + CELL_GAP) + 40;
  const svgHeight = 7 * (CELL_SIZE + CELL_GAP) + 20;

  const handleMouseEnter = (day: { date: Date; count: number }, e: MouseEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const left = Math.min(Math.max(rect.left + rect.width / 2, 80), window.innerWidth - 80);
    const top = rect.top;

    const dateStr = day.date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    setTooltip({
      date: dateStr,
      count: day.count,
      left,
      top,
      flipBelow: top < 90,
    });
  };

  return (
    <div className="relative inline-block">
      <svg
        width={svgWidth}
        height={svgHeight}
        className="overflow-visible"
        onMouseLeave={() => setTooltip(null)}
      >
        {DAYS_OF_WEEK.map((day, rowIdx) => (
          <text
            key={day}
            x={0}
            y={rowIdx * (CELL_SIZE + CELL_GAP) + CELL_SIZE - 2}
            className="fill-[var(--subtle)] text-[10px]"
          >
            {rowIdx % 2 === 0 ? day : ""}
          </text>
        ))}
        {weeks.map((week, colIdx) =>
          week.map((day, rowIdx) => (
            <rect
              key={`${colIdx}-${rowIdx}`}
              x={colIdx * (CELL_SIZE + CELL_GAP) + 30}
              y={rowIdx * (CELL_SIZE + CELL_GAP) + 6}
              width={CELL_SIZE}
              height={CELL_SIZE}
              rx={2}
              className={`${getIntensity(day.count)} cursor-pointer`}
              onMouseEnter={(e) => handleMouseEnter(day, e)}
            />
          )),
        )}
      </svg>
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 rounded bg-surface-tertiary px-2 py-1 text-xs text-primary shadow-lg"
          style={{
            left: tooltip.left,
            top: tooltip.flipBelow ? tooltip.top + CELL_SIZE + 8 : tooltip.top - 8,
            transform: tooltip.flipBelow ? "translateX(-50%)" : "translate(-50%, -100%)",
          }}
        >
          {tooltip.count > 0
            ? `${tooltip.count} contribution${tooltip.count === 1 ? "" : "s"} on ${tooltip.date}`
            : `No contributions on ${tooltip.date}`}
        </div>
      )}
    </div>
  );
}
