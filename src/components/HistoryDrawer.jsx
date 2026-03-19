export default function HistoryDrawer({ open, sessions, onLoad, onDelete }) {
  return (
    <aside className={`history ${open ? "open" : ""}`}>
      <h3>Saved History</h3>
      {sessions.length === 0 ? <p className="muted">No saved sessions yet.</p> : null}
      {sessions.map((s) => (
        <div key={s.id} className="history-item">
          <div>
            <strong>{s.sessionName}</strong>
            <p>{s.studentName} | {s.rollNo}</p>
            <small>{new Date(s.updatedAt).toLocaleString()}</small>
          </div>
          <div className="history-actions">
            <button className="btn ghost" onClick={() => onLoad(s.id)}>Edit</button>
            <button className="btn danger" onClick={() => onDelete(s.id)}>Delete</button>
          </div>
        </div>
      ))}
    </aside>
  );
}
