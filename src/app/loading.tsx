import React from "react";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
      <div className="relative flex items-center justify-center">
        {/* Outer pulsing ring */}
        <div className="w-16 h-16 rounded-full border-4 border-brand-100 border-t-brand-700 animate-spin" />
        {/* SCAI Brand S */}
        <div className="absolute font-black text-brand-700 text-lg">S</div>
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-bold text-charcoal">Team SCAI Portal</p>
        <p className="text-xs text-slate-400">Loading resources...</p>
      </div>
    </div>
  );
}
