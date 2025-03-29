// src/lib/utils/normalizeReferer.ts
export function normalizeReferer(referer: string): string {
     if (!referer || referer === "direct") return "direct";

     try {
          // Jika sudah berupa domain lengkap (dari header)
          if (referer.startsWith('http')) {
               const url = new URL(referer);
               return url.hostname.replace(/\./g, '_dot_');
          }

          // Jika sudah berupa domain tapi tanpa protocol
          if (/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/.test(referer)) {
               return referer.replace(/\./g, '_dot_');
          }

          return "unknown";
     } catch {
          return "unknown";
     }
}

export function denormalizeReferer(normalized: string): string {
     return normalized.replace(/_dot_/g, '.');
}