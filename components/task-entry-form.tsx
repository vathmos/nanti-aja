"use client";

import { FormEvent, useState } from "react";

interface TaskEntryFormProps {
  onSubmit: (judul: string, dueDate: string | null) => void;
}

export function TaskEntryForm({ onSubmit }: TaskEntryFormProps) {
  const [judul, setJudul] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanTitle = judul.trim();
    if (!cleanTitle) {
      return;
    }

    onSubmit(cleanTitle, dueDate ? new Date(`${dueDate}T00:00:00`).toISOString() : null);
    setJudul("");
    setDueDate("");
  };

  return (
    <form className="neo-panel p-5 md:p-6" onSubmit={handleSubmit}>
      <p className="neo-label">Tambah Task</p>
      <h2 className="mt-1 text-xl font-black">Masukin Kerjaan Baru</h2>
      <p className="mt-1 text-sm font-semibold text-zinc-700">
        Tulis task yang mau kamu pantau progres nundanya.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-[2fr_1fr_auto]">
        <input
          className="neo-input"
          value={judul}
          onChange={(event) => setJudul(event.target.value)}
          maxLength={120}
          placeholder="Contoh: Beresin slide presentasi yang ketunda"
          aria-label="Judul item"
        />
        <input
          className="neo-input"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          aria-label="Tanggal Deadline"
        />
        <button className="neo-button glitch-hover md:min-w-48" type="submit">
          Simpan Task
        </button>
      </div>
    </form>
  );
}
