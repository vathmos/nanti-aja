import { hitungMalasMeter } from "@/lib/malasmeter";
import { DashboardState, TaskItem, TaskStatus } from "@/lib/types";

const STORAGE_KEY = "nanti-aja.dashboard.v1";

const DEFAULT_REASONS = [
  "Males",
  "Udah ga semangat lagi",
  "Excited di awal doang",
  "Gaada waktu (tapi boong)",
  "Skill issue",
  "Kepikiran hal lain",
];

const toDateTime = (
  reference: Date,
  dayOffset: number,
  hour: number,
  minute: number,
): string => {
  const date = new Date(reference);
  date.setDate(reference.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

const toDueDate = (reference: Date, dayOffset: number): string => {
  const date = new Date(reference);
  date.setDate(reference.getDate() + dayOffset);
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
};

function buildSeedItems(reference: Date): TaskItem[] {
  return [
  //   {
  //     id: "seed-1",
  //     judul: "Rapihin deck presentasi bulanan",
  //     dueDate: toDueDate(reference, 2),
  //     status: "in_progress",
  //     isClosed: false,
  //     jumlahPenundaan: 3,
  //     jumlahGaJadi: 1,
  //     riwayatAlasanGaJadi: ["Excited di awal doang"],
  //     riwayatTanggal: [
  //       toDateTime(reference, -6, 9, 15),
  //       toDateTime(reference, -4, 14, 5),
  //       toDateTime(reference, -1, 10, 20),
  //     ],
  //     riwayatGaJadiTanggal: [toDateTime(reference, -2, 19, 10)],
  //     riwayatSelesaiTanggal: [],
  //     dibuatPada: toDateTime(reference, -8, 8, 30),
  //     diperbaruiPada: toDateTime(reference, -1, 10, 20),
  //   },
  //   {
  //     id: "seed-2",
  //     judul: "Bales chat kerjaan yang numpuk",
  //     dueDate: toDueDate(reference, 5),
  //     status: "not_started",
  //     isClosed: false,
  //     jumlahPenundaan: 2,
  //     jumlahGaJadi: 0,
  //     riwayatAlasanGaJadi: [],
  //     riwayatTanggal: [
  //       toDateTime(reference, -5, 11, 40),
  //       toDateTime(reference, -2, 16, 10),
  //     ],
  //     riwayatGaJadiTanggal: [],
  //     riwayatSelesaiTanggal: [],
  //     dibuatPada: toDateTime(reference, -6, 9, 10),
  //     diperbaruiPada: toDateTime(reference, -2, 16, 10),
  //   },
  //   {
  //     id: "seed-3",
  //     judul: "Nulis recap mingguan tim",
  //     dueDate: toDueDate(reference, 1),
  //     status: "not_started",
  //     isClosed: false,
  //     jumlahPenundaan: 0,
  //     jumlahGaJadi: 0,
  //     riwayatAlasanGaJadi: [],
  //     riwayatTanggal: [],
  //     riwayatGaJadiTanggal: [],
  //     riwayatSelesaiTanggal: [],
  //     dibuatPada: toDateTime(reference, -3, 13, 0),
  //     diperbaruiPada: toDateTime(reference, -3, 13, 0),
  //   },
  //   {
  //     id: "seed-4",
  //     judul: "Beresin folder download yang berantakan",
  //     dueDate: toDueDate(reference, -2),
  //     status: "done",
  //     isClosed: true,
  //     jumlahPenundaan: 1,
  //     jumlahGaJadi: 0,
  //     riwayatAlasanGaJadi: [],
  //     riwayatTanggal: [toDateTime(reference, -7, 19, 5)],
  //     riwayatGaJadiTanggal: [],
  //     riwayatSelesaiTanggal: [toDateTime(reference, -5, 8, 15)],
  //     dibuatPada: toDateTime(reference, -9, 10, 45),
  //     diperbaruiPada: toDateTime(reference, -5, 8, 15),
  //   },
  //   {
  //     id: "seed-5",
  //     judul: "Follow up list TODO minggu lalu",
  //     dueDate: toDueDate(reference, 4),
  //     status: "not_started",
  //     isClosed: false,
  //     jumlahPenundaan: 2,
  //     jumlahGaJadi: 1,
  //     riwayatAlasanGaJadi: ["Gaada waktu (tapi boong)"],
  //     riwayatTanggal: [
  //       toDateTime(reference, -3, 15, 30),
  //       toDateTime(reference, 0, 9, 50),
  //     ],
  //     riwayatGaJadiTanggal: [toDateTime(reference, -1, 18, 25)],
  //     riwayatSelesaiTanggal: [],
  //     dibuatPada: toDateTime(reference, -4, 12, 20),
  //     diperbaruiPada: toDateTime(reference, 0, 9, 50),
  //   },
  //   {
  //     id: "seed-6",
  //     judul: "Nyusun checklist meeting besok",
  //     dueDate: toDueDate(reference, 7),
  //     status: "not_started",
  //     isClosed: false,
  //     jumlahPenundaan: 0,
  //     jumlahGaJadi: 0,
  //     riwayatAlasanGaJadi: [],
  //     riwayatTanggal: [],
  //     riwayatGaJadiTanggal: [],
  //     riwayatSelesaiTanggal: [],
  //     dibuatPada: toDateTime(reference, -1, 8, 40),
  //     diperbaruiPada: toDateTime(reference, -1, 8, 40),
  //   },
  ];
}

function createSeedState(): DashboardState {
  const reference = new Date();
  const items = buildSeedItems(reference);

  return {
    items,
    malasMeter: hitungMalasMeter(items),
    reusableReasons: DEFAULT_REASONS,
    lastUpdate: reference.toISOString(),
  };
}

function mapLegacyStatus(status: unknown): TaskStatus {
  if (status === "not_started" || status === "in_progress" || status === "done") {
    return status;
  }

  if (status === "tercatat") {
    return "not_started";
  }
  if (status === "ditunda") {
    return "in_progress";
  }
  if (status === "diselesaikan") {
    return "done";
  }

  return "not_started";
}

function normalizeDateInput(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed.toISOString();
}

function normalizeReasons(input: unknown): string[] {
  if (!Array.isArray(input)) {
    return [];
  }
  return input
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

function normalizeTask(value: unknown): TaskItem | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const raw = value as Partial<TaskItem> & {
    riwayatAlasanGaJadi?: unknown;
    jumlahGaJadi?: unknown;
    isClosed?: unknown;
    riwayatGaJadiTanggal?: unknown;
    riwayatSelesaiTanggal?: unknown;
  };

  if (
    typeof raw.id !== "string" ||
    typeof raw.judul !== "string" ||
    typeof raw.jumlahPenundaan !== "number" ||
    !Array.isArray(raw.riwayatTanggal) ||
    typeof raw.dibuatPada !== "string" ||
    typeof raw.diperbaruiPada !== "string"
  ) {
    return null;
  }

  const alasanGaJadi = normalizeReasons(raw.riwayatAlasanGaJadi);
  const normalizedStatus = mapLegacyStatus(raw.status);
  const riwayatGaJadiTanggal = Array.isArray(raw.riwayatGaJadiTanggal)
    ? raw.riwayatGaJadiTanggal.filter((entry): entry is string => typeof entry === "string")
    : normalizedStatus !== "done" &&
        typeof raw.jumlahGaJadi === "number" &&
        raw.jumlahGaJadi > 0
      ? [raw.diperbaruiPada]
      : [];
  const riwayatSelesaiTanggal = Array.isArray(raw.riwayatSelesaiTanggal)
    ? raw.riwayatSelesaiTanggal.filter((entry): entry is string => typeof entry === "string")
    : normalizedStatus === "done"
      ? [raw.diperbaruiPada]
      : [];

  return {
    id: raw.id,
    judul: raw.judul,
    dueDate: normalizeDateInput(raw.dueDate),
    status: normalizedStatus,
    isClosed:
      typeof raw.isClosed === "boolean"
        ? raw.isClosed || normalizedStatus === "done"
        : normalizedStatus === "done",
    jumlahPenundaan: raw.jumlahPenundaan,
    jumlahGaJadi:
      typeof raw.jumlahGaJadi === "number"
        ? raw.jumlahGaJadi
        : alasanGaJadi.length > 0
          ? alasanGaJadi.length
          : 0,
    riwayatAlasanGaJadi: alasanGaJadi,
    riwayatTanggal: raw.riwayatTanggal.filter(
      (entry): entry is string => typeof entry === "string",
    ),
    riwayatGaJadiTanggal,
    riwayatSelesaiTanggal,
    dibuatPada: raw.dibuatPada,
    diperbaruiPada: raw.diperbaruiPada,
  };
}

function dedupeReasons(items: TaskItem[], reusableReasons: string[]): string[] {
  const merged = [
    ...DEFAULT_REASONS,
    ...reusableReasons,
    ...items.flatMap((item) => item.riwayatAlasanGaJadi),
  ];

  const unique = new Map<string, string>();
  merged.forEach((reason) => {
    const cleanReason = reason.trim();
    if (!cleanReason) {
      return;
    }
    const key = cleanReason.toLowerCase();
    if (!unique.has(key)) {
      unique.set(key, cleanReason);
    }
  });
  return Array.from(unique.values());
}

function normalizeState(state: Partial<DashboardState>): DashboardState {
  const cleanedItems = Array.isArray(state.items)
    ? state.items.map(normalizeTask).filter((item): item is TaskItem => Boolean(item))
    : [];

  const reusableReasons = dedupeReasons(
    cleanedItems,
    Array.isArray(state.reusableReasons)
      ? state.reusableReasons.filter(
          (entry): entry is string => typeof entry === "string",
        )
      : [],
  );

  return {
    items: cleanedItems,
    malasMeter: hitungMalasMeter(cleanedItems),
    reusableReasons,
    lastUpdate:
      typeof state.lastUpdate === "string" ? state.lastUpdate : new Date().toISOString(),
  };
}

export function muatState(): DashboardState {
  if (typeof window === "undefined") {
    return createSeedState();
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return createSeedState();
  }

  try {
    const parsed = JSON.parse(saved) as Partial<DashboardState>;
    return normalizeState(parsed);
  } catch {
    return createSeedState();
  }
}

export function simpanState(state: DashboardState): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
