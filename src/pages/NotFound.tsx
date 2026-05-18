import { Link } from 'wouter';
import { useT } from '../lib/i18n';
import { Card, DottedEyebrow, PrimaryButton } from '../components/primitives';
import { PageHeader } from '../components/composites';

export default function NotFound() {
  const { t } = useT();
  return (
    <div className="min-h-screen flex flex-col screen-enter">
      <PageHeader topOnly><span /></PageHeader>
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-md animate-fade-up text-center">
          <DottedEyebrow className="mb-5">404</DottedEyebrow>
          <h1 className="font-serif text-3xl sm:text-4xl text-earth-800 leading-tight" style={{ letterSpacing: '-0.015em' }}>
            {t('notFound.title')}
          </h1>
          <Card className="mt-8 p-6 sm:p-8 text-left">
            <p className="text-earth-600">{t('notFound.intro')}</p>
            <div className="mt-6">
              <Link to="/">
                <PrimaryButton className="w-full">{t('notFound.home')}</PrimaryButton>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
