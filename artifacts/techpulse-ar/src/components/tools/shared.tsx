import { useState, type ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';

export const inputClass =
  'w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50';
export const labelClass = 'mb-1 block text-sm font-medium';

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        });
      }}
      className="inline-flex min-h-9 items-center gap-2 rounded-md border border-border px-3 text-xs font-medium hover:bg-muted"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {label}
    </button>
  );
}

export type IssueSeverity = 'error' | 'warning' | 'info';

const severityStyles: Record<IssueSeverity, string> = {
  error: 'border-red-500/40 bg-red-500/10',
  warning: 'border-amber-500/40 bg-amber-500/10',
  info: 'border-sky-500/40 bg-sky-500/10',
};

export function IssueList({
  issues,
  labels,
}: {
  issues: { severity: IssueSeverity; key: string; text: ReactNode }[];
  labels: Record<IssueSeverity, string>;
}) {
  if (!issues.length) return null;
  return (
    <ul className="space-y-2">
      {issues.map((issue) => (
        <li key={issue.key} className={`rounded-lg border p-3 text-sm ${severityStyles[issue.severity]}`}>
          <span className="me-2 font-semibold">{labels[issue.severity]}:</span>
          {issue.text}
        </li>
      ))}
    </ul>
  );
}

export function ResultTable({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            {head.map((cell) => (
              <th key={cell} className="whitespace-nowrap px-3 py-2 text-start font-semibold">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-t border-border">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="whitespace-nowrap px-3 py-2 font-mono text-xs" dir="ltr">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
