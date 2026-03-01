"use client";

import { TaskItem } from "@/lib/types";

interface TaskTableProps {
  items: TaskItem[];
  activeShiftId: string | null;
  onPrimaryAction: (itemId: string) => void;
  onReschedule: (itemId: string) => void;
  onAbort: (itemId: string) => void;
}

const statusLabel: Record<TaskItem["status"], string> = {
  not_started: "Belum Mulai",
  in_progress: "Lagi Dikerjain",
  done: "Selesai",
};

function getStatusLabel(item: TaskItem): string {
  if (item.isClosed && item.status !== "done") {
    return "Ga jadi";
  }
  return statusLabel[item.status];
}

function formatDateTime(isoTime: string): string {
  const parsed = new Date(isoTime);
  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDueDate(isoTime: string | null): string {
  if (!isoTime) {
    return "-";
  }

  const parsed = new Date(isoTime);
  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatAbortReason(reasons: string[]): string {
  if (!Array.isArray(reasons) || reasons.length === 0) {
    return "-";
  }

  return reasons.join(" | ");
}

function hasReachedDeadline(item: TaskItem): boolean {
  if (!item.dueDate) {
    return false;
  }

  const dueDate = new Date(item.dueDate);
  if (Number.isNaN(dueDate.getTime())) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate <= today;
}

export function TaskTable({
  items,
  activeShiftId,
  onPrimaryAction,
  onReschedule,
  onAbort,
}: TaskTableProps) {
  const sortedItems = [...items].sort((first, second) =>
    second.diperbaruiPada.localeCompare(first.diperbaruiPada),
  );
  const openItems = sortedItems.filter((item) => !item.isClosed);
  const openDeadlineReached = openItems.filter((item) => hasReachedDeadline(item));
  const openNotYetDeadline = openItems.filter((item) => !hasReachedDeadline(item));
  const doneItems = sortedItems.filter(
    (item) => item.isClosed && item.status === "done",
  );
  const abortedItems = sortedItems.filter(
    (item) => item.isClosed && item.status !== "done",
  );

  return (
    <section className="neo-panel p-5 md:p-6">
      <p className="neo-label">Daftar Task</p>
      <h2 className="mt-1 text-xl font-black">Task Open, Selesai, dan Ga Jadi</h2>
      <p className="mt-1 text-sm font-semibold text-zinc-700">
        List dipisah biar task aktif, task selesai, dan task batal tidak campur.
      </p>
      <h3 className="mt-5 text-sm font-black uppercase tracking-wider">Open</h3>
      <div className="neo-table-wrap mt-2">
        <table className="neo-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Diperbarui</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {openDeadlineReached.length > 0 ? (
              <tr className="neo-divider-row">
                <td colSpan={5}>Sudah Masuk Deadline</td>
              </tr>
            ) : null}
            {openDeadlineReached.map((item) => (
              <tr
                key={item.id}
                className={`${activeShiftId === item.id ? "neo-shift-once" : ""} ${
                  item.isClosed && item.status !== "done" ? "neo-row-closed" : ""
                }`}
              >
                <td
                  className={
                    item.isClosed && item.status !== "done" ? "neo-closed-title" : ""
                  }
                >
                  {item.judul}
                </td>
                <td className="mono-text">{formatDueDate(item.dueDate)}</td>
                <td>{getStatusLabel(item)}</td>
                <td>{formatDateTime(item.diperbaruiPada)}</td>
                <td className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="neo-button glitch-hover px-3 py-2 text-xs"
                    onClick={() => onPrimaryAction(item.id)}
                    disabled={item.status === "done" || item.isClosed}
                  >
                    {item.status === "not_started" ? "Kerjakan" : "Selesai"}
                  </button>
                  <button
                    type="button"
                    className="neo-button glitch-hover px-3 py-2 text-xs"
                    onClick={() => onReschedule(item.id)}
                    disabled={item.status === "done" || item.isClosed}
                  >
                    Besok aja
                  </button>
                  <button
                    type="button"
                    className="neo-button glitch-hover px-3 py-2 text-xs"
                    onClick={() => onAbort(item.id)}
                    disabled={item.status === "done" || item.isClosed}
                  >
                    Ga jadi
                  </button>
                </td>
              </tr>
            ))}
            {openNotYetDeadline.length > 0 ? (
              <tr className="neo-divider-row">
                <td colSpan={5}>Belum Masuk Deadline</td>
              </tr>
            ) : null}
            {openNotYetDeadline.map((item) => (
              <tr
                key={item.id}
                className={`${activeShiftId === item.id ? "neo-shift-once" : ""} ${
                  item.isClosed && item.status !== "done" ? "neo-row-closed" : ""
                }`}
              >
                <td
                  className={
                    item.isClosed && item.status !== "done" ? "neo-closed-title" : ""
                  }
                >
                  {item.judul}
                </td>
                <td className="mono-text">{formatDueDate(item.dueDate)}</td>
                <td>{getStatusLabel(item)}</td>
                <td>{formatDateTime(item.diperbaruiPada)}</td>
                <td className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="neo-button glitch-hover px-3 py-2 text-xs"
                    onClick={() => onPrimaryAction(item.id)}
                    disabled={item.status === "done" || item.isClosed}
                  >
                    {item.status === "not_started" ? "Kerjakan" : "Selesai"}
                  </button>
                  <button
                    type="button"
                    className="neo-button glitch-hover px-3 py-2 text-xs"
                    onClick={() => onReschedule(item.id)}
                    disabled={item.status === "done" || item.isClosed}
                  >
                    Besok aja
                  </button>
                  <button
                    type="button"
                    className="neo-button glitch-hover px-3 py-2 text-xs"
                    onClick={() => onAbort(item.id)}
                    disabled={item.status === "done" || item.isClosed}
                  >
                    Ga jadi
                  </button>
                </td>
              </tr>
            ))}
            {openItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center font-bold">
                  Belum ada task yang open.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <h3 className="mt-6 text-sm font-black uppercase tracking-wider">Selesai</h3>
      <div className="neo-table-wrap mt-2">
        <table className="neo-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Diperbarui</th>
            </tr>
          </thead>
          <tbody>
            {doneItems.map((item) => (
              <tr key={item.id}>
                <td>{item.judul}</td>
                <td className="mono-text">{formatDueDate(item.dueDate)}</td>
                <td>{getStatusLabel(item)}</td>
                <td>{formatDateTime(item.diperbaruiPada)}</td>
              </tr>
            ))}
            {doneItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center font-bold">
                  Belum ada task yang selesai.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <h3 className="mt-6 text-sm font-black uppercase tracking-wider">Ga Jadi</h3>
      <div className="neo-table-wrap mt-2">
        <table className="neo-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Alasan</th>
              <th>Diperbarui</th>
            </tr>
          </thead>
          <tbody>
            {abortedItems.map((item) => (
              <tr key={item.id} className="neo-row-closed">
                <td className="neo-closed-title">{item.judul}</td>
                <td className="mono-text">{formatDueDate(item.dueDate)}</td>
                <td>{getStatusLabel(item)}</td>
                <td className="neo-wrap-text">
                  {formatAbortReason(item.riwayatAlasanGaJadi)}
                </td>
                <td>{formatDateTime(item.diperbaruiPada)}</td>
              </tr>
            ))}
            {abortedItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center font-bold">
                  Belum ada task yang ga jadi.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
