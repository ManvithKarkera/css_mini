#!/usr/bin/env node
/* tools/backlog/build.mjs — OWNER: Manvith Karkera
   Builds the static art of the "backlog machine" (Fig. 1 in the topology section) with the
   Anatomy iso kit (tools/backlog/iso-kit.mjs, MIT, see ANATOMY-LICENSE) and writes:
     js/backlog-art.js  Lab.BacklogArt (svg string + geometry) and Lab.Iso (the kit runtime)
     css/iso.css        the kit's styles
   The lab itself never runs this file: it ships the generated output, so the page still opens
   from file:// with no modules. Re-run after changing geometry: node tools/backlog/build.mjs

   The machine, in world units (x and y on the bench, z up):
     a cabinet of 100 pigeonholes (the half-open queue, one hook per slot, CONTRACT capacity),
     a conveyor that carries SYN tokens from a hopper to the cabinet's intake,
     four stations over the belt (firewall screen, rate-limit turnstile, SYN-cookie stamp press,
     intake gate), a reject tray in front, a queue gauge and a timeout timer on the cabinet top. */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "./iso-kit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");

const WIDTH = 760;
const HEIGHT = 470;
const AZIMUTH = 36;

// ---- plans -------------------------------------------------------------------
const PLATE = { x: -74, y: -78, w: 420, d: 150, r: 9 };
const PLATE_H = 12;
const FOOT_H = 6;

const CAB = { x: -56, y: -60, w: 128, d: 70, r: 2 };      // carcass x -56..72, front face y = 10
const PLINTH_H = 7;
const CAB_TOP = 156;
const CAP_H = 5;
const FRONT = CAB.y + CAB.d;                                // 10
const COLS = 10, ROWS = 10;
const GRID = { x0: CAB.x + 6, x1: CAB.x + CAB.w - 6, z0: PLINTH_H + 12, z1: CAB_TOP - 8 };
const PITCH_X = (GRID.x1 - GRID.x0) / COLS;
const PITCH_Z = (GRID.z1 - GRID.z0) / ROWS;

const BELT_Y = -40, BELT_W = 24;                            // belt centre line and width
const BELT = { x0: CAB.x + CAB.w + 4, x1: 336 };
const BELT_Z = 44;                                          // belt top
const RAIL_H = 5;
const MOUTH_X = CAB.x + CAB.w;                              // 72

const HOPPER_X = 312;
const SIEVE_X = 262;
const TURN_X = 212;
const PRESS_X = 158;
const GATE_X = MOUTH_X + 9;

const TRAY = { x: 90, y: -14, w: 214, d: 34, r: 3 };       // reject tray in front of the belt
const TRAY_H = 13;

const GAUGE = [-14, -25], GAUGE_R = 25, GAUGE_H = 9;
const TIMER = [44, -25], TIMER_R = 13, TIMER_H = 8;
const TOP_Z = CAB_TOP + CAP_H;

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [CAB.x, CAB.y, TOP_Z + GAUGE_H + 4], [CAB.x + CAB.w, CAB.y, TOP_Z + 10], [HOPPER_X + 14, BELT_Y - 16, 102]],
  WIDTH, HEIGHT, { pad: 22, azimuth: AZIMUTH },
);

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
const seg = (a, b) => k.segment(a, b, P);

// ---- bench -------------------------------------------------------------------
function bench() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 24))) {
    out.push(S(k.cylinder(x, y, 8, -PLATE_H - FOOT_H, 1.8, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 6.2, -PLATE_H - FOOT_H + 1.8, FOOT_H - 1.8, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 11);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.4, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.55 }));
  // ruler strip along the front edge, one tick per 4 units
  const strip = { x: PLATE.x + 70, y: PLATE.y + PLATE.d - 16, w: 330, d: 7, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [2, 3.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D([at([strip.x + 2, strip.y + 3.5, 0.6]), at([strip.x + strip.w - 2, strip.y + 3.5, 0.6])], { size: 0.45 }));
  // label plate at the front-left corner
  const label = { x: PLATE.x + 12, y: PLATE.y + PLATE.d - 30, w: 46, d: 20, r: 1.5 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 4), { tone: "mid", crease: "none" }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.6), 0.8, P, 4), { tone: "faint" }));
  out.push(k.faceTextSvg(k.topMatrix([label.x + 5, label.y + 7.4], 0.8, P, "x"), "SYN-Q 100", { size: 3.4, tone: "mid" }));
  [[label.x + 5, 30], [label.x + 5, 22]].forEach(([x, w], i) => out.push(L(k.lineOnTop([x, label.y + 11.5 + i * 3.6], [x + w, label.y + 11.5 + i * 3.6], 0.8, P), { tone: "lo", free: true })));
  out.push(D([at([label.x + label.w - 4, label.y + 4, 0.8]), at([label.x + label.w - 4, label.y + label.d - 4, 0.8])], { size: 0.45 }));
  return out.join("");
}

