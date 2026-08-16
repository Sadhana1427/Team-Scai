import React from "react";

export default function DashboardLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-4">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-3 border-brand-100 border-t-brand-700 animate-spin" />
        <div className="absolute font-black text-brand-700 text-sm">S</div>
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-charcoal">Updating Workspace...</p>
        <p className="text-xs text-slate-400">Loading management data</p>
      </div>
    </div>
  );
}
