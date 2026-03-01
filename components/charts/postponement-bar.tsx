"use client";

import { DailyPostponementPoint } from "@/lib/types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PostponementBarProps {
  data: DailyPostponementPoint[];
}

export function PostponementBar({ data }: PostponementBarProps) {
  return (
    <section className="neo-panel p-5 md:p-6">
      <p className="neo-label">Aktivitas 7 Hari</p>
      <h3 className="mt-1 text-lg font-black">Distribusi Aksi Task Harian</h3>
      <div className="chart-frame mt-4">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#d8d8d8" strokeWidth={2} vertical={false} />
            <XAxis
              dataKey="tanggal"
              tickLine={false}
              axisLine={{ stroke: "#000", strokeWidth: 3 }}
              tick={{ fill: "#000", fontSize: 12, fontWeight: 700 }}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={{ stroke: "#000", strokeWidth: 3 }}
              tick={{ fill: "#000", fontSize: 12, fontWeight: 700 }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, fontWeight: 700 }}
              iconType="square"
            />
            <Tooltip
              isAnimationActive={false}
              cursor={{ fill: "#d9d9d9" }}
              labelStyle={{ color: "#000", fontWeight: 800 }}
              contentStyle={{
                border: "3px solid #000",
                borderRadius: "0px",
                boxShadow: "4px 4px 0 #000",
                backgroundColor: "#fff",
                fontWeight: 700,
              }}
              formatter={(value, name) => [`${value ?? 0} task`, `${name}`]}
            />
            <Bar
              name="Besok aja"
              dataKey="besokAja"
              fill="var(--primary)"
              stroke="var(--primary-dark)"
              strokeWidth={2}
              radius={[0, 0, 0, 0]}
              isAnimationActive={false}
            />
            <Bar
              name="Ga jadi"
              dataKey="gaJadi"
              fill="#111111"
              stroke="#000"
              strokeWidth={2}
              radius={[0, 0, 0, 0]}
              isAnimationActive={false}
            />
            <Bar
              name="Selesai"
              dataKey="selesai"
              fill="#6dbf5f"
              stroke="#000"
              strokeWidth={2}
              radius={[0, 0, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
