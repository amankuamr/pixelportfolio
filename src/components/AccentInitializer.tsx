"use client";

import { useEffect } from "react";

export default function AccentInitializer() {
  useEffect(() => {
    try {
      const saved = localStorage.getItem("accent-color");
      if (saved) {
        document.documentElement.style.setProperty("--accent", saved);
        document.documentElement.style.setProperty("--accent-dim", `${saved}1a`);
        document.documentElement.style.setProperty("--accent-border", `${saved}4d`);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  return null;
}
