import DiagramFigure from "./DiagramFigure";

export default function StaticExperimentInfo() {
  return (
    <section className="card static-info">
      <h2>Standard Lab Content (Constant)</h2>
      <h3>1. Principle</h3>
      <p>
        The experiment determines dynamic viscosity of food fluids using an inclined plane. The time for a
        block to travel a fixed distance across a fluid film at different inclinations is measured and used to
        compute shear stress, velocity, and apparent dynamic viscosity.
      </p>
      <h3>2. Theory (Newton's Law)</h3>
      <div className="formula-block">
        <p>τ = μ (dv/dy)</p>
        <p>θ = sin^-1(P/h)</p>
        <p>b = sqrt(h^2 - P^2)</p>
        <p>F = m g sin(θ)</p>
        <p>A = π r^2</p>
        <p>τ = F/A</p>
        <p>dv = l/t</p>
        <p>μ = (τ dy)/dv</p>
      </div>
      <h3>3. Materials and Apparatus</h3>
      <ul>
        <li>Adjustable glass inclined ramp with stand</li>
        <li>Sliding cylindrical block (known mass and diameter)</li>
        <li>Stopwatch, ruler, analytical balance</li>
        <li>Test fluids (caramel, ketchup)</li>
      </ul>
      <h3>4. Standard Diagram</h3>
      <DiagramFigure alt="Standard inclined-plane setup diagram" />
    </section>
  );
}
