/**
 * HCT Color System - Zero-dependency implementation
 * Re-implemented based on the Google material-color-utilities (Apache 2.0) algorithm
 *
 * HCT = Hue (CAM16) + Chroma (CAM16) + Tone (CIELAB L*)
 */

// ==================== sRGB ↔ Linear RGB ====================

/** sRGB 0-255 to linear 0-1 (gamma expansion) */
function srgbToLinear(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

/** linear 0-1 to sRGB 0-255 (gamma compression) */
function linearToSrgb(c: number): number {
  const s = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return Math.round(Math.max(0, Math.min(255, s * 255)));
}

// ==================== XYZ Conversion ====================

// sRGB to XYZ (D65) matrix
const SRGB_TO_XYZ = [
  [0.4124564, 0.3575761, 0.1804375],
  [0.2126729, 0.7151522, 0.0721750],
  [0.0193339, 0.1191920, 0.9503041],
];

// XYZ (D65) to sRGB matrix
const XYZ_TO_SRGB = [
  [3.2404542, -1.5371385, -0.4985314],
  [-0.9692660, 1.8760108, 0.0415560],
  [0.0556434, -0.2040259, 1.0572252],
];

function matMul3(m: number[][], v: [number, number, number]): [number, number, number] {
  return [
    m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
    m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
    m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
  ];
}

function rgbToXyz(r: number, g: number, b: number): [number, number, number] {
  return matMul3(SRGB_TO_XYZ, [srgbToLinear(r), srgbToLinear(g), srgbToLinear(b)]);
}

function xyzToRgb(x: number, y: number, z: number): [number, number, number] {
  const [lr, lg, lb] = matMul3(XYZ_TO_SRGB, [x, y, z]);
  return [linearToSrgb(lr), linearToSrgb(lg), linearToSrgb(lb)];
}

// ==================== CIELAB (Tone = L*) ====================

const D65_WHITE: [number, number, number] = [0.95047, 1.0, 1.08883];

function labF(t: number): number {
  const delta = 6 / 29;
  return t > delta ** 3 ? Math.cbrt(t) : t / (3 * delta * delta) + 4 / 29;
}

function labFInv(t: number): number {
  const delta = 6 / 29;
  return t > delta ? t ** 3 : 3 * delta * delta * (t - 4 / 29);
}

/** XYZ → CIELAB L* (0-100) */
function xyzToLStar(x: number, y: number, z: number): number {
  const fy = labF(y / D65_WHITE[1]);
  return 116 * fy - 16;
}

/** L* to Y (XYZ Y component) */
function lStarToY(lStar: number): number {
  const fy = (lStar + 16) / 116;
  return D65_WHITE[1] * labFInv(fy);
}

// ==================== CAM16 ====================

// CAM16 viewing condition (sRGB standard: D65, 200 cd/m2, background Y=18.42)
const CAM16_C = 0.69;    // impact of surround
const CAM16_NC = 1.0;    // chromatic induction factor
const CAM16_FL = 0.3884;  // luminance adaptation factor
const CAM16_N = 0.2;     // background induction factor (Yb/Yw)
const CAM16_NBB = 1.0169; // N_bb = N_cb
const CAM16_NCB = CAM16_NBB;
const CAM16_AW = 29.981;  // achromatic response for white
const CAM16_D = 0.8450;  // degree of adaptation
const CAM16_Z = 1.9090;  // base exponential nonlinearity

// M16 matrix (XYZ to CAM16 LMS)
const M16 = [
  [0.401288, 0.650173, -0.051461],
  [-0.250268, 1.204414, 0.045854],
  [-0.002079, 0.048952, 0.953127],
];

const M16_INV = [
  [1.8620678, -1.0112547, 0.1491867],
  [0.3875265, 0.6214474, -0.0089739],
  [-0.0158415, -0.0344317, 1.0502732],
];

// D65 white point adapted RGB
const CAM16_RGB_W = matMul3(M16, D65_WHITE);
const CAM16_D_RGB = CAM16_RGB_W.map(c => CAM16_D * (D65_WHITE[1] / c) + 1 - CAM16_D) as [number, number, number];

function adaptedComponent(c: number): number {
  const p = Math.pow(CAM16_FL * Math.abs(c) / 100, 0.42);
  return Math.sign(c) * 400 * p / (p + 27.13);
}

function adaptedComponentInv(c: number): number {
  const abs = Math.abs(c);
  return Math.sign(c) * (100 / CAM16_FL) * Math.pow(27.13 * abs / (400 - abs), 1 / 0.42);
}

interface Cam16Result {
  h: number; // hue (0-360)
  C: number; // chroma
  J: number; // lightness
  Q: number; // brightness
  M: number; // colorfulness
  s: number; // saturation
}

function xyzToCam16(x: number, y: number, z: number): Cam16Result {
  const [lr, lg, lb] = matMul3(M16, [x, y, z]);
  // Chromatic adaptation
  const rc = lr * CAM16_D_RGB[0];
  const gc = lg * CAM16_D_RGB[1];
  const bc = lb * CAM16_D_RGB[2];

  // Post-adaptation
  const ra = adaptedComponent(rc);
  const ga = adaptedComponent(gc);
  const ba = adaptedComponent(bc);

  // Opponent color signals
  const a = ra - 12 * ga / 11 + ba / 11;
  const b = (ra + ga - 2 * ba) / 9;

  // Hue
  let h = (Math.atan2(b, a) * 180) / Math.PI;
  if (h < 0) h += 360;

  // Achromatic response
  const A = (2 * ra + ga + 0.05 * ba - 0.305) * CAM16_NBB;

  // Lightness
  const J = 100 * Math.pow(A / CAM16_AW, CAM16_C * CAM16_Z);

  // Brightness
  const Q = (4 / CAM16_C) * Math.sqrt(J / 100) * (CAM16_AW + 4) * Math.pow(CAM16_FL, 0.25);

  // Hue eccentricity
  const hRad = (h * Math.PI) / 180;
  const t = (50000 / 13) * CAM16_NC * CAM16_NCB * Math.sqrt(a * a + b * b) /
    (ra + ga + 21 * ba / 20);

  // Chroma
  const C = t * Math.sqrt(J / 100) * Math.pow(1.64 - Math.pow(0.29, CAM16_N), 0.73);

  // Colorfulness
  const M = C * Math.pow(CAM16_FL, 0.25);

  // Saturation
  const s = 50 * Math.sqrt((CAM16_C * C) / (CAM16_AW + 4));

  return { h, C, J, Q, M, s };
}

function cam16ToXyz(h: number, C: number, J: number): [number, number, number] {
  const hRad = (h * Math.PI) / 180;

  // From J → A
  const A = CAM16_AW * Math.pow(J / 100, 1 / (CAM16_C * CAM16_Z));

  // From C → t
  const t = C / (Math.sqrt(J / 100) * Math.pow(1.64 - Math.pow(0.29, CAM16_N), 0.73));

  const p1 = (50000 / 13) * CAM16_NC * CAM16_NCB;
  const p2 = A / CAM16_NBB;

  const cos = Math.cos(hRad);
  const sin = Math.sin(hRad);

  const gamma = 23 * (p2 + 0.305) * t / (23 * p1 + 11 * t * cos + 108 * t * sin);
  const a = gamma * cos;
  const b = gamma * sin;

  const ra = (460 * p2 + 451 * a + 288 * b) / 1403;
  const ga = (460 * p2 - 891 * a - 261 * b) / 1403;
  const ba = (460 * p2 - 220 * a - 6300 * b) / 1403;

  const rc = adaptedComponentInv(ra);
  const gc = adaptedComponentInv(ga);
  const bc = adaptedComponentInv(ba);

  // Reverse chromatic adaptation
  const lr = rc / CAM16_D_RGB[0];
  const lg = gc / CAM16_D_RGB[1];
  const lb = bc / CAM16_D_RGB[2];

  return matMul3(M16_INV, [lr, lg, lb]);
}

// ==================== HCT ====================

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(c => Math.max(0, Math.min(255, c)).toString(16).padStart(2, '0')).join('');
}

