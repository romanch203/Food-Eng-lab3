const LENGTH_TO_M = {
  m: 1,
  cm: 0.01,
  mm: 0.001,
  ft: 0.3048,
  in: 0.0254,
};

const MASS_TO_KG = {
  kg: 1,
  g: 0.001,
  lb: 0.45359237,
};

const TIME_TO_S = {
  s: 1,
  ms: 0.001,
  min: 60,
};

export const UNIT_SYSTEMS = ["SI", "MKS", "CGS", "FPS"];

export function toSI(value, unit, quantity) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;

  if (quantity === "length") return numeric * (LENGTH_TO_M[unit] ?? 1);
  if (quantity === "mass") return numeric * (MASS_TO_KG[unit] ?? 1);
  if (quantity === "time") return numeric * (TIME_TO_S[unit] ?? 1);
  return numeric;
}

export function fromSI(value, unit, quantity) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;

  if (quantity === "length") return numeric / (LENGTH_TO_M[unit] ?? 1);
  if (quantity === "mass") return numeric / (MASS_TO_KG[unit] ?? 1);
  if (quantity === "time") return numeric / (TIME_TO_S[unit] ?? 1);
  return numeric;
}

export function preferredUnitsForSystem(system) {
  if (system === "CGS") return { length: "cm", mass: "g", time: "s" };
  if (system === "FPS") return { length: "ft", mass: "lb", time: "s" };
  if (system === "MKS") return { length: "m", mass: "kg", time: "s" };
  return { length: "m", mass: "kg", time: "s" };
}

export const LENGTH_UNITS = ["m", "cm", "mm", "ft", "in"];
export const MASS_UNITS = ["kg", "g", "lb"];
export const TIME_UNITS = ["s", "ms", "min"];
