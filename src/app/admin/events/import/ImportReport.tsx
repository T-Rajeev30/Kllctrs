"use client";

import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock3,
  Database,
} from "lucide-react";

import type { BatchImportSummary } from "@/lib/tcdb/services/batch-importer";

interface ImportReportProps {
  report: BatchImportSummary | null;
}

export default function ImportReport({ report }: ImportReportProps) {
  if (!report) {
    return null;
  }

  return (
    <div className="rounded-xl border bg-background shadow-sm">
      {/* Header */}

      <div className="border-b px-6 py-4">
        <h2 className="text-xl font-semibold">Import Report</h2>

        <p className="text-sm text-muted-foreground">
          Summary of the latest import operation.
        </p>
      </div>

      {/* Summary */}

      <div className="grid gap-4 p-6 md:grid-cols-3 lg:grid-cols-6">
        <Stat title="Total" value={report.total} />

        <Stat title="Imported" value={report.imported} color="green" />

        <Stat title="Duplicates" value={report.duplicates} color="yellow" />

        <Stat
          title="Validation"
          value={report.validationFailed}
          color="orange"
        />

        <Stat title="Failed" value={report.failed} color="red" />

        <Stat title="Success" value={`${report.successRate}%`} color="blue" />
      </div>

      {/* Duration */}

      <div className="border-t px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock3 className="h-4 w-4" />
          Import completed in{" "}
          <strong>{(report.durationMs / 1000).toFixed(2)} sec</strong>
        </div>
      </div>

      {/* Results */}

      <div className="border-t">
        <div className="px-6 py-4">
          <h3 className="font-semibold">Event Results</h3>
        </div>

        <div className="max-h-96 overflow-y-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                  Status
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                  Event
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                  Message
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {report.results.map((result, index) => {
                const title =
                  result.event?.name ?? result.event?.slug ?? "Unknown Event";

                return (
                  <tr key={index}>
                    <td className="px-4 py-3">
                      {result.imported ? (
                        <span className="inline-flex items-center gap-2 rounded bg-green-100 px-2 py-1 text-sm text-green-700">
                          <CheckCircle2 className="h-4 w-4" />
                          Imported
                        </span>
                      ) : result.duplicate ? (
                        <span className="inline-flex items-center gap-2 rounded bg-yellow-100 px-2 py-1 text-sm text-yellow-700">
                          <AlertTriangle className="h-4 w-4" />
                          Duplicate
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded bg-red-100 px-2 py-1 text-sm text-red-700">
                          <XCircle className="h-4 w-4" />
                          Failed
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-muted-foreground" />

                        {title}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {result.message}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface StatProps {
  title: string;
  value: string | number;
  color?: "green" | "yellow" | "orange" | "red" | "blue";
}

function Stat({ title, value, color }: StatProps) {
  const colors = {
    green: "text-green-600",
    yellow: "text-yellow-600",
    orange: "text-orange-600",
    red: "text-red-600",
    blue: "text-blue-600",
  };

  return (
    <div className="rounded-lg border p-4">
      <div className="text-xs uppercase text-muted-foreground">{title}</div>

      <div className={`mt-2 text-3xl font-bold ${color ? colors[color] : ""}`}>
        {value}
      </div>
    </div>
  );
}
