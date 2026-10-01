"use client";

import { useSyncExternalStore } from "react";

/** Live New York time ("09:41 PM"), refreshed every 30s; blank during server render. */
export function useNycTime() {
  return useSyncExternalStore(
    (cb) => {
      const id = setInterval(cb, 30_000);
      return () => clearInterval(id);
    },
    () => new Date().toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: "2-digit", minute: "2-digit" }),
    () => "",
  );
}
