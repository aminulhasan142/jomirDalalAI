"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { KhatianOwner } from "@/lib/types";
import { formatBanglaNumber } from "@/lib/utils";

interface SharePieChartProps {
  owners: KhatianOwner[];
  height?: number;
}

export function SharePieChart({ owners, height = 260 }: SharePieChartProps) {
  const COLORS = [
    "#047857", // emerald-700
    "#d97706", // amber-600
    "#2563eb", // blue-600
    "#7c3aed", // violet-600
    "#db2777", // pink-600
    "#0891b2", // cyan-600
    "#4b5563", // gray-600
  ];

  const data = owners.map((owner, idx) => ({
    name: owner.name,
    value: Number((owner.ownership_percentage || 0).toFixed(2)),
    color: COLORS[idx % COLORS.length],
  }));

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={85}
              innerRadius={48}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(val: any) => [`${formatBanglaNumber(val)}%`, "মালিকানা"]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg"
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="font-medium text-gray-700">
              {item.name}
            </span>
            <span className="font-bold text-gray-900">
              ({formatBanglaNumber(item.value)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
