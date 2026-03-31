// src/components/analytics/PeakHoursChart.tsx
import React from 'react';

interface PeakHoursChartProps {
  data: { day: number; hour: number; count: number }[];
}

export default function PeakHoursChart({ data }: PeakHoursChartProps) {
  if (!data || data.length === 0) return null;

  const maxCount = Math.max(...data.map(d => d.count), 1);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 17 }, (_, i) => i + 6); // 6 AM to 10 PM

  const getOpacity = (count: number) => {
    if (count === 0) return 0.05;
    return 0.1 + (count / maxCount) * 0.9;
  };

  const getTooltipText = (d: number, h: number, count: number) => {
    const dayName = days[d];
    const hourName = h > 12 ? `${h - 12} PM` : h === 12 ? '12 PM' : `${h} AM`;
    return `${dayName} at ${hourName}: ${count} bookings`;
  };

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-[500px]">
        {/* Hours Header */}
        <div className="flex ml-10 mb-2">
          {hours.map(h => (
            <div key={h} className="flex-1 text-center text-[8px] text-text-dim">
              {h > 12 ? `${h - 12}p` : h === 12 ? '12p' : `${h}a`}
            </div>
          ))}
        </div>

        {/* Heatmap Grid */}
        <div className="space-y-1">
          {days.map((day, d) => (
            <div key={d} className="flex items-center gap-1">
              <div className="w-8 text-[10px] text-text-dim text-right pr-2">
                {day}
              </div>
              <div className="flex flex-1 gap-1">
                {hours.map(h => {
                  const cell = data.find(item => item.day === d && item.hour === h);
                  const count = cell ? cell.count : 0;
                  const opacity = getOpacity(count);

                  return (
                    <div
                      key={h}
                      className="flex-1 aspect-square rounded-sm bg-primary transition-opacity duration-300 relative group cursor-pointer"
                      style={{ opacity }}
                      title={getTooltipText(d, h, count)}
                    >
                      {/* Tooltip on hover */}
                      {count > 0 && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-[10px] whitespace-nowrap px-2 py-1 rounded opacity-0 group-hover:opacity-100 z-10 border border-border pointer-events-none shadow-md">
                          {getTooltipText(d, h, count)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-text-dim">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-primary opacity-5"></div>
            <div className="w-3 h-3 rounded-sm bg-primary opacity-25"></div>
            <div className="w-3 h-3 rounded-sm bg-primary opacity-50"></div>
            <div className="w-3 h-3 rounded-sm bg-primary opacity-75"></div>
            <div className="w-3 h-3 rounded-sm bg-primary opacity-100"></div>
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
