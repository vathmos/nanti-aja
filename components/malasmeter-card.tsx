"use client";

interface MalasMeterCardProps {
  nilai: number;
}

export function MalasMeterCard({ nilai }: MalasMeterCardProps) {
  return (
    <section className="neo-panel p-5 md:p-6">
      <p className="neo-label">MalasMeter</p>
      <h2 className="mt-1 text-xl font-black">Skor Kemalasan</h2>
      <div className="mt-5 flex items-end justify-between gap-4">
        <p className="neo-value mono-text">{nilai}</p>
      </div>
      <div className="neo-meter-track mt-3">
        <div
          className="neo-meter-fill"
          style={{ width: `${Math.max(0, Math.min(100, nilai))}%` }}
        />
      </div>
    </section>
  );
}
