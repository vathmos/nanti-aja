import { TaskItem } from "@/lib/types";

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.max(minimum, Math.min(maximum, value));

export function hitungMalasMeter(items: TaskItem[]): number {
  if (items.length === 0) {
    return 0;
  }

  const totalPenundaan = items.reduce(
    (total, item) => total + item.jumlahPenundaan,
    0,
  );
  const totalGaJadi = items.reduce((total, item) => total + item.jumlahGaJadi, 0);
  const polaBerulang = items.filter((item) => item.jumlahPenundaan >= 2).length;
  const itemInProgress = items.filter((item) => item.status === "in_progress").length;
  const itemDone = items.filter((item) => item.status === "done").length;

  const baseline = Math.min(18, items.length * 2);
  const skorMentah =
    baseline +
    totalPenundaan * 8 +
    totalGaJadi * 12 +
    polaBerulang * 8 +
    itemInProgress * 2 -
    itemDone * 8;

  return clamp(Math.round(skorMentah), 0, 100);
}