// ---- cabinet (the half-open queue) ---------------------------------------------
export const slotOf = (i) => {
  const col = i % COLS, row = Math.floor(i / COLS);              // fill from the bottom row up
  return { x: GRID.x0 + (col + 0.5) * PITCH_X, z: GRID.z0 + row * PITCH_Z };
};

function cabinet() {
  const out = [`<path class="iso-halo" d="${k.haloOf(CAB, 0, CAB_TOP, P)}"/>`];
  out.push(S(k.slabOf(k.insetPlan(CAB, 3), 0, PLINTH_H, P, 3, 0.4), { tone: "lo" }));
  const front = k.sideSeam(CAB, CAB_TOP - 16, P, 2);
  out.push(S(k.slabOf(CAB, PLINTH_H, CAB_TOP - PLINTH_H, P, 2, 0.8), { tone: "mid", inner: L(front, { tone: "faint" }) }));
  // pigeonhole grid on the front face (y = FRONT): shelves and dividers run edge to edge of the grid frame
  const lines = [];
  for (let r = 0; r <= ROWS; r++) {
    const z = GRID.z0 + r * PITCH_Z - 1.2;
    lines.push(seg([GRID.x0, FRONT, z], [GRID.x1, FRONT, z]));
  }
  for (let c = 0; c <= COLS; c++) {
    const x = GRID.x0 + c * PITCH_X;
    lines.push(seg([x, FRONT, GRID.z0 - 1.2], [x, FRONT, GRID.z1 - 1.2]));
  }
  out.push(L(lines.join(""), { tone: "lo" }));
  // a hook in every slot (the peg a tag hangs on)
  const pegs = [];
  for (let i = 0; i < COLS * ROWS; i++) { const s = slotOf(i); pegs.push(at([s.x, FRONT, s.z + PITCH_Z - 3.4])); }
  out.push(D(pegs, { size: 0.6, tone: "mid" }));
  // side panel (+x face): screws at the corners and a vent block of closed slots
  const side = [];
  for (const z of [PLINTH_H + 8, CAB_TOP - 8]) for (const y of [CAB.y + 6, FRONT - 6]) side.push(at([MOUTH_X, y, z]));
  out.push(D(side, { size: 0.55, tone: "hi" }));
  const vents = [];
  for (let v = 0; v < 6; v++) {
    const z = 96 + v * 6;
    vents.push(seg([MOUTH_X, CAB.y + 18, z], [MOUTH_X, FRONT - 18, z]), seg([MOUTH_X, CAB.y + 18, z + 2], [MOUTH_X, FRONT - 18, z + 2]),
      seg([MOUTH_X, CAB.y + 18, z], [MOUTH_X, CAB.y + 18, z + 2]), seg([MOUTH_X, FRONT - 18, z], [MOUTH_X, FRONT - 18, z + 2]));
  }
  out.push(L(vents.join(""), { tone: "lo" }));
  // top cap
  const cap = k.insetPlan(CAB, -2.5);
  out.push(S(k.slabOf(cap, CAB_TOP, CAP_H, P, 3, 0.8), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(cap, 4), TOP_Z, P, 3), { tone: "faint" }));
  out.push(D(k.corners(cap, 6).map(([x, y]) => at([x, y, TOP_Z])), { size: 0.5 }));
  // intake mouth on the side face, a collar the belt runs into
  const collar = { x: MOUTH_X, y: BELT_Y - BELT_W / 2 - 5, w: 6, d: BELT_W + 10, r: 1 };
  out.push(S(k.slabOf(collar, BELT_Z - 8, 30, P, 2, 0.5), { tone: "mid" }));
  const mx = MOUTH_X + 6, y0 = BELT_Y - BELT_W / 2, y1 = BELT_Y + BELT_W / 2;
  out.push(`<path class="bk-mouth" d="${k.pathOf([at([mx, y0, BELT_Z]), at([mx, y1, BELT_Z]), at([mx, y1, BELT_Z + 16]), at([mx, y0, BELT_Z + 16])], true)}"/>`);
  out.push(L(k.pathOf([at([mx, y0, BELT_Z]), at([mx, y1, BELT_Z]), at([mx, y1, BELT_Z + 16]), at([mx, y0, BELT_Z + 16])], true), { tone: "mid" }));
  out.push(D([at([mx, collar.y + 2.5, BELT_Z - 4]), at([mx, collar.y + collar.d - 2.5, BELT_Z - 4]), at([mx, collar.y + 2.5, BELT_Z + 18]), at([mx, collar.y + collar.d - 2.5, BELT_Z + 18])], { size: 0.45 }));
  return out.join("");
}

