"use client";

import { useEffect, useMemo, useState } from "react";

import { ConsistencyLine } from "@/components/charts/consistency-line";
import { PostponementBar } from "@/components/charts/postponement-bar";
import { PostponementHeatmap } from "@/components/charts/postponement-heatmap";
import { MalasMeterCard } from "@/components/malasmeter-card";
import { TaskEntryForm } from "@/components/task-entry-form";
import { TaskTable } from "@/components/task-table";
import { hitungMalasMeter } from "@/lib/malasmeter";
import { muatState, simpanState } from "@/lib/storage";
import {
  agregasiHarian,
  agregasiHeatmapMingguan,
  agregasiTrenKonsistensi,
} from "@/lib/stats";
import { DashboardState, TaskItem } from "@/lib/types";

const createId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `task-${Date.now()}`;

const shiftDateByOneDay = (isoDate: string | null): string => {
  const base = isoDate ? new Date(isoDate) : new Date();
  if (Number.isNaN(base.getTime())) {
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + 1);
    fallback.setHours(0, 0, 0, 0);
    return fallback.toISOString();
  }

  base.setDate(base.getDate() + 1);
  base.setHours(0, 0, 0, 0);
  return base.toISOString();
};

function formatLastUpdate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function normalizeReason(reason: string): string {
  return reason.replace(/\s+/g, " ").trim();
}

