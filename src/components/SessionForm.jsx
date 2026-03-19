import { LENGTH_UNITS, MASS_UNITS, TIME_UNITS, UNIT_SYSTEMS, preferredUnitsForSystem, fromSI, toSI } from "../utils/unitSystem";

function UnitSelect({ value, options, onChange }) {
  return (
    <select value={value} onChange={onChange}>
      {options.map((u) => (
        <option key={u} value={u}>{u}</option>
      ))}
    </select>
  );
}

export default function SessionForm({ state, setState, onCalculate, errors, warnings }) {
  const update = (key, value) => setState((s) => ({ ...s, [key]: value }));
  const updatePos = (index, key, value) =>
    setState((s) => ({
      ...s,
      positions: s.positions.map((p, i) => (i === index ? { ...p, [key]: value } : p)),
    }));

  const applySystem = (system) => {
    const pref = preferredUnitsForSystem(system);
    setState((s) => {
      const diameterSI = toSI(s.diameter, s.diameterUnit, "length");
      const hypotenuseSI = toSI(s.hypotenuse, s.hypotenuseUnit, "length");
      const distanceSI = toSI(s.distance, s.distanceUnit, "length");
      return {
        ...s,
        unitSystem: system,
        diameter: fromSI(diameterSI, pref.length, "length").toFixed(4),
        diameterUnit: pref.length,
        hypotenuse: fromSI(hypotenuseSI, pref.length, "length").toFixed(4),
        hypotenuseUnit: pref.length,
        distance: fromSI(distanceSI, pref.length, "length").toFixed(4),
        distanceUnit: pref.length,
        positions: s.positions.map((p) => {
          const hSI = toSI(p.height, p.heightUnit, "length");
          const mSI = toSI(p.mass, p.massUnit, "mass");
          const tSI = toSI(p.time, p.timeUnit, "time");
          return {
            ...p,
            height: fromSI(hSI, pref.length, "length").toFixed(4),
            heightUnit: pref.length,
            mass: fromSI(mSI, pref.mass, "mass").toFixed(6),
            massUnit: pref.mass,
            time: fromSI(tSI, pref.time, "time").toFixed(4),
            timeUnit: pref.time,
          };
        }),
      };
    });
  };

  return (
    <section className="card form-card">
      <h2>Student Data Entry</h2>
      <div className="form-grid three">
        <label>Name<input value={state.studentName} onChange={(e) => update("studentName", e.target.value)} /></label>
        <label>Roll No<input value={state.rollNo} onChange={(e) => update("rollNo", e.target.value)} /></label>
        <label>Date<input type="date" value={state.date} onChange={(e) => update("date", e.target.value)} /></label>
      </div>

      <div className="form-grid three">
        <label>Session Name<input value={state.sessionName} onChange={(e) => update("sessionName", e.target.value)} /></label>
        <label>Fluid
          <select value={state.fluid} onChange={(e) => update("fluid", e.target.value)}>
            <option>Caramel</option>
            <option>Ketchup</option>
            <option>Custom</option>
          </select>
        </label>
        <label>Unit System
          <select value={state.unitSystem} onChange={(e) => applySystem(e.target.value)}>
            {UNIT_SYSTEMS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
      </div>

      <h3>Apparatus</h3>
      <div className="form-grid three">
        <label>Diameter (D)
          <div className="pair">
            <input type="number" value={state.diameter} onChange={(e) => update("diameter", e.target.value)} />
            <UnitSelect value={state.diameterUnit} options={LENGTH_UNITS} onChange={(e) => update("diameterUnit", e.target.value)} />
          </div>
        </label>
        <label>Hypotenuse (h)
          <div className="pair">
            <input type="number" value={state.hypotenuse} onChange={(e) => update("hypotenuse", e.target.value)} />
            <UnitSelect value={state.hypotenuseUnit} options={LENGTH_UNITS} onChange={(e) => update("hypotenuseUnit", e.target.value)} />
          </div>
        </label>
        <label>Distance (l)
          <div className="pair">
            <input type="number" value={state.distance} onChange={(e) => update("distance", e.target.value)} />
            <UnitSelect value={state.distanceUnit} options={LENGTH_UNITS} onChange={(e) => update("distanceUnit", e.target.value)} />
          </div>
        </label>
      </div>

      <div className="card si-preview">
        <h3>Automatic SI Conversion (Live)</h3>
        <p>
          Diameter: {toSI(state.diameter, state.diameterUnit, "length").toFixed(6)} m | Hypotenuse: {toSI(state.hypotenuse, state.hypotenuseUnit, "length").toFixed(6)} m | Distance: {toSI(state.distance, state.distanceUnit, "length").toFixed(6)} m
        </p>
        {state.positions.map((p, i) => (
          <p key={i}>
            Position {i + 1}: P = {toSI(p.height, p.heightUnit, "length").toFixed(6)} m, m = {toSI(p.mass, p.massUnit, "mass").toFixed(6)} kg, t = {toSI(p.time, p.timeUnit, "time").toFixed(6)} s
          </p>
        ))}
      </div>

      <h3>Observation Data</h3>
      {state.positions.map((p, i) => (
        <div key={i} className="position-card">
          <strong>Position {i + 1}</strong>
          <div className="form-grid three">
            <label>Height (P)
              <div className="pair">
                <input type="number" value={p.height} onChange={(e) => updatePos(i, "height", e.target.value)} />
                <UnitSelect value={p.heightUnit} options={LENGTH_UNITS} onChange={(e) => updatePos(i, "heightUnit", e.target.value)} />
              </div>
            </label>
            <label>Mass (m)
              <div className="pair">
                <input type="number" value={p.mass} onChange={(e) => updatePos(i, "mass", e.target.value)} />
                <UnitSelect value={p.massUnit} options={MASS_UNITS} onChange={(e) => updatePos(i, "massUnit", e.target.value)} />
              </div>
            </label>
            <label>Time (t)
              <div className="pair">
                <input type="number" value={p.time} onChange={(e) => updatePos(i, "time", e.target.value)} />
                <UnitSelect value={p.timeUnit} options={TIME_UNITS} onChange={(e) => updatePos(i, "timeUnit", e.target.value)} />
              </div>
            </label>
          </div>
        </div>
      ))}

      <button className="btn primary" onClick={onCalculate}>Calculate Automatically</button>
      {errors.length > 0 && <div className="alert error">{errors.join(" ")}</div>}
      {warnings.length > 0 && <div className="alert warn">{warnings.join(" ")}</div>}
    </section>
  );
}