// tags: one per slot, built once, shown by data-kind
function tags() {
  const out = [];
  const order = [...Array(COLS * ROWS).keys()].sort((a, b) => {
    const A = slotOf(a), B = slotOf(b);
    return k.depthOf([A.x, FRONT, A.z], P) - k.depthOf([B.x, FRONT, B.z], P);
  });
  for (const i of order) {
    const s = slotOf(i);
    const plan = { x: s.x - PITCH_X / 2 + 1.4, y: FRONT, w: PITCH_X - 2.8, d: 1.3, r: 0.3 };
    const hole = at([s.x, FRONT + 1.3, s.z + PITCH_Z - 3.4]);
    out.push(`<g class="bk-tag" data-slot="${i}" data-kind="free">${S(k.slabOf(plan, s.z + 0.6, PITCH_Z - 3.4, P, 2), { tone: "hi", crease: "none" })}${D([hole], { size: 0.6, tone: "hi" })}</g>`);
  }
  return out.join("");
}

// ---- gauges on the cabinet top -----------------------------------------------------
function gauges() {
  const out = [];
  const [gx, gy] = GAUGE;
  out.push(S(k.cylinder(gx, gy, GAUGE_R + 2.5, TOP_Z, 2, P, 64), { tone: "lo" }));
  out.push(S(k.cylinder(gx, gy, GAUGE_R, TOP_Z + 2, GAUGE_H - 2, P, 72, 0.8), { tone: "hi", crease: "lo" }));
  const face = TOP_Z + GAUGE_H;
  out.push(L(k.knurl(gx, gy, GAUGE_R, face - 3.4, face, 90, P, 0.3), { tone: "lo" }));
  out.push(L(k.ring(gx, gy, GAUGE_R - 2.4, face, P, 72), { tone: "lo" }));
  // 0..100 % over 270 degrees, a tick per 2 %, major per 10 %; red zone from 90 %
  const SPAN = Math.PI * 1.5, FROM = -Math.PI * 0.75;
  const t = k.radialTicks(gx, gy, GAUGE_R - 3.2, 50, 5, face, [1.4, 3], P, FROM, SPAN * 50 / 50);
  out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  const red = [];
  for (let a = FROM + SPAN * 0.9; a <= FROM + SPAN + 1e-6; a += SPAN / 100) red.push([gx + Math.sin(a) * (GAUGE_R - 6.6), gy - Math.cos(a) * (GAUGE_R - 6.6)]);
  out.push(L(k.onTop(red, face, P), { tone: "red" }));
  out.push(S(k.cylinder(gx, gy, 2.2, face, 1, P, 20), { tone: "mid" }));
  out.push(k.faceTextSvg(k.topMatrix([gx, gy + 10], face, P, "x"), "SYN_RECV %", { size: 2.4, tone: "lo", anchor: "middle" }));
  // timer: 0..30 s over a full turn
  const [tx, ty] = TIMER;
  out.push(S(k.cylinder(tx, ty, TIMER_R + 2, TOP_Z, 2, P, 40), { tone: "lo" }));
  out.push(S(k.cylinder(tx, ty, TIMER_R, TOP_Z + 2, TIMER_H - 2, P, 48, 0.6), { tone: "hi", crease: "lo" }));
  const tf = TOP_Z + TIMER_H;
  out.push(L(k.knurl(tx, ty, TIMER_R, tf - 2.6, tf, 48, P, 0.3), { tone: "lo" }));
  const tt = k.radialTicks(tx, ty, TIMER_R - 2, 30, 5, tf, [1, 2.2], P);
  out.push(L(tt.minor, { tone: "faint" }), L(tt.major, { tone: "mid" }));
  out.push(S(k.cylinder(tx, ty, 1.6, tf, 0.8, P, 16), { tone: "mid" }));
  // the two dials sit on one mounting strip with screws
  return out.join("");
}

