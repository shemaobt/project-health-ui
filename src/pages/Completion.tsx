import { useEffect, useState } from 'react';
import { StatusOrb } from '../components/primitives';
import { useT } from '../lib/i18n';

export default function Completion({ onReady }: { onReady: () => void }) {
  const { t } = useT();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 2400);
    const t2 = setTimeout(() => onReady(), 4400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onReady]);

  const done = stage === 1;

  return (
    <div className="min-h-screen flex items-center justify-center screen-enter">
      <div className="text-center max-w-md px-5 sm:px-8 animate-fade-up">
        <div className="mb-8">
          <StatusOrb done={done} icon="check" size="lg" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-earth-800" style={{ letterSpacing: '-0.012em' }}>
          {done ? t('completion.readyTitle') : t('completion.inProgressTitle')}
        </h2>
        <p className="mt-4 text-earth-500 font-serif italic" style={{ textWrap: 'balance' as never }}>
          {done ? t('completion.readyDetail') : t('completion.inProgressDetail')}
        </p>
      </div>
    </div>
  );
}
