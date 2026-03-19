import { toSI } from "./unitSystem";

export function validateInput(state) {
  const errors = [];
  if (!state.studentName?.trim()) errors.push("Name is required.");
  if (!state.rollNo?.trim()) errors.push("Roll No is required.");
  if (!state.date?.trim()) errors.push("Date is required.");

  const scalars = [
    ["Diameter", state.diameter],
    ["Hypotenuse", state.hypotenuse],
    ["Distance", state.distance],
  ];

  scalars.forEach(([label, val]) => {
    if (!(Number(val) > 0)) errors.push(`${label} must be greater than 0.`);
  });

  state.positions.forEach((p, idx) => {
    if (!(Number(p.height) > 0)) errors.push(`Position ${idx + 1}: height must be greater than 0.`);
    if (!(Number(p.mass) > 0)) errors.push(`Position ${idx + 1}: mass must be greater than 0.`);
    if (!(Number(p.time) > 0)) errors.push(`Position ${idx + 1}: time must be greater than 0.`);
  });

  return errors;
}

export function computeViscosity(state) {
  const h = toSI(state.hypotenuse, state.hypotenuseUnit, "length");
  const d = toSI(state.diameter, state.diameterUnit, "length");
  const l = toSI(state.distance, state.distanceUnit, "length");
  const r = d / 2;
  const A = Math.PI * r * r;

  const g = 9.80665;

  const rows = state.positions.map((p, i) => {
    const P = toSI(p.height, p.heightUnit, "length");
    const m = toSI(p.mass, p.massUnit, "mass");
    const t = toSI(p.time, p.timeUnit, "time");

    const base = Math.sqrt(Math.max(h * h - P * P, 0));
    const angleRad = Math.asin(Math.min(P / h, 1));
    const angleDeg = (angleRad * 180) / Math.PI;
    const F = m * g * Math.sin(angleRad);
    const tau = F / A;
    const dv = l / t;
    const mu = (tau * base) / dv;

    return {
      position: i + 1,
      angleDeg,
      base,
      force: F,
      area: A,
      shearStress: tau,
      velocity: dv,
      viscosity: mu,
      si: {
        P,
        m,
        t,
      },
    };
  });

  const warnings = [];
  for (let i = 1; i < rows.length; i += 1) {
    if (rows[i].angleDeg < rows[i - 1].angleDeg && rows[i].velocity > rows[i - 1].velocity) {
      warnings.push(
        `Position ${rows[i].position} has a smaller angle but a higher velocity than previous position. Recheck measurements.`
      );
    }
  }

  return { rows, warnings };
}