export const GAUGE_GEOM = { at: GAUGE, r: GAUGE_R - 5, z: TOP_Z + GAUGE_H + 0.2, from: -Math.PI * 0.75, span: Math.PI * 1.5 };
export const TIMER_GEOM = { at: TIMER, r: TIMER_R - 3, z: TOP_Z + TIMER_H + 0.2 };

// ---- conveyor -------------------------------------------------------------------
const LEGS = [BELT.x0 + 22, BELT.x1 - 14];
function conveyorBack() {
  const out = [];
  const yb = BELT_Y - BELT_W / 2 - 4;
  for (const x of LEGS) {
    out.push(S(k.slabOf({ x: x - 2.5, y: yb - 1, w: 5, d: 5, r: 0.8 }, 0, BELT_Z - 3, P, 2, 0.4), { tone: "mid", crease: "none" }));
    out.push(S(k.slabOf({ x: x - 5, y: yb - 3.5, w: 10, d: 10, r: 1.5 }, 0, 1.6, P, 3), { tone: "lo" }));
  }
  // back rail
  out.push(S(k.slabOf({ x: BELT.x0, y: yb, w: BELT.x1 - BELT.x0, d: 4, r: 0.8 }, BELT_Z - 6, RAIL_H + 4, P, 2, 0.4), { tone: "mid" }));
  return out.join("");
}
function belt() {
  const out = [];
  const plan = { x: BELT.x0, y: BELT_Y - BELT_W / 2, w: BELT.x1 - BELT.x0, d: BELT_W, r: 0.5 };
  out.push(S(k.slabOf(plan, BELT_Z - 5, 5, P, 2), { tone: "mid" }));
  // belt slats every 8 units, edge to edge
  const slats = [];
  for (let x = BELT.x0 + 6; x < BELT.x1 - 2; x += 8) slats.push(k.lineOnTop([x, plan.y], [x, plan.y + plan.d], BELT_Z, P));
  out.push(`<g class="bk-slats">${L(slats.join(""), { tone: "faint" })}</g>`);
  return out.join("");
}
function conveyorFront() {
  const out = [];
  const yf = BELT_Y + BELT_W / 2;
  out.push(S(k.slabOf({ x: BELT.x0, y: yf, w: BELT.x1 - BELT.x0, d: 4, r: 0.8 }, BELT_Z - 6, RAIL_H + 4, P, 2, 0.4), { tone: "mid" }));
  const bolts = [];
  for (let x = BELT.x0 + 10; x < BELT.x1; x += 24) bolts.push(at([x, yf + 4, BELT_Z - 2]));
  out.push(D(bolts, { size: 0.5, tone: "hi" }));
  for (const x of LEGS) {
    out.push(S(k.slabOf({ x: x - 2.5, y: yf + 0.5, w: 5, d: 5, r: 0.8 }, 0, BELT_Z - 6, P, 2, 0.4), { tone: "mid", crease: "none" }));
    out.push(S(k.slabOf({ x: x - 5, y: yf - 2, w: 10, d: 10, r: 1.5 }, 0, 1.6, P, 3), { tone: "lo" }));
  }
  // end drum caps on the far (+x) end
  out.push(L(k.sideRing([BELT.x1, BELT_Y + BELT_W / 2 + 4, BELT_Z - 1.5], 3.4, "y", P, 20), { tone: "mid" }));
  out.push(D([at([BELT.x1, BELT_Y + BELT_W / 2 + 4, BELT_Z - 1.5])], { size: 0.8, tone: "hi" }));
  // a motor box hanging under the far end, with a cable gland
  const motor = { x: BELT.x1 - 34, y: BELT_Y - 9, w: 22, d: 18, r: 2 };
  out.push(S(k.slabOf(motor, BELT_Z - 22, 15, P, 3, 0.5), { tone: "mid" }));
  const fins = [];
  for (let z = BELT_Z - 19; z < BELT_Z - 8; z += 2.5) fins.push(k.sideSeam(motor, z, P, 3));   // cooling ribs wrap the visible corners
  out.push(L(fins.join(""), { tone: "lo" }));
  return out.join("");
}