export function DashboardShell() {
  const [state, setState] = useState<DashboardState>(() => muatState());
  const [statusInfo, setStatusInfo] = useState("Data udah ke-refresh.");
  const [activeShiftId, setActiveShiftId] = useState<string | null>(null);
  const [startDialogTaskId, setStartDialogTaskId] = useState<string | null>(null);
  const [finishDialogTaskId, setFinishDialogTaskId] = useState<string | null>(null);
  const [finishTitleInput, setFinishTitleInput] = useState("");
  const [abortDialogTaskId, setAbortDialogTaskId] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  useEffect(() => {
    simpanState(state);
  }, [state]);

  useEffect(() => {
    if (!statusInfo) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setStatusInfo("Data udah ke-refresh.");
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [statusInfo]);

  const updateItems = (updater: (items: TaskItem[]) => TaskItem[]) => {
    setState((previous) => {
      const items = updater(previous.items);
      return {
        ...previous,
        items,
        malasMeter: hitungMalasMeter(items),
        lastUpdate: new Date().toISOString(),
      };
    });
  };

  const addReusableReason = (reason: string) => {
    const normalized = normalizeReason(reason);
    if (!normalized) {
      return;
    }

    setState((previous) => {
      const exists = previous.reusableReasons.some(
        (entry) => entry.toLowerCase() === normalized.toLowerCase(),
      );
      if (exists) {
        return previous;
      }
      return {
        ...previous,
        reusableReasons: [...previous.reusableReasons, normalized],
      };
    });
  };

  const findTask = (itemId: string): TaskItem | null =>
    state.items.find((item) => item.id === itemId) ?? null;

  const tambahItem = (judul: string, dueDate: string | null) => {
    const now = new Date().toISOString();
    updateItems((items) => [
      {
        id: createId(),
        judul,
        dueDate,
        status: "not_started",
        isClosed: false,
        jumlahPenundaan: 0,
        jumlahGaJadi: 0,
        riwayatAlasanGaJadi: [],
        riwayatTanggal: [],
        riwayatGaJadiTanggal: [],
        riwayatSelesaiTanggal: [],
        dibuatPada: now,
        diperbaruiPada: now,
      },
      ...items,
    ]);
    setStatusInfo("Task baru masuk daftar.");
  };

  const mintaKerjakan = (itemId: string) => {
    const item = findTask(itemId);
    if (!item || item.status !== "not_started" || item.isClosed) {
      return;
    }
    setStartDialogTaskId(itemId);
  };

  const konfirmasiKerjakan = () => {
    if (!startDialogTaskId) {
      return;
    }
    const now = new Date().toISOString();
    updateItems((items) =>
      items.map((item) =>
        item.id === startDialogTaskId &&
        item.status === "not_started" &&
        !item.isClosed
          ? { ...item, status: "in_progress", diperbaruiPada: now }
          : item,
      ),
    );
    setStartDialogTaskId(null);
    setStatusInfo("Oke, task ini lagi dikerjain.");
  };

  const mintaSelesai = (itemId: string) => {
    const item = findTask(itemId);
    if (!item || item.status !== "in_progress" || item.isClosed) {
      return;
    }
    setFinishDialogTaskId(itemId);
    setFinishTitleInput("");
  };

  const aksiUtamaTask = (itemId: string) => {
    const item = findTask(itemId);
    if (!item || item.isClosed) {
      return;
    }

    if (item.status === "not_started") {
      mintaKerjakan(itemId);
      return;
    }

    if (item.status === "in_progress") {
      mintaSelesai(itemId);
    }
  };

  const konfirmasiSelesai = () => {
    if (!finishDialogTaskId) {
      return;
    }
    const item = findTask(finishDialogTaskId);
    if (!item || finishTitleInput.trim() !== item.judul.trim()) {
      return;
    }

    const now = new Date().toISOString();
    updateItems((items) =>
      items.map((entry) =>
        entry.id === finishDialogTaskId &&
        entry.status === "in_progress" &&
        !entry.isClosed
          ? {
              ...entry,
              status: "done",
              isClosed: true,
              riwayatSelesaiTanggal: [...entry.riwayatSelesaiTanggal, now],
              diperbaruiPada: now,
            }
          : entry,
      ),
    );
    setFinishDialogTaskId(null);
    setFinishTitleInput("");
    setStatusInfo("Sip, task ini beres.");
  };

  const besokAja = (itemId: string) => {
    const now = new Date().toISOString();
    setActiveShiftId(itemId);
    window.setTimeout(() => setActiveShiftId(null), 140);

    updateItems((items) =>
      items.map((item) => {
        if (item.id !== itemId || item.status === "done" || item.isClosed) {
          return item;
        }

        return {
          ...item,
          status: "not_started",
          dueDate: shiftDateByOneDay(item.dueDate),
          jumlahPenundaan: item.jumlahPenundaan + 1,
          riwayatTanggal: [...item.riwayatTanggal, now],
          diperbaruiPada: now,
        };
      }),
    );
    setStatusInfo("Oke, kita geser ke besok.");
  };

  const mintaGaJadi = (itemId: string) => {
    const item = findTask(itemId);
    if (!item || item.status === "done" || item.isClosed) {
      return;
    }

    setAbortDialogTaskId(itemId);
    setSelectedReason("");
    setCustomReason("");
  };

  const konfirmasiGaJadi = () => {
    if (!abortDialogTaskId) {
      return;
    }

    const reason = normalizeReason(customReason || selectedReason);
    if (!reason) {
      return;
    }

    const now = new Date().toISOString();
    updateItems((items) =>
      items.map((item) => {
        if (
          item.id !== abortDialogTaskId ||
          item.status === "done" ||
          item.isClosed
        ) {
          return item;
        }

        return {
          ...item,
          status: "not_started",
          isClosed: true,
          jumlahGaJadi: item.jumlahGaJadi + 1,
          riwayatAlasanGaJadi: [...item.riwayatAlasanGaJadi, reason],
          riwayatGaJadiTanggal: [...item.riwayatGaJadiTanggal, now],
          diperbaruiPada: now,
        };
      }),
    );

    addReusableReason(reason);
    setAbortDialogTaskId(null);
    setSelectedReason("");
    setCustomReason("");
    setStatusInfo("Task ditutup. Alasan udah disimpen.");
  };

  const startTask = startDialogTaskId ? findTask(startDialogTaskId) : null;
  const finishTask = finishDialogTaskId ? findTask(finishDialogTaskId) : null;
  const abortTask = abortDialogTaskId ? findTask(abortDialogTaskId) : null;

  const itemData = state.items;
  const barData = useMemo(() => agregasiHarian(itemData, 7), [itemData]);
  const lineData = useMemo(
    () => agregasiTrenKonsistensi(itemData, 14),
    [itemData],
  );
  const heatmapData = useMemo(() => agregasiHeatmapMingguan(itemData), [itemData]);

  const jumlahItem = itemData.length;
  const countInProgress = itemData.filter(
    (item) => item.status === "in_progress",
  ).length;
  const countDone = itemData.filter((item) => item.status === "done").length;
  const countGaJadi = itemData.reduce((total, item) => total + item.jumlahGaJadi, 0);

  return (
    <main className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="neo-panel p-5 md:p-6">
          <p className="neo-label">To Don&apos;t List</p>
          <h1 className="mt-1 text-3xl font-black uppercase tracking-[0.06em] md:text-4xl">
            Nanti Aja
          </h1>

          <p className="mono-text mt-3 text-xs font-semibold uppercase tracking-wider text-zinc-700">
            Update terakhir: {formatLastUpdate(state.lastUpdate)}
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <MalasMeterCard nilai={state.malasMeter} />
          </div>
          <div className="neo-panel p-5 md:p-6 lg:col-span-7">
            <p className="neo-label">Overview</p>
            <h2 className="mt-1 text-xl font-black">Kondisi Task Saat Ini</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="neo-status">
                <p className="text-xs uppercase tracking-wider text-zinc-700">
                  Total Item
                </p>
                <p className="mono-text mt-1 text-xl font-black">{jumlahItem}</p>
              </div>
              <div className="neo-status">
                <p className="text-xs uppercase tracking-wider text-zinc-700">
                  Lagi Dikerjain
                </p>
                <p className="mono-text mt-1 text-xl font-black">{countInProgress}</p>
              </div>
              <div className="neo-status">
                <p className="text-xs uppercase tracking-wider text-zinc-700">
                  Selesai
                </p>
                <p className="mono-text mt-1 text-xl font-black">{countDone}</p>
              </div>
              <div className="neo-status">
                <p className="text-xs uppercase tracking-wider text-zinc-700">
                  Batal Dikerjain
                </p>
                <p className="mono-text mt-1 text-xl font-black">{countGaJadi}</p>
              </div>
            </div>
            <p className="neo-status mt-4 inline-block">{statusInfo}</p>
          </div>
        </section>

        <TaskEntryForm onSubmit={tambahItem} />
        <TaskTable
          items={itemData}
          activeShiftId={activeShiftId}
          onPrimaryAction={aksiUtamaTask}
          onReschedule={besokAja}
          onAbort={mintaGaJadi}
        />

        <section className="grid gap-6 lg:grid-cols-2">
          <PostponementBar data={barData} />
          <ConsistencyLine data={lineData} />
        </section>

        <PostponementHeatmap data={heatmapData} />
      </div>

      {startTask ? (
        <div className="neo-modal-overlay">
          <div className="neo-modal-card">
            <p className="neo-label">Beneran Nih?</p>
            <h3 className="mt-1 text-lg font-black">Yakin mau ngerjain ini?</h3>
            <p className="mt-2 text-sm font-semibold">{startTask.judul}</p>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className="neo-button neo-button-ghost"
                onClick={() => setStartDialogTaskId(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="neo-button neo-button-danger"
                onClick={konfirmasiKerjakan}
              >
                Yes, kerjakan
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {finishTask ? (
        <div className="neo-modal-overlay">
          <div className="neo-modal-card">
            <p className="neo-label">Validasi Selesai</p>
            <h3 className="mt-1 text-lg font-black">Ketik judul task biar valid</h3>
            <p className="mt-2 text-sm font-semibold">{finishTask.judul}</p>
            <input
              className="neo-input mt-4"
              value={finishTitleInput}
              onChange={(event) => setFinishTitleInput(event.target.value)}
              onPaste={(event) => event.preventDefault()}
              placeholder="Harus sama persis sama judul task"
              aria-label="Validasi judul task"
            />
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className="neo-button neo-button-ghost"
                onClick={() => {
                  setFinishDialogTaskId(null);
                  setFinishTitleInput("");
                }}
              >
                Batal
              </button>
              <button
                type="button"
                className="neo-button"
                onClick={konfirmasiSelesai}
                disabled={finishTitleInput.trim() !== finishTask.judul.trim()}
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {abortTask ? (
        <div className="neo-modal-overlay">
          <div className="neo-modal-card">
            <p className="neo-label">Alasan Ga Jadi</p>
            <h3 className="mt-1 text-lg font-black">Kenapa ga jadi ngerjain?</h3>
            <p className="mt-2 text-sm font-semibold">{abortTask.judul}</p>

            <div className="reason-chip-grid mt-4">
              {state.reusableReasons.map((reason) => {
                const active =
                  selectedReason === reason &&
                  normalizeReason(customReason).length === 0;
                return (
                  <button
                    key={reason}
                    type="button"
                    className={`reason-chip ${active ? "reason-chip-active" : ""}`}
                    onClick={() => {
                      setSelectedReason(reason);
                      setCustomReason("");
                    }}
                  >
                    {reason}
                  </button>
                );
              })}
            </div>

            <textarea
              className="neo-input mt-4 min-h-24 resize-y"
              placeholder="Atau tulis alasanmu sendiri di sini."
              value={customReason}
              onChange={(event) => setCustomReason(event.target.value)}
            />

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className="neo-button neo-button-ghost"
                onClick={() => {
                  setAbortDialogTaskId(null);
                  setSelectedReason("");
                  setCustomReason("");
                }}
              >
                Batal
              </button>
              <button
                type="button"
                className="neo-button"
                onClick={konfirmasiGaJadi}
                disabled={!normalizeReason(customReason || selectedReason)}
              >
                Simpan Alasan
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
