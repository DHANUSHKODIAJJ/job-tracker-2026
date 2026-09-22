import { useEffect, useState } from 'react';
import { listApplications } from '../api/applications';
import { STATUS_LABELS } from '../lib/constants';
import type { JobApplication } from '../lib/types';

export function ApplicationsPage() {
  const [items, setItems] = useState<JobApplication[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    listApplications()
      .then((res) => setItems(res.items))
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load applications'),
      );
  }, []);

  return (
    <div className="page">
      <h1>Applications</h1>
      {error && <p className="error">{error}</p>}
      {items.length === 0 && !error ? (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <p>No applications yet. Add your first one and start the pipeline.</p>
        </div>
      ) : (
        <div style={{ marginTop: '1.5rem', display: 'grid', gap: '0.75rem' }}>
          {items.map((app) => (
            <div className="card" key={app._id}>
              <strong>{app.role}</strong> at {app.company?.name}
              <span style={{ float: 'right' }}>{STATUS_LABELS[app.status]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
