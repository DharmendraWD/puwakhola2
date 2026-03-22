'use client';

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSInit() {
  useEffect(() => {
    AOS.init({
      duration: 600, // animation duration (optional)
      once: true,    // whether animation should happen only once (optional)
    });
  }, []);

  return null; // no UI needed
}
