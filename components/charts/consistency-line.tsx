"use client";

import { ConsistencyTrendPoint } from "@/lib/types";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ConsistencyLineProps {
  data: ConsistencyTrendPoint[];
}

export function ConsistencyLine({ data }: ConsistencyLineProps) {
  return (
    <section className="neo-panel p-5 md:p-6">
      <p className="neo-label">Tren Tekanan</p>
      <h3 className="mt-1 text-lg font-black">Arah Skor Malas Harian</h3>
      <div className="chart-frame mt-4">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="#d8d8d8" strokeWidth={2} vertical={false} />
            <XAxis
              dataKey="periode"
              tickLine={false}
              axisLine={{ stroke: "#000", strokeWidth: 3 }}
              tick={{ fill: "#000", fontSize: 12, fontWeight: 700 }}
            />
            <YAxis
              tickLine={false}
              allowDecimals={false}
              domain={[0, 100]}
              axisLine={{ stroke: "#000", strokeWidth: 3 }}
              tick={{ fill: "#000", fontSize: 12, fontWeight: 700 }}
            />
            <Tooltip
              isAnimationActive={false}
              labelStyle={{ color: "#000", fontWeight: 800 }}
              contentStyle={{
                border: "3px solid #000",
                borderRadius: "0px",
                boxShadow: "4px 4px 0 #000",
                backgroundColor: "#fff",
                fontWeight: 700,
              }}
              formatter={(value) => [value ?? 0, "Skor"]}
            />
            <Line
              type="linear"
              dataKey="nilai"
              stroke="var(--primary)"
              strokeWidth={4}
              dot={{ fill: "var(--primary-dark)", r: 3, strokeWidth: 0 }}
              activeDot={{ fill: "var(--primary-dark)", r: 5 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
