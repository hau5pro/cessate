// vite-node-polyfill.ts

import { randomFillSync } from "crypto";

if (typeof (globalThis as any).crypto === "undefined") {
  (globalThis as any).crypto = {
    getRandomValues: (arr: any) => randomFillSync(arr),
  };
}
