export const SLAT_CONSTANTS = {
  GAP: 12,
  DETAILS_H: 190,
  RAIL_H: 36,
  STAGE_SCROLL_VH: 300,
  REST_CENTRES: [0.06, 0.28, 0.5, 0.72, 0.94],
  NUM_SLATS: 5,
};

export interface SlatDimensions {
  W: number;
  stageH: number;
  Hs: number;
  Wo: number;
  Wc: number;
  g: number;
}

export function computeSlatDimensions(W: number, stageH: number): SlatDimensions {
  const g = SLAT_CONSTANTS.GAP;
  const detailsH = SLAT_CONSTANTS.DETAILS_H;
  const railH = SLAT_CONSTANTS.RAIL_H;

  // Hs (slat height) = min(0.382*W, stageH - 96 - 20 - DETAILS_H - RAIL_H - 16, (W - 400)/1.55); never below 300
  const maxAvailableH = stageH - 96 - 20 - detailsH - railH - 16;
  const maxWBasedH = Math.max(300, (W - 400) / 1.55);
  const hsCalculated = Math.min(0.382 * W, maxAvailableH, maxWBasedH);
  const Hs = Math.max(300, hsCalculated);

  // Wo (open slat width) = 1.55 * Hs (full photo at true ratio)
  const Wo = 1.55 * Hs;

  // Wc (closed slat width) = (W - 4g - Wo) / 4
  const Wc = Math.max(60, (W - 4 * g - Wo) / 4);

  return { W, stageH, Hs, Wo, Wc, g };
}

// Smoothstep: s(x) = x * x * (3 - 2 * x)
export function smoothstep(x: number): number {
  const clamped = Math.max(0, Math.min(1, x));
  return clamped * clamped * (3 - 2 * clamped);
}

// Slat open state (0 to 1) for slat i at continuous progress t (0 to 4)
export function getSlatOpen(i: number, t: number): number {
  const dist = Math.abs(i - t);
  if (dist >= 1) return 0;
  return smoothstep(1 - dist);
}

// Compute width of slat i given open factor (0 to 1)
export function getSlatWidth(open_i: number, Wo: number, Wc: number): number {
  return Wc + (Wo - Wc) * open_i;
}

// Compute image horizontal offset: imgX = -(Wo - w_i) * focusX
export function getImageOffsetX(Wo: number, wi: number, focusX: number): number {
  return -(Wo - wi) * focusX;
}
