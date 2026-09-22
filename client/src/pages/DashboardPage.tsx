import { Link } from 'react-router-dom';

export function DashboardPage() {
  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p>Your job search at a glance. Stats, follow-ups and funnel metrics land here next.</p>
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <p>Coming up:</p>
        <ul>
          <li>Applications by status (saved, applied, interview, offer)</li>
          <li>Follow-ups due this week</li>
          <li>Response rate over time</li>
        </ul>
        <p style={{ marginTop: '1rem' }}>
          <Link to="/applications">Go to applications</Link>
        </p>
      </div>
    </div>
  );
}
