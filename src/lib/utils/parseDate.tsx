import { format, toZonedTime } from "date-fns-tz";

const TZ = "Asia/Jakarta";

export function normalizeDateForInput(iso: string): string {
     try {
          const d = new Date(iso);
          // agar sesuai yyyy-mm-dd
          return d.toISOString().split("T")[0];
     } catch {
          return "";
     }
}

export function normalizeDateTimeForInput(isoUtc: string) {
  const zoned = toZonedTime(isoUtc, TZ);
  return format(zoned, "yyyy-MM-dd'T'HH:mm", { timeZone: TZ });
}

export function toIsoWithLocalTZ(input: string) {
  return new Date(input).toISOString();
}
