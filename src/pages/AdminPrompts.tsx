import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { adminPromptsApi } from '../lib/api';
import type { AgentPromptDto } from '../lib/api/types';
import { useT } from '../lib/i18n';
import { Alert, DottedEyebrow, Spinner } from '../components/primitives';
import { BreadcrumbHeader } from '../components/composites';

interface RowState {
  name: string;
  description: string;
  template: string;
  expanded: boolean;
  saving: boolean;
  resetting: boolean;
  error: string | null;
  version: number;
  placeholders: string[];
  updatedAt: string;
}

function toRowState(p: AgentPromptDto): RowState {
  return {
    name: p.name,
    description: p.description,
    template: p.template,
    expanded: false,
    saving: false,
    resetting: false,
    error: null,
    version: p.version,
    placeholders: p.placeholders,
    updatedAt: p.updated_at,
  };
}

function extractError(e: unknown, fallback: string): string {
  const err = e as { response?: { data?: { detail?: string } } };
  return err?.response?.data?.detail ?? fallback;
}

export default function AdminPrompts() {
  const { t } = useT();
  const [, setLocation] = useLocation();
  const [prompts, setPrompts] = useState<AgentPromptDto[]>([]);
  const [rows, setRows] = useState<Record<string, RowState>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const list = await adminPromptsApi.list();
        if (cancelled) return;
        setPrompts(list);
        setRows(Object.fromEntries(list.map((p) => [p.prompt_key, toRowState(p)])));
      } catch (e) {
        console.error('list prompts failed', e);
        if (!cancelled) setLoadError(t('adminPrompts.loadError'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [t]);

  const update = (key: string, patch: Partial<RowState>) => {
    setRows((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };

  const dirty = (p: AgentPromptDto) => {
    const r = rows[p.prompt_key];
    return r && (r.name !== p.name || r.description !== p.description || r.template !== p.template);
  };

  const handleSave = async (p: AgentPromptDto) => {
    const r = rows[p.prompt_key];
    if (!r || !dirty(p)) return;
    update(p.prompt_key, { saving: true, error: null });
    try {
      const next = await adminPromptsApi.update(p.prompt_key, {
        name: r.name,
        description: r.description,
        template: r.template,
      });
      setPrompts((prev) => prev.map((q) => (q.prompt_key === p.prompt_key ? next : q)));
      update(p.prompt_key, { ...toRowState(next), expanded: true });
    } catch (e) {
      update(p.prompt_key, { error: extractError(e, t('adminPrompts.saveError')) });
    } finally {
      update(p.prompt_key, { saving: false });
    }
  };

  const handleReset = async (p: AgentPromptDto) => {
    if (!window.confirm(t('adminPrompts.confirmReset', { name: p.name }))) return;
    update(p.prompt_key, { resetting: true, error: null });
    try {
      const next = await adminPromptsApi.reset(p.prompt_key);
      setPrompts((prev) => prev.map((q) => (q.prompt_key === p.prompt_key ? next : q)));
      update(p.prompt_key, { ...toRowState(next), expanded: true });
    } catch (e) {
      update(p.prompt_key, { error: extractError(e, t('adminPrompts.resetError')) });
    } finally {
      update(p.prompt_key, { resetting: false });
    }
  };

  const handleCancel = (p: AgentPromptDto) => {
    update(p.prompt_key, { ...toRowState(p), expanded: true });
  };

  return (
    <div className="min-h-screen flex flex-col screen-enter">
      <BreadcrumbHeader
        onBack={() => setLocation('/admin')}
        backLabel={t('adminPrompts.back')}
        maxWidth="max-w-5xl"
        eyebrow={<DottedEyebrow>{t('adminPrompts.eyebrow')}</DottedEyebrow>}
        title={t('adminPrompts.title')}
      />
      <main className="flex-1 overflow-y-auto nice-scroll">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <p className="text-earth-500 text-sm mb-8">{t('adminPrompts.intro')}</p>

          {loading && (
            <div className="flex items-center gap-2 text-earth-500 text-sm">
              <Spinner /> {t('common.loading')}
            </div>
          )}
          {loadError && (
            <div className="mb-8 animate-fade-up"><Alert tone="error">{loadError}</Alert></div>
          )}

          <div className="space-y-3">
            {prompts.map((p) => {
              const r = rows[p.prompt_key];
              if (!r) return null;
              const isDirty = dirty(p);
              return (
                <div
                  key={p.prompt_key}
                  className="bg-cream-50 rounded-2xl ring-1 ring-earth-700/8 overflow-hidden"
                >
                  <button
                    onClick={() => update(p.prompt_key, { expanded: !r.expanded })}
                    className="w-full text-left px-5 py-4 flex items-start justify-between gap-3 hover:bg-cream-100 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-serif text-[17px] text-earth-800" style={{ letterSpacing: '-0.005em' }}>
                        {p.name}
                      </div>
                      <div className="text-[12.5px] text-earth-500 mt-0.5 truncate">
                        {p.description}
                      </div>
                      <div className="text-[11px] text-earth-400 mt-1">
                        <code className="font-mono">{p.prompt_key}</code>
                        <span aria-hidden="true" className="mx-2 text-earth-700/15">·</span>
                        {t('adminPrompts.version', { version: p.version })}
                        {isDirty && (
                          <>
                            <span aria-hidden="true" className="mx-2 text-earth-700/15">·</span>
                            <span className="text-clay-700">{t('adminPrompts.unsaved')}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="text-earth-400 text-xs pt-1">{r.expanded ? '▲' : '▼'}</span>
                  </button>

                  {r.expanded && (
                    <div className="px-5 pb-5 border-t border-earth-700/5">
                      {r.error && (
                        <div className="mt-4 animate-fade-up">
                          <Alert tone="error">{r.error}</Alert>
                        </div>
                      )}

                      <div className="mt-4 space-y-3">
                        <label className="block">
                          <span className="text-[11px] uppercase tracking-[0.14em] text-earth-400">{t('adminPrompts.nameLabel')}</span>
                          <input
                            type="text"
                            value={r.name}
                            onChange={(e) => update(p.prompt_key, { name: e.target.value })}
                            className="focus-warm mt-1 w-full bg-cream-100 rounded-lg px-3 py-2 text-sm text-earth-800 ring-1 ring-earth-700/8"
                          />
                        </label>

                        <label className="block">
                          <span className="text-[11px] uppercase tracking-[0.14em] text-earth-400">{t('adminPrompts.descriptionLabel')}</span>
                          <textarea
                            rows={2}
                            value={r.description}
                            onChange={(e) => update(p.prompt_key, { description: e.target.value })}
                            className="focus-warm mt-1 w-full bg-cream-100 rounded-lg px-3 py-2 text-sm text-earth-800 ring-1 ring-earth-700/8"
                          />
                        </label>

                        <label className="block">
                          <span className="text-[11px] uppercase tracking-[0.14em] text-earth-400">{t('adminPrompts.templateLabel')}</span>
                          {r.placeholders.length > 0 && (
                            <span className="block mt-1 text-[11px] text-earth-500">
                              {t('adminPrompts.placeholdersHint')}{' '}
                              <code className="font-mono">{r.placeholders.map((x) => `$${x}`).join(', ')}</code>
                            </span>
                          )}
                          <textarea
                            rows={18}
                            value={r.template}
                            onChange={(e) => update(p.prompt_key, { template: e.target.value })}
                            className="focus-warm mt-1 w-full bg-cream-100 rounded-lg px-3 py-2 text-[12.5px] text-earth-800 ring-1 ring-earth-700/8 font-mono leading-relaxed"
                            spellCheck={false}
                          />
                        </label>

                        <div className="flex flex-wrap items-center gap-2 justify-end pt-2">
                          <button
                            onClick={() => void handleReset(p)}
                            disabled={r.resetting || r.saving}
                            className={`focus-warm text-xs px-4 py-2 rounded-full text-clay-700 hover:text-clay-800 hover:bg-clay-500/10 transition-colors ${r.resetting ? 'opacity-60 cursor-not-allowed' : ''}`}
                          >
                            {r.resetting ? t('common.loading') : t('adminPrompts.reset')}
                          </button>
                          <button
                            onClick={() => handleCancel(p)}
                            disabled={r.saving || !isDirty}
                            className={`focus-warm text-xs px-4 py-2 rounded-full text-earth-600 hover:text-earth-800 hover:bg-cream-200 transition-colors ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {t('adminPrompts.cancel')}
                          </button>
                          <button
                            onClick={() => void handleSave(p)}
                            disabled={r.saving || !isDirty}
                            className={`focus-warm text-xs px-4 py-2 rounded-full bg-earth-700 text-cream-50 hover:bg-earth-800 transition-colors ${(!isDirty || r.saving) ? 'opacity-60 cursor-not-allowed' : ''}`}
                          >
                            {r.saving ? t('common.loading') : t('adminPrompts.save')}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