// ---- hopper (where SYNs arrive) -------------------------------------------------------
const hopperPosts = (y) => [HOPPER_X - 13, HOPPER_X + 10].map((x) => S(k.slabOf({ x, y, w: 3, d: 3, r: 0.6 }, BELT_Z + 3, 34, P, 2), { tone: "mid", crease: "none" })).join("");
function hopper() {
  const out = [hopperPosts(BELT_Y + BELT_W / 2 + 1)];
  const box = { x: HOPPER_X - 14, y: BELT_Y - 16, w: 28, d: 32, r: 2 };
  out.push(S(k.slabOf(box, BELT_Z + 37, 22, P, 3, 0.8), { tone: "mid", inner: L(k.sideSeam(box, BELT_Z + 48, P, 3), { tone: "faint" }) }));
  out.push(`<path class="bk-mouth" d="${k.planOutline(k.insetPlan(box, 3), BELT_Z + 59, P, 3)}"/>`);
  out.push(L(k.planOutline(k.insetPlan(box, 3), BELT_Z + 59, P, 3), { tone: "mid" }));
  out.push(D(k.corners(box, 2).map(([x, y]) => at([x, y, BELT_Z + 59])), { size: 0.45 }));
  return out.join("");
}

// ---- stations: a gantry of two posts and a crossbar over the belt --------------------------
function gantryBack(x, top) {
  const yb = BELT_Y - BELT_W / 2 - 8;
  return S(k.slabOf({ x: x - 3, y: yb, w: 6, d: 4, r: 0.6 }, BELT_Z - 6, top - BELT_Z + 6, P, 2, 0.4), { tone: "mid" })
    + D([at([x, yb + 4, BELT_Z - 2])], { size: 0.45 });
}
function gantryFront(x, top) {
  const yb = BELT_Y - BELT_W / 2 - 8, yf = BELT_Y + BELT_W / 2 + 4;
  return S(k.slabOf({ x: x - 3, y: yf, w: 6, d: 4, r: 0.6 }, BELT_Z - 6, top - BELT_Z + 6, P, 2, 0.4), { tone: "mid" })
    + S(k.slabOf({ x: x - 4, y: yb - 1, w: 8, d: yf + 5 - yb, r: 0.8 }, top, 5, P, 2, 0.5), { tone: "mid" })
    + D([at([x, yb + 1.5, top + 5]), at([x, yf + 2.5, top + 5]), at([x, yf + 4, BELT_Z - 2])], { size: 0.45 });
}

export const SIEVE_LIFT = 24;
function sieve() {
  // a framed screen that drops onto the belt: attack tokens stop against it
  const out = [];
  const y0 = BELT_Y - BELT_W / 2 + 1, y1 = BELT_Y + BELT_W / 2 - 1, z0 = BELT_Z + 1, z1 = BELT_Z + 22;
  out.push(S(k.slabOf({ x: SIEVE_X - 1.5, y: y0, w: 3, d: y1 - y0, r: 0.4 }, z0, z1 - z0, P, 2, 0.4), { tone: "hi", crease: "lo" }));
  const mesh = [];
  for (let y = y0 + 3; y < y1 - 1; y += 3) mesh.push(seg([SIEVE_X + 1.5, y, z0 + 2], [SIEVE_X + 1.5, y, z1 - 2]));
  for (let z = z0 + 3; z < z1 - 1; z += 3) mesh.push(seg([SIEVE_X + 1.5, y0 + 2, z], [SIEVE_X + 1.5, y1 - 2, z]));
  out.push(L(k.pathOf([at([SIEVE_X + 1.5, y0 + 2, z0 + 2]), at([SIEVE_X + 1.5, y1 - 2, z0 + 2]), at([SIEVE_X + 1.5, y1 - 2, z1 - 2]), at([SIEVE_X + 1.5, y0 + 2, z1 - 2])], true), { tone: "mid" }));
  out.push(L(mesh.join(""), { tone: "lo" }));
  // lift rods up to the crossbar
  for (const y of [y0 + 3, y1 - 3]) out.push(S(k.cylinder(SIEVE_X, y, 0.9, z1, 26, P, 10), { tone: "mid", crease: "none" }));
  return out.join("");
}