function isInGamut(r: number, g: number, b: number): boolean {
  return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
}

/**
 * HCT Solver: Find the closest sRGB to target (H, C, T) via binary search
 *
 * T (Tone = L*) maps directly to XYZ via Y.
 * H, C are computed via CAM16.
 * Compute Y from target T, get XYZ via inverse CAM16,
 * then adjust Chroma to fit within sRGB gamut.
 */
function solveHctToRgb(hue: number, chroma: number, tone: number): [number, number, number] {
  if (tone <= 0) return [0, 0, 0];
  if (tone >= 100) return [255, 255, 255];
  if (chroma < 0.5) {
    // Nearly achromatic - return gray
    const g = Math.round((tone / 100) * 255);
    return [g, g, g];
  }

  // Target Y
  const y = lStarToY(tone);

  // Search for solution within gamut by reducing Chroma
  let lo = 0;
  let hi = chroma;
  let bestRgb: [number, number, number] = [0, 0, 0];

  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    // Estimate J from tone (CAM16 J approximately corresponds to L*)
    const J = tone; // : J  L*

    const [x, yc, z] = cam16ToXyz(hue, mid, J);
    // Scale Y to match target
    const scale = yc > 0 ? y / yc : 1;
    const [r, g, b] = xyzToRgb(x * scale, y, z * scale);

    if (isInGamut(r, g, b)) {
      bestRgb = [r, g, b];
      lo = mid;
    } else {
      hi = mid;
    }
  }

  return bestRgb;
}

/** HCT Color class */
export class HctColor {
  readonly hue: number;
  readonly chroma: number;
  readonly tone: number;

  private constructor(hue: number, chroma: number, tone: number) {
    this.hue = ((hue % 360) + 360) % 360;
    this.chroma = Math.max(0, chroma);
    this.tone = Math.max(0, Math.min(100, tone));
  }

  /** Create HCT from hex (#RRGGBB) */
  static fromHex(hex: string): HctColor {
    const [r, g, b] = hexToRgb(hex);
    const [x, y, z] = rgbToXyz(r, g, b);
    const cam = xyzToCam16(x, y, z);
    const tone = xyzToLStar(x, y, z);
    return new HctColor(cam.h, cam.C, tone);
  }

  /** Create directly from H, C, T */
  static from(hue: number, chroma: number, tone: number): HctColor {
    return new HctColor(hue, chroma, tone);
  }

  /** Convert HCT to hex */
  toHex(): string {
    const [r, g, b] = solveHctToRgb(this.hue, this.chroma, this.tone);
    return rgbToHex(r, g, b);
  }

  /** Return a new HctColor with modified Tone */
  withTone(tone: number): HctColor {
    return new HctColor(this.hue, this.chroma, tone);
  }

  /** Return a new HctColor with modified Chroma */
  withChroma(chroma: number): HctColor {
    return new HctColor(this.hue, chroma, this.tone);
  }

  /** Return a new HctColor with modified Hue */
  withHue(hue: number): HctColor {
    return new HctColor(hue, this.chroma, this.tone);
  }

  toString(): string {
    return `HCT(${this.hue.toFixed(1)}, ${this.chroma.toFixed(1)}, ${this.tone.toFixed(1)}) = ${this.toHex()}`;
  }
}

// Public API
export { hexToRgb, rgbToHex, xyzToLStar, lStarToY };
