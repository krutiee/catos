import {
  MEOW_RESPONSES,
  PURR_LINES,
  PSPSPS_INTRO,
  PSPSPS_RESPONSES,
  CATFACTS,
  LOVE_MESSAGES,
  MAKE_ME_HAPPY_LINE,
  KRUTI_PROFILE,
  HITANSHU_PROFILE,
  HUG_LINES,
  SMILE_LINE,
  ORANGE_POSES,
} from "../content.js";

function pick(pool) {
  return pool[Math.floor(Math.random() * pool.length)];
}

export function meow() {
  return { stdout: [pick(MEOW_RESPONSES)], stderr: [] };
}

export function purr() {
  return { stdout: PURR_LINES, stderr: [] };
}

export function pspsps() {
  return { stdout: [PSPSPS_INTRO, pick(PSPSPS_RESPONSES)], stderr: [] };
}

export function catfacts() {
  return { stdout: [pick(CATFACTS)], stderr: [] };
}

export function love() {
  return { stdout: [pick(LOVE_MESSAGES)], stderr: [] };
}

export function make_me_happy() {
  return { stdout: [MAKE_ME_HAPPY_LINE], stderr: [] };
}

export function kruti() {
  return { stdout: KRUTI_PROFILE, stderr: [] };
}

export function hitanshu() {
  return { stdout: HITANSHU_PROFILE, stderr: [] };
}

export function hug() {
  return { stdout: HUG_LINES, stderr: [] };
}

export function smile() {
  return { stdout: [SMILE_LINE], stderr: [] };
}

export function orange() {
  return { stdout: [pick(ORANGE_POSES)], stderr: [] };
}