export const TURN_GEOM = { x: TURN_X, y: BELT_Y, z: BELT_Z + 1, h: 11, r: BELT_W / 2 - 2 };
export const TURN_LIFT = 22;
function turnstileHub() {
  // the spindle and hub; the four paddles are rebuilt live as it turns
  const out = [];
  out.push(S(k.cylinder(TURN_X, BELT_Y, 1.4, BELT_Z + 12, 34, P, 12), { tone: "mid", crease: "none" }));
  out.push(S(k.cylinder(TURN_X, BELT_Y, 3.2, BELT_Z + 1, 12, P, 24, 0.4), { tone: "hi", crease: "lo" }));
  out.push(L(k.sideArc(TURN_X, BELT_Y, 3.2, BELT_Z + 7, P, 16), { tone: "lo" }));
  return out.join("");
}

export const PRESS_GEOM = { x: PRESS_X, y: BELT_Y, rest: BELT_Z + 18, stroke: 15 };
function pressFrame() {
  // a C-frame press standing behind the belt: column, head, guide bushing
  const out = [];
  const yb = BELT_Y - BELT_W / 2 - 22;
  out.push(S(k.slabOf({ x: PRESS_X - 12, y: yb - 4, w: 24, d: 16, r: 2 }, 0, 4, P, 3, 0.6), { tone: "lo" }));
  out.push(S(k.slabOf({ x: PRESS_X - 6, y: yb, w: 12, d: 9, r: 1 }, 4, 82, P, 2, 0.5), { tone: "mid" }));
  out.push(D([at([PRESS_X - 9, yb + 8, 4]), at([PRESS_X + 9, yb + 8, 4])], { size: 0.45 }));
  return out.join("");
}
function pressHead() {
  const out = [];
  const yb = BELT_Y - BELT_W / 2 - 22;
  const head = { x: PRESS_X - 7, y: yb, w: 14, d: BELT_Y - yb + 8, r: 1.5 };
  out.push(S(k.slabOf(head, 76, 12, P, 3, 0.6), { tone: "mid", inner: L(k.sideSeam(head, 82, P, 3), { tone: "faint" }) }));
  out.push(S(k.cylinder(PRESS_X, BELT_Y, 5, 66, 10, P, 28, 0.5), { tone: "mid" }));
  out.push(L(k.sideArc(PRESS_X, BELT_Y, 5, 70, P, 20), { tone: "lo" }));
  // a lever on the head's side with a knurled grip
  out.push(S(k.cylinder(PRESS_X + 6, yb + 4, 2, 88, 12, P, 14), { tone: "mid", crease: "none" }));
  out.push(S(k.cylinder(PRESS_X + 6, yb + 4, 3, 100, 6, P, 20), { tone: "mid" }));
  out.push(L(k.knurl(PRESS_X + 6, yb + 4, 3, 100, 106, 18, P), { tone: "lo" }));
  return out.join("");
}
function pressRam() {
  // built at rest, moved with translateAlong; the die face is the lit part when it stamps
  const out = [];
  const { rest } = PRESS_GEOM;
  out.push(S(k.cylinder(PRESS_X, BELT_Y, 2.4, rest + 6, 86 - rest - 6, P, 16), { tone: "mid", crease: "none" }));
  out.push(S(k.cylinder(PRESS_X, BELT_Y, 6, rest, 6, P, 28, 0.5), { tone: "hi", crease: "lo", className: "bk-die" }));
  out.push(L(k.ring(PRESS_X, BELT_Y, 3.4, rest, P, 20), { tone: "lo" }));
  return out.join("");
}

