import { PageHeader } from '../components/TopNavigation';

export function PassportPage() {
  return (
    <div className="page passport-page">
      <PageHeader
        title="Learning Passport"
        subtitle="Your personal Python learning journey"
      >
        <button className="secondary" onClick={() => {}}>Close</button>
      </PageHeader>
      <p>Passport feature coming soon.</p>
    </div>
  );
}