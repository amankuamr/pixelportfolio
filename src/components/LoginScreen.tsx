"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [hasClicked, setHasClicked] = useState(false);

  const handleClick = () => {
    setHasClicked(true);
    setTimeout(onLogin, 500);
  };

  return (
    <AnimatePresence>
      {!hasClicked && (
        <motion.div
          initial={{ y: 0, backdropFilter: "blur(0px)" }}
          animate={{ y: 0, backdropFilter: "blur(0px)" }}
          exit={{ y: "100vh", backdropFilter: "blur(20px)" }}
          transition={{ type: "spring", stiffness: 150, damping: 18 }}
          className="fixed inset-0 z-[100] flex flex-col"
          style={{ backgroundColor: "#151F27" }}
        >
          <div className="flex-1 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, rgba(217, 255, 0, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)`,
                }}
              />
            </div>

            <div className="relative z-10 flex items-center gap-20">
              <div>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="mb-6"
                >
                  <div className="flex items-center gap-1 mb-2">
                    <div className="w-8 h-8 bg-[#f25022]" />
                    <div className="w-8 h-8 bg-[#00a4ef]" />
                    <div className="w-8 h-8 bg-[#7fba00]" />
                    <div className="w-8 h-8 bg-[#ffb900]" />
                  </div>
                  <h1
                    className="text-6xl font-bold text-white mb-2"
                    style={{ fontFamily: "var(--font-agern), Arial, sans-serif" }}
                  >
                    Portfolio<span className="text-[#D9FF00]">XP</span>
                  </h1>
                  <p
                    className="text-lg text-gray-300 font-light"
                    style={{ fontFamily: "var(--font-agern), Arial, sans-serif" }}
                  >
                    Visual Designer
                  </p>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white text-lg font-normal"
                  style={{ fontFamily: "var(--font-agern), Arial, sans-serif" }}
                >
                  To begin, click on the user to log in
                </motion.p>
              </div>

              <div className="w-px h-32 bg-gradient-to-b from-transparent via-gray-500 to-transparent opacity-50" />

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                onClick={handleClick}
                className="flex items-center gap-4 cursor-pointer group"
              >
                <div
                  className="w-20 h-20 border-2 border-[#D9FF00] bg-[#1a2332] flex items-center justify-center group-hover:bg-[#D9FF00]/10 transition-colors overflow-hidden"
                  style={{ borderRadius: 0 }}
                >
                  <img
                    src="https://media.tenor.com/5419221774336123156/tenor.gif"
                    alt="Profile"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
                <div>
                  <h2
                    className="text-2xl font-semibold text-white"
                    style={{ fontFamily: "var(--font-agern), Arial, sans-serif" }}
                  >
                    User
                  </h2>
                  <p
                    className="text-sm text-[#D9FF00] font-normal"
                    style={{ fontFamily: "var(--font-agern), Arial, sans-serif" }}
                  >
                    Visual Designer
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          <div
            className="h-16 flex items-center justify-between px-8 border-t"
            style={{ backgroundColor: "#0a0f14", borderColor: "rgba(217, 255, 0, 0.2)" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-[#22c55e] flex items-center justify-center" style={{ borderRadius: 0 }}>
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#22c55e" />
                </svg>
              </div>
              <span className="text-white text-sm font-medium" style={{ fontFamily: "var(--font-agern), Arial, sans-serif" }}>
                Restart Portfolio XP
              </span>
            </div>

            <div className="text-right">
              <p className="text-gray-400 text-xs font-normal" style={{ fontFamily: "var(--font-agern), Arial, sans-serif" }}>
                After you log on, the system is yours to explore.
              </p>
              <p className="text-gray-400 text-xs font-normal" style={{ fontFamily: "var(--font-agern), Arial, sans-serif" }}>
                Every detail has been designed with a purpose.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