// ---- intake gate ---------------------------------------------------------------------
export const GATE_LIFT = 17;
function gateFrame() {
  const out = [];
  const yb = BELT_Y - BELT_W / 2 - 5, yf = BELT_Y + BELT_W / 2 + 1;
  for (const y of [yb, yf]) out.push(S(k.slabOf({ x: GATE_X - 2, y, w: 4, d: 4, r: 0.5 }, BELT_Z - 6, 46, P, 2, 0.4), { tone: "mid" }));
  out.push(S(k.slabOf({ x: GATE_X - 3, y: yb - 1, w: 6, d: yf + 5 - yb, r: 0.6 }, BELT_Z + 40, 4, P, 2, 0.5), { tone: "mid" }));
  out.push(D([at([GATE_X, yb + 1, BELT_Z + 44]), at([GATE_X, yf + 3, BELT_Z + 44])], { size: 0.45 }));
  return out.join("");
}
function gateBlade() {
  // a guillotine blade, built closed (resting on the belt) and lifted when the queue has room
  const y0 = BELT_Y - BELT_W / 2, y1 = BELT_Y + BELT_W / 2;
  const blade = { x: GATE_X - 1, y: y0, w: 2, d: y1 - y0, r: 0.3 };
  return S(k.slabOf(blade, BELT_Z + 0.5, 20, P, 2, 0.3), { tone: "hi", crease: "lo", className: "bk-blade" })
    + D([at([GATE_X + 1, y0 + 3, BELT_Z + 16]), at([GATE_X + 1, y1 - 3, BELT_Z + 16])], { size: 0.45, tone: "hi" });
}

// ---- reject tray ----------------------------------------------------------------------
function trayBack() {
  const out = [`<path class="iso-halo" d="${k.haloOf(TRAY, 0, TRAY_H, P)}"/>`];
  out.push(S(k.slabOf(TRAY, 0, 2, P, 3), { tone: "lo" }));
  const inner = k.insetPlan(TRAY, 2);
  out.push(`<path class="bk-tray-floor" d="${k.slabOf(inner, 2, 0.1, P, 3).fill}"/>`);
  // back and left walls, seen from inside
  out.push(S(k.slabOf({ x: TRAY.x, y: TRAY.y, w: TRAY.w, d: 2, r: 0.4 }, 0, TRAY_H, P, 2), { tone: "mid", crease: "none" }));
  out.push(S(k.slabOf({ x: TRAY.x, y: TRAY.y, w: 2, d: TRAY.d, r: 0.4 }, 0, TRAY_H, P, 2), { tone: "mid", crease: "none" }));
  return out.join("");
}
function trayFront() {
  const out = [];
  out.push(S(k.slabOf({ x: TRAY.x + TRAY.w - 2, y: TRAY.y, w: 2, d: TRAY.d, r: 0.4 }, 0, TRAY_H, P, 2), { tone: "mid", crease: "none" }));
  const wall = { x: TRAY.x, y: TRAY.y + TRAY.d - 2, w: TRAY.w, d: 2, r: 0.4 };
  out.push(S(k.slabOf(wall, 0, TRAY_H, P, 2, 0.3), { tone: "mid", inner: L(k.sideSeam(wall, 4, P, 2), { tone: "faint" }) }));
  out.push(D([TRAY.x + 6, TRAY.x + TRAY.w / 2, TRAY.x + TRAY.w - 6].map((x) => at([x, TRAY.y + TRAY.d, 8.5])), { size: 0.45 }));
  return out.join("");
}

// ---- tokens --------------------------------------------------------------------------
export const TOKEN_R = 4.2, TOKEN_H = 2.4;
const token = (kind) => `<g class="bk-token" data-kind="${kind}">${S(k.cylinder(0, 0, TOKEN_R, 0, TOKEN_H, P, 24, 0.4), { tone: "hi", crease: "lo" })}${L(k.ring(0, 0, 2, TOKEN_H, P, 16), { tone: "lo" })}</g>`;

