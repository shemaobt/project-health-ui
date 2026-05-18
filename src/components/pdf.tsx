// Print-driven PDF export. See @media print in src/styles/theme.css.
// We tag the target article with [data-print-target] so the print stylesheet
// can hide everything else, then call window.print(). The browser's native
// print engine handles layout — no html2canvas, no rasterization, no clipping.
import type { ReactNode } from 'react';
import { Icon, Spinner } from './primitives';
import type { Interview } from '../lib/fixtures';
import { useT } from '../lib/i18n';

export function pdfFilename(I: Interview, type: 'team' | 'admin', labels?: { team: string; admin: string }): string {
  const safe = (s: string) => (s || '').replace(/[/\\:*?"<>|]/g, '').trim();
  const teamLabel = labels?.team ?? 'Team Report';
  const adminLabel = labels?.admin ?? 'Admin Report';
  const label = type === 'team' ? teamLabel : adminLabel;
  return `${safe(I.project)} — ${label} — ${I.date}.pdf`;
}

export function usePdfFilename() {
  const { t } = useT();
  return (I: Interview, type: 'team' | 'admin') => pdfFilename(I, type, {
    team: t('pdf.teamReportSuffix'),
    admin: t('pdf.adminReportSuffix'),
  });
}

export function printReport({ elementId, filename }: { elementId: string; filename: string }): void {
  const el = document.getElementById(elementId);
  if (!el) return;

  // Force-open <details> accordions; remember which we touched so we can restore.
  const closedDetails: HTMLDetailsElement[] = [];
  el.querySelectorAll<HTMLDetailsElement>('details').forEach((d) => {
    if (!d.open) {
      d.open = true;
      closedDetails.push(d);
    }
  });

  el.setAttribute('data-print-target', '');

  // Suggest the filename: Chromium/Firefox use document.title as the default Save-as-PDF name.
  const originalTitle = document.title;
  document.title = filename.replace(/\.pdf$/i, '');

  const cleanup = () => {
    document.title = originalTitle;
    el.removeAttribute('data-print-target');
    closedDetails.forEach((d) => { d.open = false; });
    window.removeEventListener('afterprint', cleanup);
  };
  window.addEventListener('afterprint', cleanup);

  window.print();
}

export function DownloadPdfButton({
  children, loading, onClick, className = '',
}: {
  children?: ReactNode;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const { t } = useT();
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`focus-warm inline-flex items-center gap-2 rounded-full px-4 py-2.5 sm:py-2 text-xs font-medium tracking-wide
        text-earth-700 bg-cream-50 ring-1 ring-earth-700/15 hover:ring-earth-700/30 hover:bg-cream-100
        disabled:opacity-60 disabled:cursor-wait transition-all duration-200 ${className}`}>
      {loading ? <Spinner className="w-3.5 h-3.5" /> : <Icon name="download" className="w-3.5 h-3.5" />}
      <span>{loading ? t('pdf.preparing') : (children ?? t('pdf.download'))}</span>
    </button>
  );
}
