export default function ResultsSection({ rows }) {
  if (!rows.length) {
    return (
      <section className="card">
        <h2>Calculated Results</h2>
        <p className="muted">Enter values and click Calculate Automatically.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>Calculated Results</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Pos</th>
              <th>θ (deg)</th>
              <th>b (m)</th>
              <th>τ (N/m2)</th>
              <th>dv (m/s)</th>
              <th>μ (Pa.s)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.position}>
                <td>{r.position}</td>
                <td>{r.angleDeg.toFixed(2)}</td>
                <td>{r.base.toFixed(6)}</td>
                <td>{r.shearStress.toFixed(4)}</td>
                <td>{r.velocity.toFixed(6)}</td>
                <td><strong>{r.viscosity.toFixed(2)}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