// ---- assemble ------------------------------------------------------------------------
const part = (name, body, extra = "") => `<g data-part="${name}"${extra}>${body}</g>`;
const body = [
  bench(),
  cabinet(),
  part("tags", tags()),
  gauges(),
  part("gauge-needle", `<path class="iso-line bk-needle" data-tone="lit" data-free="start" d=""/>`),
  part("timer-hand", `<path class="iso-line bk-hand" data-tone="hi" data-free="start" d=""/>`),
  pressFrame(),
  gantryBack(SIEVE_X, BELT_Z + 50),
  gantryBack(TURN_X, BELT_Z + 48),
  hopperPosts(BELT_Y - BELT_W / 2 - 4),
  conveyorBack(),
  belt(),
  // tokens ride in the layer for their stretch of belt, so each station is painted between them
  `<g data-part="lane" data-lane="0"></g>`,
  gateFrame(),
  part("gate", gateBlade()),
  `<g data-part="lane" data-lane="1"></g>`,
  part("ram", pressRam()),
  pressHead(),
  `<g data-part="lane" data-lane="2"></g>`,
  part("turnstile", turnstileHub() + `<g data-part="paddles"></g>`, ` transform=""`),
  `<g data-part="lane" data-lane="3"></g>`,
  part("sieve", sieve()),
  `<g data-part="lane" data-lane="4"></g>`,
  hopper(),
  gantryFront(SIEVE_X, BELT_Z + 50),
  gantryFront(TURN_X, BELT_Z + 48),
  conveyorFront(),
  trayBack(),
  `<g data-part="lane" data-lane="tray"></g>`,
  trayFront(),
];

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  className: "bk-svg",
  label: "The backlog machine. SYN tokens drop from a hopper onto a conveyor and ride to a cabinet of 100 pigeonholes, the server's half-open connection queue. Each token that gets in hangs a tag on a free hook: blue for a real client, dark for a spoofed attack SYN. Real clients take their tag back a moment later; attack tags hang until the timeout timer clears them. When every hook is full the intake gate drops and new tokens fall into the reject tray. Over the belt, a firewall screen, a rate-limit turnstile and a SYN-cookie stamp press come into play when those defences are switched on.",
  body,
});

const geom = {
  P, COLS, ROWS, FRONT, PITCH_X, PITCH_Z, GRID, BELT_Y, BELT_W, BELT_Z, BELT, MOUTH_X, GATE_X, HOPPER_X, SIEVE_X, TURN_X, PRESS_X,
  TRAY, TRAY_H, LANES: [GATE_X, PRESS_X, TURN_X, SIEVE_X], GAUGE: GAUGE_GEOM, TIMER: TIMER_GEOM, TURN: TURN_GEOM, PRESS: PRESS_GEOM, SIEVE_LIFT, TURN_LIFT, GATE_LIFT, TOKEN_R, TOKEN_H,
};

const tokens = { legit: token("legit"), attack: token("attack") };

// the kit, with its exports stripped, runs inside the Lab wrapper so nothing leaks to window
const kitSource = readFileSync(join(HERE, "iso-kit.mjs"), "utf8").replace(/^export /gm, "");
const out = `/* ==========================================================================
   backlog-art.js — GENERATED by tools/backlog/build.mjs, do not edit by hand.
   Lab.BacklogArt: the static SVG of the backlog machine and its geometry.
   Lab.Iso: the Anatomy iso kit (MIT, tools/backlog/ANATOMY-LICENSE), used by
   backlog.js to move parts and rebuild the needle and turnstile paddles.
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';
${kitSource}
  Lab.Iso = { iso: iso, depthOf: depthOf, translateAlong: translateAlong, lineOnTop: lineOnTop, onTop: onTop, extrude: extrude, solidSvg: solidSvg, cylinder: cylinder, slabOf: slabOf };
  Lab.BacklogArt = {
    svg: ${JSON.stringify(svg)},
    tokens: ${JSON.stringify(tokens)},
    geom: ${JSON.stringify(geom)},
    slots: ${JSON.stringify([...Array(COLS * ROWS).keys()].map((i) => slotOf(i)))}
  };
})(window.Lab);
`;
writeFileSync(join(ROOT, "js", "backlog-art.js"), out);
writeFileSync(join(ROOT, "css", "iso.css"), `/* iso.css — GENERATED by tools/backlog/build.mjs from the Anatomy kit (MIT). Do not edit by hand. */\n${k.ISO_CSS.trim()}\n`);
console.log(`wrote js/backlog-art.js (${(out.length / 1024).toFixed(0)} KB) and css/iso.css`);
