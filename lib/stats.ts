import {
  ConsistencyTrendPoint,
  DailyPostponementPoint,
  HeatmapPoint,
  TaskItem,
} from "@/lib/types";

const HARI_LABEL = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"] as const;
const SLOT_LABEL = ["Pagi", "Siang", "Malam"] as const;

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.max(minimum, Math.min(maximum, value));

function keyTanggalLokal(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function labelTanggal(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
  });
}

function indexHari(date: Date): number {
  return (date.getDay() + 6) % 7;
}

function indexSlot(date: Date): number {
  const hour = date.getHours();
  if (hour < 11) {
    return 0;
  }
  if (hour < 17) {
    return 1;
  }
  return 2;
}

function applyCount(
  map: Map<string, DailyPostponementPoint>,
  key: string,
  field: "besokAja" | "gaJadi" | "selesai",
): void {
  const current = map.get(key) ?? {
    tanggal: key,
    besokAja: 0,
    gaJadi: 0,
    selesai: 0,
  };
  current[field] += 1;
  map.set(key, current);
}

export function agregasiHarian(
  items: TaskItem[],
  jumlahHari = 7,
): DailyPostponementPoint[] {
  const counts = new Map<string, DailyPostponementPoint>();

  items.forEach((item) => {
    item.riwayatTanggal.forEach((isoTime) => {
      const date = new Date(isoTime);
      if (Number.isNaN(date.getTime())) {
        return;
      }
      applyCount(counts, keyTanggalLokal(date), "besokAja");
    });

    item.riwayatGaJadiTanggal.forEach((isoTime) => {
      const date = new Date(isoTime);
      if (Number.isNaN(date.getTime())) {
        return;
      }
      applyCount(counts, keyTanggalLokal(date), "gaJadi");
    });

    item.riwayatSelesaiTanggal.forEach((isoTime) => {
      const date = new Date(isoTime);
      if (Number.isNaN(date.getTime())) {
        return;
      }
      applyCount(counts, keyTanggalLokal(date), "selesai");
    });
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const series: DailyPostponementPoint[] = [];
  for (let offset = jumlahHari - 1; offset >= 0; offset -= 1) {
    const cursor = new Date(today);
    cursor.setDate(today.getDate() - offset);
    const key = keyTanggalLokal(cursor);
    const row = counts.get(key);
    series.push({
      tanggal: labelTanggal(cursor),
      besokAja: row?.besokAja ?? 0,
      gaJadi: row?.gaJadi ?? 0,
      selesai: row?.selesai ?? 0,
    });
  }

  return series;
}

export function agregasiTrenKonsistensi(
  items: TaskItem[],
  jumlahHari = 14,
): ConsistencyTrendPoint[] {
  const daily = agregasiHarian(items, jumlahHari);
  let momentum = 0;

  return daily.map((point) => {
    momentum =
      momentum +
      point.besokAja * 9 +
      point.gaJadi * 14 -
      point.selesai * 10 -
      2;

    return {
      periode: point.tanggal,
      nilai: clamp(Math.round(momentum), 0, 100),
    };
  });
}

export function agregasiHeatmapMingguan(items: TaskItem[]): HeatmapPoint[] {
  const matrix = new Map<string, HeatmapPoint>();

  for (let dayIndex = 0; dayIndex < HARI_LABEL.length; dayIndex += 1) {
    for (let slotIndex = 0; slotIndex < SLOT_LABEL.length; slotIndex += 1) {
      const key = `${dayIndex}-${slotIndex}`;
      matrix.set(key, {
        dayIndex,
        slotIndex,
        hari: HARI_LABEL[dayIndex],
        slot: SLOT_LABEL[slotIndex],
        nilai: 0,
      });
    }
  }

  const pushToMatrix = (isoTime: string) => {
    const date = new Date(isoTime);
    if (Number.isNaN(date.getTime())) {
      return;
    }

    const dayIndex = indexHari(date);
    const slotIndex = indexSlot(date);
    const key = `${dayIndex}-${slotIndex}`;
    const current = matrix.get(key);
    if (!current) {
      return;
    }
    current.nilai += 1;
    matrix.set(key, current);
  };

  items.forEach((item) => {
    item.riwayatTanggal.forEach(pushToMatrix);
    item.riwayatGaJadiTanggal.forEach(pushToMatrix);
  });

  return Array.from(matrix.values());
}

export const HEATMAP_DAY_LABELS = HARI_LABEL;
export const HEATMAP_SLOT_LABELS = SLOT_LABEL;
