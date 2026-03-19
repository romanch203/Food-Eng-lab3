export default function TeacherPanel({ records, onStatus, onRemark }) {
  return (
    <section className="card">
      <h2>Teacher View (Local Device Records)</h2>
      <p className="muted">This view shows submissions saved on this same browser/device.</p>
      {records.length === 0 && <p className="muted">No submissions synced yet.</p>}
      {records.map((r) => (
        <article className="teacher-item" key={r.id}>
          <div className="teacher-head">
            <h3>{r.studentName} ({r.rollNo})</h3>
            <span className={`status ${r.status.toLowerCase()}`}>{r.status}</span>
          </div>
          <p>{r.sessionName} | {r.fluid} | {r.date}</p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Pos</th><th>tau</th><th>dv</th><th>mu</th>
                </tr>
              </thead>
              <tbody>
                {(r.rows || []).map((x) => (
                  <tr key={x.position}>
                    <td>{x.position}</td>
                    <td>{x.shearStress.toFixed(3)}</td>
                    <td>{x.velocity.toFixed(5)}</td>
                    <td>{x.viscosity.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="teacher-actions">
            <select value={r.status} onChange={(e) => onStatus(r.id, e.target.value)}>
              <option>Pending</option>
              <option>Checked</option>
            </select>
            <input
              value={r.remark || ""}
              onChange={(e) => onRemark(r.id, e.target.value)}
              placeholder="Teacher remark"
            />
          </div>
        </article>
      ))}
    </section>
  );
}
