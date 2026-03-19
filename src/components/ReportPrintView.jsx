import DiagramFigure from "./DiagramFigure";

export default function ReportPrintView({ state, rows }) {
  return (
    <section id="report-sheet" className="report-sheet">
      <h1>Lab Report: Determination of Viscosity</h1>
      <h2>Based on Newton's Law Using an Inclined Plane</h2>
      <div className="meta-grid">
        <p><strong>Name:</strong> {state.studentName}</p>
        <p><strong>Roll No:</strong> {state.rollNo}</p>
        <p><strong>Date:</strong> {state.date}</p>
      </div>
      <p><strong>Session:</strong> {state.sessionName} | <strong>Fluid:</strong> {state.fluid}</p>
      <h3>Standard Diagram</h3>
      <DiagramFigure alt="Standard inclined-plane setup diagram for report" />
      <h3>Formula Set</h3>
      <p>τ = μ (dv/dy), θ = sin^-1(P/h), b = sqrt(h^2 - P^2), F = m g sin(θ), A = π r^2, τ = F/A, dv = l/t, μ = (τ dy)/dv</p>
      <h3>Observation and Calculated Results</h3>
      <table>
        <thead>
          <tr>
            <th>Pos</th><th>θ (deg)</th><th>τ (N/m2)</th><th>dv (m/s)</th><th>μ (Pa.s)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.position}>
              <td>{r.position}</td>
              <td>{r.angleDeg.toFixed(2)}</td>
              <td>{r.shearStress.toFixed(4)}</td>
              <td>{r.velocity.toFixed(6)}</td>
              <td>{r.viscosity.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
