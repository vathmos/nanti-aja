"use client";

import { HEATMAP_DAY_LABELS, HEATMAP_SLOT_LABELS } from "@/lib/stats";
import { HeatmapPoint } from "@/lib/types";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PostponementHeatmapProps {
  data: HeatmapPoint[];
}

interface HeatCellShapeProps {
  cx?: number;
  cy?: number;
  payload?: HeatmapPoint;
}

function cellColor(value: number): string {
  if (value >= 3) {
    return "var(--primary)";
  }
  if (value >= 1) {
    return "var(--primary-soft)";
  }
  return "#ffffff";
}

function HeatCellShape({ cx = 0, cy = 0, payload }: HeatCellShapeProps) {
  const value = payload?.nilai ?? 0;
  return (
    <rect
      x={cx - 16}
      y={cy - 16}
      width={32}
      height={32}
      fill={cellColor(value)}
      stroke="#000"
      strokeWidth={3}
    />
  );
}

export function PostponementHeatmap({ data }: PostponementHeatmapProps) {
  return (
    <section className="neo-panel p-5 md:p-6">
      <p className="neo-label">Peta Mingguan</p>
      <h3 className="mt-1 text-lg font-black">Jam-Jam Rawan Malas</h3>
      <div className="chart-frame mt-4">
        <ResponsiveContainer width="100%" height={270}>
          <ScatterChart margin={{ top: 18, right: 18, left: 6, bottom: 8 }}>
            <CartesianGrid stroke="#d8d8d8" strokeWidth={2} />
            <XAxis
              type="number"
              dataKey="dayIndex"
              ticks={[0, 1, 2, 3, 4, 5, 6]}
              domain={[-0.5, 6.5]}
              tickLine={false}
              axisLine={{ stroke: "#000", strokeWidth: 3 }}
              tick={{ fill: "#000", fontSize: 12, fontWeight: 700 }}
              tickFormatter={(value: number) => HEATMAP_DAY_LABELS[value] ?? ""}
            />
            <YAxis
              type="number"
              dataKey="slotIndex"
              ticks={[0, 1, 2]}
              domain={[-0.5, 2.5]}
              tickLine={false}
              axisLine={{ stroke: "#000", strokeWidth: 3 }}
              tick={{ fill: "#000", fontSize: 12, fontWeight: 700 }}
              tickFormatter={(value: number) => HEATMAP_SLOT_LABELS[value] ?? ""}
            />
            <Tooltip
              isAnimationActive={false}
              cursor={{ stroke: "#000", strokeWidth: 2 }}
              labelFormatter={() => "Kotak Aktivitas"}
              formatter={(_unused, _name, payload) => {
                const row = payload?.payload as HeatmapPoint | undefined;
                return [
                  `${row?.nilai ?? 0} task`,
                  `${row?.hari ?? "-"} / ${row?.slot ?? "-"}`,
                ];
              }}
              contentStyle={{
                border: "3px solid #000",
                borderRadius: "0px",
                boxShadow: "4px 4px 0 #000",
                backgroundColor: "#fff",
                fontWeight: 700,
              }}
            />
            <Scatter data={data} shape={<HeatCellShape />} isAnimationActive={false} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <p className="heatmap-notes mt-3">
        0: masih waras, 1-2: mulai goyah, 3+: benar-benar malas.
      </p>
    </section>
  );
}
