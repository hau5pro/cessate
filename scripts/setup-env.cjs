// scripts/setup-env.cjs

if (typeof globalThis.crypto === "undefined") {
  const { randomFillSync } = require("crypto");
  globalThis.crypto = {
    getRandomValues: (arr) => randomFillSync(arr),
  };
}
