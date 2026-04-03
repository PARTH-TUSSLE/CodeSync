"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Contribution {
  date: string;
  count: number;
}

interface ContributionHeatmapProps {
  userId: string;
}

interface DayCell {
  date: string;
  count: number;
  display: boolean;
}

export default function ContributionHeatmap({
  userId,
}: ContributionHeatmapProps) {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchContributions();
    }
  }, [userId, year]);

  const fetchContributions = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Not authenticated");
        return;
      }

      const response = await axios.get<{ contributions?: Contribution[] }>(
        `http://localhost:8000/contributions/${userId}?year=${year}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setContributions(response.data.contributions || []);
    } catch (error) {
      console.error("Error fetching contributions:", error);
      setError("Failed to load contributions");
    } finally {
      setLoading(false);
    }
  };

  const getContributionLevel = (count: number): string => {
    if (count === 0) return "bg-gray-800";
    if (count <= 3) return "bg-green-900";
    if (count <= 6) return "bg-green-700";
    if (count <= 9) return "bg-green-500";
    return "bg-green-300";
  };


  const generateYearGrid = (): DayCell[][] => {
    const startDate = new Date(year, 0, 1); 
    const endDate = new Date(year, 11, 31); 


    const firstDay = new Date(startDate);
    firstDay.setDate(startDate.getDate() - startDate.getDay());


    const contributionMap = new Map(
      contributions.map((c) => [c.date, c.count]),
    );

    const weeks: DayCell[][] = [];
    let currentDate = new Date(firstDay);

   
    while (currentDate <= endDate || weeks.length < 53) {
      const week: DayCell[] = [];

 
      for (let i = 0; i < 7; i++) {
        const dateStr = currentDate.toISOString().split("T")[0];
        const count = contributionMap.get(dateStr) || 0;
        const isCurrentYear = currentDate.getFullYear() === year;
        const withinYearBounds =
          currentDate >= startDate && currentDate <= endDate;

        week.push({
          date: dateStr,
          count: isCurrentYear ? count : 0,
          display: withinYearBounds,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      weeks.push(week);

     
      if (currentDate > endDate && currentDate.getDay() === 0) break;
    }

    return weeks;
  };

  
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="contribution-heatmap bg-gray-900 p-6 rounded-lg shadow-md">
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          Loading contributions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="contribution-heatmap bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <div className="text-center py-8 text-red-600 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  const weeks = generateYearGrid();
  const totalContributions = contributions.reduce((sum, c) => sum + c.count, 0);


  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className="contribution-heatmap bg-gray-900 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h3 className="text-lg font-semibold text-gray-200">
          <span className="text-green-400 font-bold">
            {totalContributions}
          </span>{" "}
          contributions in {year}
        </h3>
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="px-3 py-1 border border-gray-700 rounded-md bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(
            (y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ),
          )}
        </select>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="inline-flex gap-1">
          <div className="flex flex-col gap-1 mr-2 text-xs text-gray-400">
            <div className="h-3"></div>
            <div className="h-3">Mon</div>
            <div className="h-3"></div>
            <div className="h-3">Wed</div>
            <div className="h-3"></div>
            <div className="h-3">Fri</div>
            <div className="h-3"></div>
          </div>

          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`w-3 h-3 rounded-sm transition-all hover:ring-2 hover:ring-gray-400 cursor-pointer ${
                    day.display
                      ? getContributionLevel(day.count)
                      : "bg-transparent"
                  }`}
                  title={
                    day.display
                      ? `${formatDate(day.date)}: ${day.count} contribution${day.count !== 1 ? "s" : ""}`
                      : ""
                  }
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-gray-800 rounded-sm border border-gray-700" />
            <div className="w-3 h-3 bg-green-900 rounded-sm" />
            <div className="w-3 h-3 bg-green-700 rounded-sm" />
            <div className="w-3 h-3 bg-green-500 rounded-sm" />
            <div className="w-3 h-3 bg-green-300 rounded-sm" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
