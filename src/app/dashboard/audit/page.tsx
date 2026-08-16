import React from "react";
import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/session";
import { formatDate } from "@/lib/utils";
import { ShieldAlert, User, Activity, FileCode } from "lucide-react";

export const revalidate = 0;

export default async function DashboardAuditPage() {
  await requireRole(["SUPER_ADMIN"]);

  let logs: any[] = [];
  try {
    logs = await prisma.auditLog.findMany({
      take: 100,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true, accountId: true, role: true },
        },
      },
    });
  } catch (err) {
    console.warn("Failed fetching audit logs:", err);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-brand-700" />
            <h2 className="text-xl font-bold text-charcoal">System Audit Logs</h2>
          </div>
          <p className="text-xs text-slate-500">
            Immutable operational records of all administrative actions, logins, updates, and uploads
          </p>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">User</th>
                <th className="px-4 py-3.5">Action</th>
                <th className="px-4 py-3.5">Entity</th>
                <th className="px-4 py-3.5">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    No audit records available.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 text-slate-400 text-[11px] whitespace-nowrap font-mono">
                      {formatDate(log.createdAt)} {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="px-4 py-3">
                      {log.user ? (
                        <div>
                          <span className="font-bold text-charcoal block">{log.user.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {log.user.accountId} ({log.user.role})
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">System / Anonymous</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-800 border border-slate-200 font-mono">
                        {log.action}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-600 font-semibold">
                      {log.entity}
                    </td>

                    <td className="px-4 py-3 text-slate-700 max-w-md">
                      <p className="line-clamp-2">{log.description}</p>
                      {log.metadata && (
                        <span className="text-[10px] font-mono text-slate-400 truncate block mt-0.5">
                          {log.metadata}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
