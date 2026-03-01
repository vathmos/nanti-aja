export type TaskStatus = "not_started" | "in_progress" | "done";

export interface TaskItem {
  id: string;
  judul: string;
  dueDate: string | null;
  status: TaskStatus;
  isClosed: boolean;
  jumlahPenundaan: number;
  jumlahGaJadi: number;
  riwayatAlasanGaJadi: string[];
  riwayatTanggal: string[];
  riwayatGaJadiTanggal: string[];
  riwayatSelesaiTanggal: string[];
  dibuatPada: string;
  diperbaruiPada: string;
}

export interface DashboardState {
  items: TaskItem[];
  malasMeter: number;
  reusableReasons: string[];
  lastUpdate: string;
}

export interface DailyPostponementPoint {
  tanggal: string;
  besokAja: number;
  gaJadi: number;
  selesai: number;
}

export interface ConsistencyTrendPoint {
  periode: string;
  nilai: number;
}

export interface HeatmapPoint {
  dayIndex: number;
  slotIndex: number;
  hari: string;
  slot: string;
  nilai: number;
}
