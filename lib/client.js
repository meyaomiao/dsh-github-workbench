window.__ModuleLoader__.load({ id: "dsh-github-workbench", factory: (require) => {
var module = { exports: {} };
var exports = module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.ts
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  inject: () => inject,
  name: () => name
});
module.exports = __toCommonJS(client_exports);

// src/mount.ts
var import_react9 = require("react");
var import_client = require("react-dom/client");

// src/icons.ts
var import_react = require("react");
var PATHS = {
  octo: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z",
  "chevron-down": "M12.78 5.22a.749.749 0 00-1.06 0L8 9.44 4.28 5.72a.749.749 0 10-1.06 1.06l4.25 4.25c.146.147.338.22.53.22s.384-.072.53-.22l4.25-4.25a.749.749 0 000-1.06z",
  "chevron-left": "M9.78 3.22a.75.75 0 010 1.06L6.06 8l3.72 3.72a.75.75 0 11-1.06 1.06L4.47 8.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0z",
  "chevron-right": "M6.22 3.22a.75.75 0 000 1.06L9.94 8l-3.72 3.72a.75.75 0 101.06 1.06l4.25-4.25a.75.75 0 000-1.06L7.28 3.22a.75.75 0 00-1.06 0z",
  refresh: "M8 2.489a5.511 5.511 0 105.51 5.51.75.75 0 011.5 0 7.011 7.011 0 11-2.048-4.962V1.75a.75.75 0 011.5 0v3.5a.75.75 0 01-.75.75h-3.5a.75.75 0 010-1.5h1.57A5.49 5.49 0 008 2.489z",
  gear: "M8 .8a.75.75 0 01.74.62l.23 1.32c.32.11.63.26.91.44l1.26-.46a.75.75 0 01.91.33l.87 1.5a.75.75 0 01-.17.96l-1.03.86c.02.34.02.68 0 1.02l1.03.86a.75.75 0 01.17.96l-.87 1.5a.75.75 0 01-.91.33l-1.26-.46c-.28.18-.59.33-.91.44l-.23 1.32a.75.75 0 01-.74.62h-1.74a.75.75 0 01-.74-.62l-.23-1.32a5.3 5.3 0 01-.91-.44l-1.26.46a.75.75 0 01-.91-.33l-.87-1.5a.75.75 0 01.17-.96l1.03-.86a5.6 5.6 0 010-1.02L1.72 6.51a.75.75 0 01-.17-.96l.87-1.5a.75.75 0 01.91-.33l1.26.46c.28-.18.59-.33.91-.44L5.73.8A.75.75 0 016.47.8H8zM8 5.4a2.6 2.6 0 100 5.2 2.6 2.6 0 000-5.2z",
  inbox: "M3.262 2.326A1.75 1.75 0 014.98 1h6.04a1.75 1.75 0 011.717 1.326l1.498 6.241a.25.25 0 01.01.074v3.66A1.75 1.75 0 0112.495 14H3.505a1.75 1.75 0 01-1.75-1.75v-3.66a.25.25 0 01.01-.074zM4.98 2.5a.25.25 0 00-.246.19L3.57 7.5H6.5a.75.75 0 01.64.392L7.86 9h.28l.72-1.108A.75.75 0 019.5 7.5h2.93l-1.164-4.81a.25.25 0 00-.246-.19zM2.25 8.5H3.5v3.75c0 .138.112.25.25.25h8.99a.25.25 0 00.25-.25V8.5h-.75l-.72 1.108A.75.75 0 0110.5 10h-5a.75.75 0 01-.64-.392z",
  code: "M4.72 3.22a.75.75 0 011.06 1.06L2.06 8l3.72 3.72a.75.75 0 11-1.06 1.06L.47 8.53a.75.75 0 010-1.06l4.25-4.25zm6.56 0a.75.75 0 10-1.06 1.06L13.94 8l-3.72 3.72a.75.75 0 101.06 1.06l4.25-4.25a.75.75 0 000-1.06l-4.25-4.25z",
  issue: "M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z",
  pr: "M1.5 3.25a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zm5.677-.177L9.573.677A.25.25 0 0110 .854V2.5h1A2.5 2.5 0 0113.5 5v5.628a2.251 2.251 0 11-1.5 0V5a1 1 0 00-1-1h-1v1.646a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354z",
  play: "M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM6.5 5.25a.75.75 0 011.148-.636l3.667 2.75a.75.75 0 010 1.272l-3.667 2.75A.75.75 0 016.5 10.75v-5.5z",
  "check-circle": "M8 16A8 8 0 118 0a8 8 0 010 16zm3.78-9.72a.751.751 0 00-1.06-1.06L6.75 9.19 5.28 7.72a.751.751 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l4.5-4.5z",
  "x-circle": "M2.343 13.657A8 8 0 1113.656 2.343 8 8 0 012.343 13.657zM6.03 4.97a.751.751 0 00-1.042 1.086L6.94 8 4.99 9.944a.751.751 0 001.042 1.086L8 9.06l1.97 1.97a.751.751 0 101.042-1.086L9.06 8l1.95-1.944a.751.751 0 10-1.042-1.086L8 6.94 6.03 4.97z",
  loader: "M8 0a8 8 0 100 16A8 8 0 008 0zm0 1.5a6.5 6.5 0 110 13 6.5 6.5 0 010-13z",
  "circle-idle": "M8 4a4 4 0 100 8 4 4 0 000-8zM0 8a8 8 0 1116 0A8 8 0 010 8z",
  "external-link": "M3.75 2h3.5a.75.75 0 010 1.5h-3.5a.25.25 0 00-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25v-3.5a.75.75 0 011.5 0v3.5A1.75 1.75 0 0112.25 14h-8.5A1.75 1.75 0 012 12.25v-8.5C2 2.784 2.784 2 3.75 2zm6.854-1h4.146a.25.25 0 01.25.25v4.146a.25.25 0 01-.427.177L13.03 4.03 9.28 7.78a.751.751 0 01-1.042-1.086L11.97 3.22l-1.75-1.75a.25.25 0 01.177-.427z",
  plus: "M7.75 2a.75.75 0 01.75.75V7h4.25a.75.75 0 010 1.5H8.5v4.25a.75.75 0 01-1.5 0V8.5H2.75a.75.75 0 010-1.5H7V2.75A.75.75 0 017.75 2z",
  pencil: "M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0l-1.262 1.263 1.439 1.44 1.263-1.263a.25.25 0 000-.354l-1.086-1.086zM11.189 6.25L9.75 4.81l-6.286 6.287a.25.25 0 00-.064.108l-.558 1.953 1.953-.558a.25.25 0 00.108-.064l6.286-6.286z",
  trash: "M11 1.75V3h2.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75zM4.496 6.675l.66 6.6a.25.25 0 00.249.225h5.19a.25.25 0 00.249-.225l.66-6.6a.75.75 0 011.492.149l-.66 6.6A1.748 1.748 0 0110.595 15h-5.19a1.75 1.75 0 01-1.741-1.575l-.66-6.6a.75.75 0 111.492-.15zM6.5 1.75V3h3V1.75a.25.25 0 00-.25-.25h-2.5a.25.25 0 00-.25.25z",
  comment: "M1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0113.25 12H9.06l-2.573 2.573A1.458 1.458 0 014 13.543V12H2.75A1.75 1.75 0 011 10.25v-7.5z",
  merge: "M5.45 5.154A4.25 4.25 0 009.25 7.5h1.378a2.251 2.251 0 114.075 1.532 2.25 2.25 0 01-4.076 0H9.25a5.75 5.75 0 01-4.6-2.299A2.25 2.25 0 011.5 5.938 2.25 2.25 0 015.45 5.15zM3.25 7.5a.75.75 0 100-1.5.75.75 0 000 1.5zm0 4.5a.75.75 0 100-1.5.75.75 0 000 1.5zm9.5-3.5a.75.75 0 100-1.5.75.75 0 000 1.5z",
  lock: "M4 4a4 4 0 118 0v2h.25c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0112.25 15h-8.5A1.75 1.75 0 012 13.25v-5.5C2 6.784 2.784 6 3.75 6H4V4zm8 2V4a2 2 0 10-4 0v2h4z",
  file: "M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0113.25 16h-9.5A1.75 1.75 0 012 14.25V1.75z",
  folder: "M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0 0014.25 3H7.5a.25.25 0 01-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75z",
  "folder-open": "M.75 3h4.5l.9 1.2c.14.19.37.3.6.3h6.5a.75.75 0 01.75.75V6H2.4a1.75 1.75 0 00-1.69 1.29L.4 8.36A.6.6 0 01.3 8.5V3.75A.75.75 0 01.75 3zM.75 16a.75.75 0 01-.73-.93L1.4 7.67A.25.25 0 011.64 7.5h13.42a.25.25 0 01.24.31l-1.52 6.18A1.75 1.75 0 0113.09 16H.75z"
};
function GwIcon(props) {
  const { name: name2, size = 15, className = "", style, title } = props;
  return (0, import_react.createElement)("svg", {
    className: `gw-icon ${className}`.trim(),
    viewBox: "0 0 16 16",
    width: size,
    height: size,
    fill: "currentColor",
    "aria-hidden": title ? void 0 : true,
    role: title ? "img" : void 0,
    style
  }, title ? [(0, import_react.createElement)("title", { key: "t" }, title), (0, import_react.createElement)("path", { key: "p", d: PATHS[name2] })] : (0, import_react.createElement)("path", { d: PATHS[name2] }));
}
function iconFor(name2) {
  return (size) => GwIcon({ name: name2, size });
}

// src/workbench.tsx
var import_react8 = require("react");

// src/lib.ts
function ghRefKey(ref) {
  return `${ref.owner}/${ref.repo}`;
}
function parseGithubRemote(configText) {
  const re = /url\s*=\s*(?:https?:\/\/|git@|ssh:\/\/git@)(?:www\.)?github\.com[/:]([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?(?:\s|$)/g;
  let fallback = null;
  for (const m of configText.matchAll(re)) {
    const ref = { owner: m[1], repo: m[2] };
    if (!fallback) fallback = ref;
    const before = configText.slice(0, m.index ?? 0);
    const sec = before.lastIndexOf("[remote");
    if (sec >= 0 && /\[remote\s+"origin"\]/.test(before.slice(sec))) return ref;
  }
  return fallback;
}
function parseRepoInput(input) {
  const raw = input.trim();
  if (!raw) return null;
  let m = /^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/.exec(raw);
  if (m) return { owner: m[1], repo: m[2].replace(/\.git$/, "") };
  m = /github\.com[/:]([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?(?:[/?#]|$)/.exec(raw);
  if (m) return { owner: m[1], repo: m[2] };
  return null;
}
function qs(params) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== void 0 && v !== "") sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}
function parseLinkNext(link) {
  if (!link) return null;
  for (const part of link.split(",")) {
    const m = /<([^>]+)>\s*;\s*rel="?next"?/i.exec(part);
    if (m) return m[1];
  }
  return null;
}
function buildTree(items) {
  const roots = [];
  const dirs = /* @__PURE__ */ new Map();
  const parentOf = (path) => path.includes("/") ? path.slice(0, path.lastIndexOf("/")) : "";
  const ensureDir = (path) => {
    const hit = dirs.get(path);
    if (hit) return hit;
    const node = { name: path.split("/").pop() ?? path, path, type: "tree", children: [] };
    dirs.set(path, node);
    const parent = parentOf(path);
    if (parent) ensureDir(parent).children.push(node);
    else roots.push(node);
    return node;
  };
  for (const item of items) {
    if (item.type === "tree") {
      ensureDir(item.path);
      continue;
    }
    const node = {
      name: item.path.split("/").pop() ?? item.path,
      path: item.path,
      type: "blob",
      size: item.size
    };
    const parent = parentOf(item.path);
    if (parent) ensureDir(parent).children.push(node);
    else roots.push(node);
  }
  const sortRec = (nodes) => {
    nodes.sort((a, b) => a.type === b.type ? a.name.localeCompare(b.name) : a.type === "tree" ? -1 : 1);
    for (const n of nodes) if (n.children) sortRec(n.children);
  };
  sortRec(roots);
  return roots;
}
function parseGithubUrl(href) {
  try {
    const u = new URL(href);
    if (!/(^|\.)github\.com$/.test(u.hostname)) return null;
    const seg = u.pathname.split("/").filter(Boolean);
    if (seg.length < 2) return null;
    const ref = { owner: seg[0], repo: seg[1].replace(/\.git$/, "") };
    const out = { ref };
    if (seg[2] === "issues" && /^\d+$/.test(seg[3] ?? "")) {
      out.kind = "issues";
      out.number = Number(seg[3]);
    } else if (seg[2] === "pull" && /^\d+$/.test(seg[3] ?? "")) {
      out.kind = "pulls";
      out.number = Number(seg[3]);
    } else if (seg[2] === "actions") {
      out.kind = "actions";
    }
    return out;
  } catch {
    return null;
  }
}
function timeAgo(iso, now = Date.now()) {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return iso;
  const diff = Math.max(0, now - t);
  const min = Math.floor(diff / 6e4);
  if (min < 1) return "\u521A\u521A";
  if (min < 60) return `${min} \u5206\u949F\u524D`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} \u5C0F\u65F6\u524D`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} \u5929\u524D`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo} \u4E2A\u6708\u524D`;
  return new Date(t).toISOString().slice(0, 10);
}
function fmtDuration(ms) {
  const s = Math.max(0, Math.round(ms / 1e3));
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}
function fmtSize(bytes) {
  if (bytes === void 0 || bytes === null) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}
function chunkRepoQualifiers(fullNames, maxLen = 220) {
  const chunks = [];
  let cur = [];
  let len = 0;
  for (const name2 of fullNames) {
    if (!name2) continue;
    const piece = `repo:${name2}`;
    const extra = cur.length === 0 ? piece.length : piece.length + 4;
    if (cur.length > 0 && len + extra > maxLen) {
      chunks.push(cur);
      cur = [name2];
      len = piece.length;
    } else {
      cur.push(name2);
      len += extra;
    }
  }
  if (cur.length) chunks.push(cur);
  return chunks;
}
function inboxItemKey(kind, owner, repo, n) {
  return `${kind}:${owner}/${repo}#${n}`;
}
function decodeBase64Utf8(b64) {
  const bin = atob(b64.replace(/\s+/g, ""));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}
function labelTextColor(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.padEnd(6, "0");
  const r = parseInt(full.slice(0, 2), 16), g = parseInt(full.slice(2, 4), 16), b = parseInt(full.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1e3 >= 140 ? "#000000cc" : "#ffffffee";
}

// src/api.ts
var API = "https://api.github.com";
var TOKEN_KEY = "gw.token";
function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
}
function setToken(token) {
  repoCache = null;
  viewerCache = void 0;
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
  }
}
var lastRemaining = null;
function rateRemaining() {
  return lastRemaining;
}
var GhError = class extends Error {
  status;
  constructor(message, status) {
    super(message);
    this.name = "GhError";
    this.status = status;
  }
};
async function ghRequest(path, opts = {}) {
  const headers = {
    accept: opts.accept ?? "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };
  const token = getToken();
  if (token) headers.authorization = `Bearer ${token}`;
  if (opts.body !== void 0) headers["content-type"] = "application/json";
  const res = await fetch(path.startsWith("http") ? path : `${API}${path}`, {
    method: opts.method ?? "GET",
    headers,
    body: opts.body === void 0 ? void 0 : JSON.stringify(opts.body)
  });
  const remain = res.headers.get("x-ratelimit-remaining");
  const resource = res.headers.get("x-ratelimit-resource");
  const remainNum = remain != null ? Number(remain) : null;
  if (remainNum != null && resource !== "search") lastRemaining = remainNum;
  const link = res.headers.get("link");
  if (res.ok) {
    if (res.status === 204) return { status: 204, json: void 0, link };
    return { status: res.status, json: await res.json(), link };
  }
  let upstream = "";
  try {
    upstream = (await res.json()).message ?? "";
  } catch {
  }
  if (res.status === 401) throw new GhError("Token \u65E0\u6548\u6216\u5DF2\u8FC7\u671F(HTTP 401)\u3002\u8BF7\u5728 \u2699 \u8BBE\u7F6E\u91CC\u68C0\u67E5 Personal Access Token\u3002", 401);
  if (res.status === 403) {
    const isSearch = resource === "search" || /\/search\//.test(path);
    if (remainNum === 0 || /rate limit/i.test(upstream)) {
      throw new GhError(isSearch ? "GitHub Search API \u9650\u6D41(HTTP 403):\u5DF2\u767B\u5F55\u7EA6 30 \u6B21/\u5206\u949F\u3002\u7A0D\u540E\u518D\u70B9\u300C\u52A0\u8F7D\u66F4\u591A\u300D,\u6216\u6539\u7528 PAT\u3002" : "GitHub API \u9650\u6D41(HTTP 403):\u533F\u540D\u989D\u5EA6\u4EC5 60 \u6B21/\u5C0F\u65F6\u3002\u5728 \u2699 \u8BBE\u7F6E\u586B\u5165 PAT \u5373\u63D0\u5347\u5230 5000 \u6B21/\u5C0F\u65F6\u3002", 403);
    }
  }
  if (res.status === 403) throw new GhError(`\u6743\u9650\u4E0D\u8DB3(HTTP 403)${upstream ? `:${upstream}` : ""}\u3002\u5199\u64CD\u4F5C\u9700\u8981\u5BF9\u5E94 RW \u6743\u9650\u7684 Token\u3002`, 403);
  if (res.status === 404) throw new GhError(`\u8D44\u6E90\u4E0D\u5B58\u5728(HTTP 404):\u786E\u8BA4 owner/repo\u3001\u5206\u652F\u6216\u7F16\u53F7\u6B63\u786E;\u79C1\u6709\u4ED3\u9700 Token \u5177\u5907\u8BFB\u53D6\u6743\u9650\u3002 ${upstream}`, 404);
  if (res.status === 422) throw new GhError(`\u8BF7\u6C42\u88AB GitHub \u62D2\u7EDD(HTTP 422):${upstream || "\u53C2\u6570\u6821\u9A8C\u5931\u8D25"}`, 422);
  throw new GhError(`GitHub API \u9519\u8BEF(HTTP ${res.status})${upstream ? `:${upstream}` : ""}`, res.status);
}
async function gh(path, opts = {}) {
  const r = await ghRequest(path, opts);
  return r.json;
}
async function ghList(path, opts = {}) {
  const r = await ghRequest(path, opts);
  return { data: r.json, nextUrl: parseLinkNext(r.link) };
}
async function getRepoMeta(ref) {
  const r = await gh(`/repos/${ghRefKey(ref)}`);
  return {
    fullName: r.full_name,
    description: r.description,
    defaultBranch: r.default_branch,
    isPrivate: r.private,
    stars: r.stargazers_count,
    htmlUrl: r.html_url
  };
}
async function getBranches(ref) {
  const arr = await gh(`/repos/${ghRefKey(ref)}/branches${qs({ per_page: 50 })}`);
  return arr.map((b) => ({ name: b.name }));
}
async function getTree(ref, branch) {
  const r = await gh(`/repos/${ghRefKey(ref)}/git/trees/${encodeURIComponent(branch)}?recursive=1`);
  return { items: r.tree.filter((t) => t.type === "blob" || t.type === "tree"), truncated: r.truncated };
}
var MAX_INLINE = 9e5;
var MAX_LINES = 3e3;
async function getFileContent(ref, path, branch) {
  const raw = await gh(
    `/repos/${ghRefKey(ref)}/contents/${path.split("/").map(encodeURIComponent).join("/")}${qs({ ref: branch })}`
  );
  if (raw.size > MAX_INLINE || raw.encoding !== "base64" || typeof raw.content !== "string") {
    return { kind: raw.size > MAX_INLINE ? "too-big" : "binary", size: raw.size, htmlUrl: raw.html_url };
  }
  const full = decodeBase64Utf8(raw.content);
  const lines = full.split("\n");
  return {
    kind: "text",
    size: raw.size,
    htmlUrl: raw.html_url,
    text: lines.length > MAX_LINES ? lines.slice(0, MAX_LINES).join("\n") : full,
    truncatedLines: lines.length > MAX_LINES
  };
}
var PAGE = 30;
function searchQ(parts) {
  return parts.filter(Boolean).join(" ");
}
function searchIssueToGh(it) {
  return {
    number: it.number,
    title: it.title,
    state: it.state,
    html_url: it.html_url,
    user: it.user,
    created_at: it.created_at,
    updated_at: it.updated_at,
    closed_at: it.closed_at,
    comments: it.comments ?? 0,
    labels: it.labels ?? [],
    body: it.body,
    pull_request: it.pull_request
  };
}
function searchIssueToPull(it) {
  const pr = it.pull_request;
  return {
    number: it.number,
    title: it.title,
    state: it.state,
    html_url: it.html_url.replace("/issues/", "/pull/"),
    draft: it.draft === true,
    user: it.user,
    created_at: it.created_at,
    updated_at: it.updated_at,
    head: { ref: "", label: "", sha: "" },
    base: { ref: "", label: "" },
    body: it.body,
    merged_at: pr && typeof pr === "object" && pr !== null && "merged_at" in pr ? pr.merged_at ?? null : null
  };
}
function pageFromUrl(url, fallback = 1) {
  if (!url) return fallback;
  try {
    const n = Number(new URL(url, API).searchParams.get("page") ?? String(fallback));
    return Number.isFinite(n) && n > 0 ? n : fallback;
  } catch {
    return fallback;
  }
}
async function searchPage(q, sort, pageUrl) {
  const pageNum = pageFromUrl(pageUrl, 1);
  const path = `/search/issues${qs({ q, sort, order: "desc", per_page: PAGE, page: pageNum })}`;
  const { data } = await ghList(path);
  const items = data.items ?? [];
  const total = data.total_count ?? 0;
  const cap = Math.min(total, 1e3);
  const nextUrl = items.length > 0 && pageNum * PAGE < cap ? `/search/issues${qs({ q, sort, order: "desc", per_page: PAGE, page: pageNum + 1 })}` : null;
  return { items, nextUrl, totalCount: total };
}
async function listIssues(ref, state = "open", sort = "created", pageUrl) {
  const q = searchQ([`repo:${ghRefKey(ref)}`, "is:issue", `is:${state}`]);
  const page = await searchPage(q, sort, pageUrl);
  return { items: page.items.map(searchIssueToGh), nextUrl: page.nextUrl, totalCount: page.totalCount };
}
async function getIssue(ref, n) {
  return gh(`/repos/${ghRefKey(ref)}/issues/${n}`);
}
async function listComments(ref, n, pageUrl) {
  const pageNum = pageFromUrl(pageUrl, 1);
  const path = `/repos/${ghRefKey(ref)}/issues/${n}/comments${qs({ per_page: 60, page: pageNum })}`;
  const { data, nextUrl } = await ghList(path);
  const computed = data.length >= 60 ? `/repos/${ghRefKey(ref)}/issues/${n}/comments${qs({ per_page: 60, page: pageNum + 1 })}` : null;
  return { items: data, nextUrl: data.length === 0 ? null : nextUrl ?? computed, totalCount: null };
}
async function listPulls(ref, filter = "open", sort = "created", pageUrl) {
  const extra = filter === "merged" ? "is:merged" : filter === "closed" ? "is:closed is:unmerged" : "is:open";
  const q = searchQ([`repo:${ghRefKey(ref)}`, "is:pr", extra]);
  const page = await searchPage(q, sort, pageUrl);
  return { items: page.items.map(searchIssueToPull), nextUrl: page.nextUrl, totalCount: page.totalCount };
}
async function getPull(ref, n) {
  return gh(`/repos/${ghRefKey(ref)}/pulls/${n}`);
}
async function listCheckRuns(ref, sha) {
  const r = await gh(`/repos/${ghRefKey(ref)}/commits/${sha}/check-runs?per_page=50`);
  return r.check_runs;
}
async function listRuns(ref) {
  const r = await gh(`/repos/${ghRefKey(ref)}/actions/runs?per_page=20`);
  return r.workflow_runs;
}
var repoCache = null;
var REPO_CACHE_TTL = 5 * 6e4;
var REPO_PAGE_CAP = 3;
var REPO_HARD_CAP = 300;
async function getMyRepos(force = false) {
  if (!force && repoCache && Date.now() - repoCache.at < REPO_CACHE_TTL) return repoCache.data;
  const data = [];
  let path = "/user/repos?per_page=100&sort=pushed&affiliation=owner,collaborator,organization_member";
  let pages = 0;
  let truncated = false;
  while (path && pages < REPO_PAGE_CAP) {
    const page = await ghList(path);
    pages += 1;
    for (const r of page.data) {
      if (r.archived) continue;
      data.push({
        fullName: r.full_name,
        isPrivate: r.private,
        pushedAt: r.pushed_at,
        description: r.description,
        ownerLogin: r.owner?.login ?? ""
      });
    }
    path = page.nextUrl;
    if (path && pages >= REPO_PAGE_CAP) truncated = true;
  }
  data.sort((a, b) => b.pushedAt.localeCompare(a.pushedAt));
  if (data.length > REPO_HARD_CAP) {
    data.length = REPO_HARD_CAP;
    truncated = true;
  }
  repoCache = { at: Date.now(), data, truncated };
  return data;
}
function myReposTruncated() {
  return repoCache?.truncated ?? false;
}
var searchSeq = 0;
async function searchPublicRepos(q) {
  const seq = ++searchSeq;
  const r = await gh(
    `/search/repositories${qs({ q: `${q} in:name`, per_page: 8, sort: "stars" })}`
  );
  if (seq !== searchSeq) return [];
  return r.items.map((i) => ({ fullName: i.full_name, stars: i.stargazers_count, description: i.description }));
}
var INBOX_SEARCH_MAX_Q = 6;
function inboxSearchPrefix(createdSinceIso, viewer) {
  const iso = createdSinceIso.replace(/\.\d{3}Z$/, "Z");
  const parts = ["is:public", "is:open", `created:>=${iso}`];
  if (viewer) parts.push(`-author:${viewer}`);
  return parts;
}
async function searchInboxCreatedSince(repos, createdSinceIso, viewer) {
  const prefix = inboxSearchPrefix(createdSinceIso, viewer);
  const leftover = new Set(repos.filter(Boolean));
  const queries = [];
  if (viewer) {
    queries.push(searchQ([...prefix, `user:${viewer}`]));
    for (const r of leftover) {
      if (r.startsWith(`${viewer}/`)) leftover.delete(r);
    }
  }
  const otherOwners = /* @__PURE__ */ new Map();
  for (const r of leftover) {
    const owner = r.split("/")[0] ?? "";
    const list = otherOwners.get(owner) ?? [];
    list.push(r);
    otherOwners.set(owner, list);
  }
  const orgOwners = [...otherOwners.entries()].filter(([, list]) => list.length >= 2).map(([owner]) => owner);
  for (const org of orgOwners) {
    if (queries.length >= INBOX_SEARCH_MAX_Q) break;
    queries.push(searchQ([...prefix, `org:${org}`]));
    for (const r of otherOwners.get(org) ?? []) leftover.delete(r);
  }
  for (const chunk of chunkRepoQualifiers([...leftover], 220)) {
    if (queries.length >= INBOX_SEARCH_MAX_Q) break;
    const orPart = chunk.map((n) => `repo:${n}`).join(" OR ");
    queries.push(searchQ([...prefix, `(${orPart})`]));
    for (const n of chunk) leftover.delete(n);
  }
  const hits = [];
  const seen = /* @__PURE__ */ new Set();
  for (const q of queries) {
    const page = await searchPage(q, "created");
    for (const it of page.items) {
      if (it.created_at < createdSinceIso) continue;
      const parsed = parseGithubUrl(it.html_url);
      if (!parsed) continue;
      const kind = it.pull_request ? "pr" : "issue";
      const key = `${kind}:${parsed.ref.owner}/${parsed.ref.repo}#${it.number}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const htmlUrl = kind === "pr" ? it.html_url.replace("/issues/", "/pull/") : it.html_url;
      hits.push({
        kind,
        owner: parsed.ref.owner,
        repo: parsed.ref.repo,
        number: it.number,
        title: it.title,
        htmlUrl,
        user: it.user?.login ?? "ghost",
        createdAt: it.created_at
      });
    }
  }
  return { hits, queryTruncated: leftover.size > 0 };
}
async function listRunsCreatedSince(ref, sinceIso) {
  const arr = await listRuns(ref);
  return arr.filter((r) => r.created_at >= sinceIso);
}
async function createIssue(ref, title, body) {
  return gh(`/repos/${ghRefKey(ref)}/issues`, { method: "POST", body: { title, body } });
}
async function patchIssue(ref, n, patch) {
  await gh(`/repos/${ghRefKey(ref)}/issues/${n}`, { method: "PATCH", body: patch });
}
async function addComment(ref, n, body) {
  await gh(`/repos/${ghRefKey(ref)}/issues/${n}/comments`, { method: "POST", body: { body } });
}
async function editComment(ref, commentId, body) {
  await gh(`/repos/${ghRefKey(ref)}/issues/comments/${commentId}`, { method: "PATCH", body: { body } });
}
async function deleteComment(ref, commentId) {
  await gh(`/repos/${ghRefKey(ref)}/issues/comments/${commentId}`, { method: "DELETE" });
}
async function createPull(ref, p) {
  return gh(`/repos/${ghRefKey(ref)}/pulls`, { method: "POST", body: p });
}
async function mergePull(ref, n, method) {
  await gh(`/repos/${ghRefKey(ref)}/pulls/${n}/merge`, { method: "PUT", body: { merge_method: method } });
}
async function rerunRun(ref, runId) {
  await gh(`/repos/${ghRefKey(ref)}/actions/runs/${runId}/rerun`, { method: "POST" });
}
async function cancelRun(ref, runId) {
  await gh(`/repos/${ghRefKey(ref)}/actions/runs/${runId}/cancel`, { method: "POST" });
}
var viewerCache;
async function getViewerLogin() {
  if (viewerCache !== void 0) return viewerCache;
  try {
    const u = await gh("/user");
    viewerCache = u.login;
  } catch {
    viewerCache = null;
  }
  return viewerCache;
}

// src/config.ts
var K = {
  token: "gw.token",
  repo: "gw.repo",
  branch: "gw.branch",
  autoSec: "gw.autoSec",
  recent: "gw.recent",
  subtab: "gw.subtab",
  panelWidth: "gw.panelWidth"
};
function lsGet(key) {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}
function lsSet(key, value) {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
  }
}
function loadToken() {
  return lsGet(K.token);
}
function saveToken(t) {
  lsSet(K.token, t);
}
function loadRepo() {
  return lsGet(K.repo);
}
function saveRepo(fullName) {
  lsSet(K.repo, fullName);
}
function loadBranch() {
  return lsGet(K.branch);
}
function saveBranch(b) {
  lsSet(K.branch, b);
}
var HIDDEN_KEY = "gw.hiddenRepos";
function loadHiddenRepos() {
  try {
    const arr = JSON.parse(lsGet(HIDDEN_KEY));
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}
function saveHidden(list) {
  lsSet(HIDDEN_KEY, JSON.stringify(list.slice(0, 300)));
}
function hideRepo(fullName) {
  saveHidden([fullName, ...loadHiddenRepos().filter((x) => x !== fullName)]);
}
function unhideRepo(fullName) {
  saveHidden(loadHiddenRepos().filter((x) => x !== fullName));
}
var FONT_KEY = "gw.fontSize";
function loadFontSize() {
  const v = lsGet(FONT_KEY);
  return v === "13" || v === "14" ? v : "dsh";
}
function saveFontSize(v) {
  lsSet(FONT_KEY, v === "dsh" ? "" : v);
}
function loadSubtab() {
  return lsGet(K.subtab);
}
function saveSubtab(s) {
  lsSet(K.subtab, s);
}
function loadAutoRefreshSec() {
  const n = Number(lsGet(K.autoSec));
  return Number.isFinite(n) && n > 0 ? clamp(Math.round(n), 0, 120) : 0;
}
function saveAutoRefreshSec(sec) {
  lsSet(K.autoSec, String(clamp(Math.round(sec), 0, 120)));
}
function loadRecentRepos() {
  try {
    const arr = JSON.parse(lsGet(K.recent));
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string").slice(0, 5) : [];
  } catch {
    return [];
  }
}
function pushRecentRepo(fullName) {
  const next = [fullName, ...loadRecentRepos().filter((r) => r !== fullName)].slice(0, 5);
  try {
    lsSet(K.recent, JSON.stringify(next));
  } catch {
  }
  return next;
}
function removeRecentRepo(fullName) {
  const next = loadRecentRepos().filter((x) => x !== fullName);
  lsSet(K.recent, JSON.stringify(next));
  return next;
}
function loadPanelWidth() {
  const n = Number(lsGet(K.panelWidth));
  return Number.isFinite(n) && n >= 320 ? clamp(n, 320, 720) : 470;
}
function savePanelWidth(w) {
  lsSet(K.panelWidth, String(clamp(Math.round(w), 320, 720)));
}
function absorbHostToken(ctx) {
  let svc;
  try {
    svc = ctx.betterSidebar;
  } catch {
    svc = void 0;
  }
  try {
    const blob = svc?.getSnapshot?.().prefs?.pluginSettings?.["github-workbench:repo"];
    const hostToken = typeof blob?.token === "string" ? blob.token : "";
    if (hostToken && !loadToken()) saveToken(hostToken);
    const hostAuto = typeof blob?.autoRefreshSec === "number" ? blob.autoRefreshSec : -1;
    if (hostAuto >= 0 && !lsGet(K.autoSec)) saveAutoRefreshSec(hostAuto);
  } catch {
  }
}
async function detectWorkspaceRepo(sessionId) {
  for (const path of [".git/config", "../.git/config"]) {
    try {
      const res = await fetch("/sidebar/api/fs.read", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId, path })
      });
      const json = await res.json().catch(() => null);
      const v = json?.value;
      const text = typeof v === "string" ? v : v?.kind === "text" ? v.content ?? "" : "";
      if (!text) continue;
      const ref = parseGithubRemote(text);
      if (ref) return ref;
    } catch {
    }
  }
  return null;
}

// src/styles.ts
var GW_CSS = `
.gw-root{position:relative;width:100%;height:100%;min-height:0;display:flex;flex-direction:column;min-width:280px;
  /* \u900F\u660E\u6839:\u5B98\u65B9\u9762\u677F/better-sidebar \u9875\u7B7E/\u72EC\u7ACB\u9762\u677F\u5404\u81EA\u63D0\u4F9B\u5E95\u8272,
     \u7EC4\u4EF6\u4E0D\u518D\u81EA\u5237\u80CC\u666F(\u907F\u514D\u906E\u4F4F\u5BBF\u4E3B 0.1.5 \u65B0\u8C03\u8272\u677F)\u3002 */
  background:transparent;color:var(--dsw-alias-label-primary);
  font-size:var(--gw-body-size, 12px);line-height:1.5;
  container-type:inline-size}
.gw-root *,.gw-root *::before,.gw-root *::after{box-sizing:border-box}
.gw-icon{display:block;flex:none}

/* ---------- \u5934\u90E8 ---------- */
.gw-header{display:flex;align-items:center;gap:8px;padding:9px 12px;border-bottom:1px solid var(--dsw-alias-border-l2);position:relative}
.gw-repo-btn{appearance:none;background:none;border:none;color:inherit;font:inherit;font-weight:600;
  display:flex;align-items:center;gap:5px;cursor:pointer;padding:3px 6px;border-radius:6px;min-width:0}
.gw-repo-btn:hover{background:var(--dsw-alias-interactive-bg-hover)}
.gw-repo-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}
.gw-chip{font-size:10px;padding:1px 7px;border-radius:999px;border:1px solid var(--dsw-alias-border-l1);
  color:var(--dsw-alias-label-secondary);flex:none;display:inline-flex;align-items:center;gap:4px}
.gw-select{margin-left:auto;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);
  border:1px solid var(--dsw-alias-border-l1);border-radius:6px;padding:2px 20px 2px 7px;
  font-size:11px;max-width:150px;appearance:none;-webkit-appearance:none;outline:none;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path fill='%23888f9c' d='M12.78 5.22a.749.749 0 00-1.06 0L8 9.44 4.28 5.72a.749.749 0 10-1.06 1.06l4.25 4.25c.146.147.338.22.53.22s.384-.072.53-.22l4.25-4.25a.749.749 0 000-1.06z'/></svg>");
  background-repeat:no-repeat;background-position:right 5px center;background-size:10px}
.gw-hbtn{width:26px;height:26px;border:none;background:none;color:var(--dsw-alias-label-secondary);
  border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex:none;padding:0;position:relative}
.gw-hbtn:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.gw-dot{width:8px;height:8px;border-radius:50%;flex:none;background:var(--dsw-alias-label-tertiary)}
.gw-dot.ok{background:var(--dsw-alias-state-success-primary)}
.gw-dot.bad{background:var(--dsw-alias-state-danger-primary)}
.gw-hbtn .gw-inbox-badge{position:absolute;top:-2px;right:-2px;min-width:14px;height:14px;padding:0 3px;
  border-radius:999px;font-size:9px;line-height:14px;text-align:center;
  background:var(--dsw-alias-state-danger-primary);color:var(--dsw-alias-bg-layer-1);font-weight:600}
.gw-hbtn.has-unread{color:var(--dsw-alias-state-danger-primary)}

/* ---------- \u5F39\u5C42(\u4ED3\u5E93\u5207\u6362 / \u8BBE\u7F6E)---------- */
.gw-pop{position:absolute;top:calc(100% + 4px);z-index:40;width:min(320px,calc(100vw - 24px));
  background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:10px;
  box-shadow:0 10px 32px rgba(0,0,0,.35);padding:8px}
.gw-pop.left{left:10px}.gw-pop.right{right:10px}
.gw-pop-title{font-size:10px;color:var(--dsw-alias-label-tertiary);padding:2px 6px 6px}
.gw-pop-item{display:flex;align-items:center;gap:8px;width:100%;text-align:left;appearance:none;background:none;
  border:none;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;padding:6px;border-radius:6px;
  cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.gw-pop-item:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.gw-pop-item.cur{color:var(--dsw-alias-label-primary)}
.gw-pop-item.cur .gw-dot{background:var(--dsw-alias-state-success-primary)}
.gw-pop-cur{margin-left:auto;font-size:9px;color:var(--dsw-alias-accent-primary);
  border:1px solid var(--dsw-alias-accent-primary);padding:0 5px;border-radius:999px;flex:none}
.gw-x{display:none;margin-left:6px;flex:none;cursor:pointer;color:var(--dsw-alias-label-tertiary);
  border:1px solid var(--dsw-alias-border-l1);border-radius:5px;padding:2px;line-height:0}
.gw-x:hover{color:var(--dsw-alias-state-danger-primary);border-color:var(--dsw-alias-state-danger-primary)}
.gw-pop-item:hover .gw-x{display:inline-flex}
.gw-pop-divider{height:1px;background:var(--dsw-alias-border-l1);margin:6px 2px}
.gw-input{width:100%;min-width:0;background:var(--dsw-alias-bg-base,#111);border:1px solid var(--dsw-alias-border-l1);
  border-radius:6px;color:var(--dsw-alias-label-primary);padding:5px 8px;font-size:11px;outline:none;font-family:inherit}
.gw-input:focus{border-color:var(--dsw-alias-accent-primary)}
.gw-pop-hint{font-size:10px;color:var(--dsw-alias-label-tertiary);padding:6px 4px 2px;line-height:1.55}
.gw-formrow{display:flex;gap:6px;padding:2px}
.gw-field{display:flex;flex-direction:column;gap:3px;padding:4px 2px}
.gw-field>label{font-size:10px;color:var(--dsw-alias-label-secondary)}

/* ---------- \u5B50\u9875\u7B7E ---------- */
.gw-tabs{display:flex;border-bottom:1px solid var(--dsw-alias-border-l2);padding:0 8px;overflow-x:auto}
.gw-tab{appearance:none;background:none;border:none;color:var(--dsw-alias-label-secondary);cursor:pointer;
  font-size:11px;font-family:inherit;padding:8px 10px;border-bottom:2px solid transparent;
  display:flex;gap:5px;align-items:center;white-space:nowrap}
.gw-tab:hover{color:var(--dsw-alias-label-primary)}
.gw-tab.on{color:var(--dsw-alias-label-primary);border-bottom-color:var(--dsw-alias-accent-primary)}
.gw-count{background:var(--dsw-alias-interactive-bg-active);border-radius:999px;padding:0 6px;font-size:10px;line-height:16px}

/* ---------- \u4E3B\u4F53 / \u9875\u811A ---------- */
.gw-body{flex:1;min-height:0;position:relative;display:flex}
.gw-inbox{position:absolute;inset:0;z-index:28;background:var(--dsw-alias-bg-layer-1);display:flex;flex-direction:column;min-height:0}
.gw-inbox .gw-list{flex:1}
.gw-inbox-bar{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 12px;
  border-bottom:1px solid var(--dsw-alias-border-l2);flex:none;flex-wrap:wrap}
.gw-inbox-return{display:flex;align-items:center;gap:8px;padding:5px 12px;
  border-bottom:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);flex:none}
.gw-inbox-dot{width:8px;height:8px;border-radius:50%;flex:none;margin-top:5px;background:transparent;border:1px solid var(--dsw-alias-border-l1)}
.gw-inbox-dot.on{background:var(--dsw-alias-state-danger-primary);border-color:var(--dsw-alias-state-danger-primary)}
.gw-row.gw-inbox-unread .gw-rowtitle{font-weight:600}
.gw-footer{display:flex;justify-content:space-between;gap:12px;padding:5px 12px;
  border-top:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-tertiary);font-size:10px}

/* ---------- \u6309\u94AE ---------- */
.gw-btn{appearance:none;display:inline-flex;align-items:center;gap:5px;border:1px solid var(--dsw-alias-border-l1);
  background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);border-radius:6px;
  padding:3px 10px;font-size:11px;font-family:inherit;cursor:pointer;white-space:nowrap}
.gw-btn:hover{background:var(--dsw-alias-interactive-bg-hover)}
.gw-btn.primary{background:transparent;border-color:var(--dsw-alias-accent-primary);color:var(--dsw-alias-accent-primary)}
.gw-btn.primary:hover{background:var(--dsw-alias-interactive-bg-hover)}
.gw-btn.danger{border-color:var(--dsw-alias-state-danger-primary);color:var(--dsw-alias-state-danger-primary)}
.gw-btn:disabled{opacity:.45;cursor:not-allowed}
.gw-btn.backbtn{margin-bottom:6px}
.gw-link{color:var(--dsw-alias-accent-primary);text-decoration:none}
.gw-link:hover{text-decoration:underline}

/* ---------- \u5217\u8868(Code \u5916\u4E09\u9875\u7B7E\u5171\u7528)---------- */
.gw-colpane{flex-direction:column}
.gw-toolbar{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 12px;
  border-bottom:1px solid var(--dsw-alias-border-l2);flex:none;flex-wrap:wrap}
.gw-open-count{color:var(--dsw-alias-label-tertiary);font-size:11px}
.gw-list{flex:1;min-height:0;overflow:auto}
.gw-more{display:flex;justify-content:center;padding:10px 12px 14px}
.gw-row{display:flex;gap:9px;padding:9px 12px;border-bottom:1px solid var(--dsw-alias-border-l2);
  cursor:pointer;align-items:flex-start;width:100%;text-align:left;background:none;border-left:none;border-right:none;border-top:none;font-family:inherit;color:inherit;font-size:inherit}
.gw-row:hover{background:var(--dsw-alias-interactive-bg-hover)}
.gw-stateic{flex:none;margin-top:1px}
.gw-rowmain{flex:1;min-width:0}
.gw-rowtitle{font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gw-rowsub{color:var(--dsw-alias-label-secondary);font-size:11px;margin-top:2px;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:flex;align-items:center;gap:6px}
.gw-meta{flex:none;text-align:right;color:var(--dsw-alias-label-tertiary);font-size:11px}
.gw-created{display:none;margin-left:10px}
.gw-label-chip{display:inline-block;font-size:10px;padding:0 7px;border-radius:999px;line-height:17px;margin-right:4px}
.gw-branch-chip{background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);
  border-radius:5px;padding:0 5px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px}
.gw-diffstat-add{color:var(--dsw-alias-state-success-primary)}
.gw-diffstat-del{color:var(--dsw-alias-state-danger-primary)}
.gw-checkdot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:5px;vertical-align:baseline}
.gw-hoverbar{display:none;gap:6px;margin-top:6px;flex-wrap:wrap}
.gw-row:hover .gw-hoverbar{display:flex}

/* ---------- Code \u53CC\u680F ---------- */
.gw-codepane{flex:1;min-height:0;display:flex}
.gw-tree{width:190px;flex:none;border-right:1px solid var(--dsw-alias-border-l2);overflow:auto;padding:6px 4px}
.gw-tree-item{display:flex;align-items:center;gap:4px;padding:2px 6px;border-radius:5px;cursor:pointer;
  color:var(--dsw-alias-label-secondary);white-space:nowrap;overflow:hidden;font-size:12px;
  appearance:none;-webkit-appearance:none;background:none;border:none;font-family:inherit;
  text-align:left;width:100%;min-width:0}
.gw-tree-item:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.gw-tree-item.sel{color:var(--dsw-alias-accent-primary);background:var(--dsw-alias-interactive-bg-active)}
.gw-tree-name{overflow:hidden;text-overflow:ellipsis}
.gw-filepane{flex:1;min-width:0;display:flex;flex-direction:column}
.gw-crumb{padding:7px 12px;color:var(--dsw-alias-label-secondary);border-bottom:1px solid var(--dsw-alias-border-l2);
  font-size:11px;display:flex;gap:8px;align-items:center;min-width:0}
.gw-crumb-path{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
.gw-crumb-path b{color:var(--dsw-alias-label-primary);font-weight:600}
.gw-code{flex:1;min-height:0;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
  font-size:11px;line-height:1.55;padding:8px 0}
.gw-ln{display:flex;min-width:max-content}
.gw-ln:hover{background:var(--dsw-alias-interactive-bg-hover)}
.gw-no{width:38px;flex:none;text-align:right;padding-right:10px;color:var(--dsw-alias-label-tertiary);user-select:none}

/* ---------- \u8BE6\u60C5\u62BD\u5C49 ---------- */
.gw-detail{position:absolute;inset:0;z-index:30;background:var(--dsw-alias-bg-layer-1);display:flex;flex-direction:column}
.gw-detail-head{padding:10px 14px;border-bottom:1px solid var(--dsw-alias-border-l2);flex:none}
.gw-detail-body{flex:1;min-height:0;overflow:auto;padding:12px 14px;color:var(--dsw-alias-label-secondary);
  line-height:1.65;white-space:pre-wrap;word-break:break-word}
.gw-comment{border-top:1px dashed var(--dsw-alias-border-l2);padding-top:10px;margin-top:10px}
.gw-comment-head{display:flex;align-items:center;gap:8px;color:var(--dsw-alias-label-tertiary);font-size:11px;margin-bottom:6px}
.gw-composer{border-top:1px solid var(--dsw-alias-border-l2);padding:8px 14px;display:flex;flex-direction:column;gap:6px;flex:none}
.gw-textarea{resize:vertical;min-height:52px;max-height:200px;font-family:inherit}
.gw-composer-row{display:flex;gap:8px;align-items:center}

/* ---------- \u53CD\u9988:\u786E\u8BA4\u6C14\u6CE1 / toast / \u7A7A / \u9519\u8BEF / \u52A0\u8F7D ---------- */
.gw-scrim{position:absolute;inset:0;z-index:60;background:rgba(0,0,0,.42);display:flex;align-items:center;justify-content:center;padding:20px}
.gw-dialog{width:min(360px,100%);background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);
  border-radius:12px;padding:14px;box-shadow:0 16px 44px rgba(0,0,0,.45)}
.gw-dialog h4{margin:0 0 8px;font-size:13px;color:var(--dsw-alias-label-primary)}
.gw-dialog p{margin:0 0 12px;font-size:12px;color:var(--dsw-alias-label-secondary);line-height:1.6;white-space:pre-wrap}
.gw-dialog-actions{display:flex;gap:8px;justify-content:flex-end}
.gw-toasts{position:absolute;left:12px;right:12px;bottom:34px;z-index:70;display:flex;flex-direction:column;gap:6px;pointer-events:none}
.gw-toast{padding:7px 12px;border-radius:8px;font-size:12px;border:1px solid var(--dsw-alias-border-l1);
  background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.gw-toast.err{border-color:var(--dsw-alias-state-danger-primary);color:var(--dsw-alias-state-danger-primary)}
.gw-toast.ok{border-color:var(--dsw-alias-state-success-primary)}
.gw-empty{flex:1;display:flex;align-items:center;justify-content:center;color:var(--dsw-alias-label-tertiary);
  padding:28px;text-align:center;line-height:1.8}
.gw-errbox{margin:12px;padding:10px 12px;border:1px solid var(--dsw-alias-state-danger-primary);
  border-radius:8px;color:var(--dsw-alias-state-danger-primary);font-size:12px;line-height:1.6;white-space:pre-wrap}
.gw-spin{animation:gw-spin 1s linear infinite}
@keyframes gw-spin{to{transform:rotate(360deg)}}
.gw-muted{color:var(--dsw-alias-label-tertiary)}

/* ---------- \u7A84\u5C4F\u7D27\u51D1\u6863(<600px):\u6811\u53D8\u8986\u76D6\u62BD\u5C49\u3001\u5934\u90E8\u6362\u884C ---------- */
.gw-codepane{position:relative}
/* \u62BD\u5C49\u5F00\u5173(CodeView \u5C42\u60AC\u6D6E,\u5BBD\u5C4F\u9690\u85CF);treeOpen \u65F6\u53D8\u4E3A\u5173\u95ED\u94AE */
.gw-tree-fab{display:none;position:absolute;top:8px;left:8px;z-index:26}
@container (max-width:599px){
  .gw-header{flex-wrap:wrap;row-gap:6px;padding-right:10px}
  .gw-select{margin-left:0;max-width:104px}
  .gw-tabs{padding:0 4px}
  .gw-tab{padding:8px 9px}
  .gw-codepane.tree-open .gw-tree-fab{left:auto;right:8px} /* \u62BD\u5C49\u5F00\u7740 \u21D2 \u53D8\u6210\u53F3\u4E0A\u89D2\u5173\u95ED\u4F4D */
  .gw-tree-fab{display:inline-flex}
  .gw-codepane:not(.tree-open) .gw-tree{display:none;width:auto;position:absolute;inset:0;z-index:25;
    background:var(--dsw-alias-bg-layer-1);border-right:none}
  .gw-rowtitle{white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;line-height:1.35}
  .gw-rowsub{white-space:normal;flex-wrap:wrap}
  .gw-composer-row{flex-wrap:wrap}
  .gw-crumb{flex-wrap:wrap}
}

/* ---------- \u5BB9\u5668\u67E5\u8BE2\u4E09\u6863(<720 \u9ED8\u8BA4\u7D27\u51D1 / \u2265720 / \u22651000)---------- */
@container (min-width:720px){
  .gw-tree{width:240px}
  .gw-header,.gw-toolbar{padding-left:16px;padding-right:16px}
  .gw-tab{padding:9px 14px;font-size:12px}
  .gw-row{padding:11px 16px}
}
@container (min-width:1000px){
  .gw-tree{width:290px}
  .gw-header{padding:12px 18px}
  .gw-rowsub{font-size:12px}
  .gw-code{font-size:12px;line-height:1.6}
  .gw-created{display:inline}
  .gw-pane-wrap>.gw-detail{inset:14px;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;
    box-shadow:0 14px 40px rgba(0,0,0,.4)}
}
`;
var injected = false;
function ensureStyles() {
  if (injected && typeof document !== "undefined" && document.getElementById("github-workbench-styles")) return;
  if (typeof document === "undefined") return;
  const el = document.createElement("style");
  el.id = "github-workbench-styles";
  el.textContent = GW_CSS;
  document.head.appendChild(el);
  injected = true;
}

// src/code-view.tsx
var import_react2 = require("react");

// src/ui.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function Loading(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "gw-empty", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { display: "inline-flex", alignItems: "center", gap: 8 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gw-spin", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GwIcon, { name: "loader" }) }),
    props.label ?? "\u52A0\u8F7D\u4E2D\u2026"
  ] }) });
}
function ErrorBox(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "gw-errbox", children: [
    props.msg,
    props.onRetry && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginTop: 8 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "gw-btn", onClick: props.onRetry, children: "\u91CD\u8BD5" }) })
  ] });
}
function Empty(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "gw-empty", children: props.children });
}

// src/code-view.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function CodeView({ ghRef, branch }) {
  const [items, setItems] = (0, import_react2.useState)(null);
  const [truncated, setTruncated] = (0, import_react2.useState)(false);
  const [error, setError] = (0, import_react2.useState)(null);
  const [expanded, setExpanded] = (0, import_react2.useState)(/* @__PURE__ */ new Set());
  const [selected, setSelected] = (0, import_react2.useState)(null);
  const [treeOpen, setTreeOpen] = (0, import_react2.useState)(false);
  (0, import_react2.useEffect)(() => {
    let dead = false;
    setItems(null);
    setError(null);
    setSelected(null);
    setTruncated(false);
    getTree(ghRef, branch).then((r) => {
      if (dead) return;
      setItems(r.items);
      setTruncated(r.truncated);
      const first = /* @__PURE__ */ new Set();
      for (const it of r.items) {
        const top = it.path.split("/")[0];
        if (it.type === "tree" && it.path === top) first.add(top);
      }
      setExpanded(first);
    }).catch((e) => {
      if (!dead) setError(errText(e));
    });
    return () => {
      dead = true;
    };
  }, [ghRef.owner, ghRef.repo, branch]);
  if (error) return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ErrorBox, { msg: error, onRetry: () => setReloadSelf() });
  if (!items) return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Loading, { label: "\u62C9\u53D6\u76EE\u5F55\u6811\u2026" });
  const nodes = buildTree(items);
  function setReloadSelf() {
    setSelected(null);
    setItems(null);
    getTree(ghRef, branch).then((r) => {
      setItems(r.items);
      setTruncated(r.truncated);
    }).catch((e) => setError(errText(e)));
  }
  const toggle = (path) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "gw-codepane" + (treeOpen ? " tree-open" : ""), children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
      "button",
      {
        className: "gw-btn gw-tree-fab",
        title: treeOpen ? "\u5173\u95ED\u76EE\u5F55" : "\u76EE\u5F55",
        onClick: () => setTreeOpen((v) => !v),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(GwIcon, { name: treeOpen ? "x-circle" : "folder", size: 12 }),
          treeOpen ? "\u6536\u8D77" : "\u76EE\u5F55"
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "gw-tree", children: [
      truncated && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "gw-pop-hint", style: { padding: "2px 6px 8px" }, children: "\u76EE\u5F55\u8FC7\u5927\u88AB GitHub \u622A\u65AD,\u4EC5\u663E\u793A\u90E8\u5206\u6761\u76EE\u3002" }),
      nodes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        TreeRow,
        {
          node: n,
          depth: 0,
          expanded,
          selected,
          onToggle: toggle,
          onSelect: (path) => {
            setSelected(path);
            setTreeOpen(false);
          }
        },
        n.path
      )),
      nodes.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "gw-empty", children: "\u7A7A\u4ED3\u5E93 / \u7A7A\u5206\u652F" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "gw-filepane", children: selected ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      FilePane,
      {
        ghRef,
        path: selected,
        branch,
        onClose: () => setSelected(null)
      },
      `${ghRefKey(ghRef)}@${branch}:${selected}`
    ) : /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "gw-empty", children: [
      "\u4ECE\u5DE6\u4FA7\u9009\u62E9\u6587\u4EF6\u9884\u89C8",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("br", {}),
      "\u4E8C\u8FDB\u5236 / \u8D85\u5927\u6587\u4EF6\u4F1A\u7ED9\u51FA\u4E0B\u8F7D\u4E0E GitHub \u5916\u94FE"
    ] }) })
  ] });
}
function TreeRow(props) {
  const { node, depth } = props;
  const isOpen = props.expanded.has(node.path);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
      "button",
      {
        className: `gw-tree-item ${props.selected === node.path ? "sel" : ""}`,
        style: { paddingLeft: 6 + depth * 13 },
        title: node.path,
        onClick: () => node.type === "tree" ? props.onToggle(node.path) : props.onSelect(node.path),
        children: [
          node.type === "tree" ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            GwIcon,
            {
              name: isOpen ? "chevron-down" : "chevron-right",
              size: 11,
              style: { color: "var(--dsw-alias-label-tertiary)" }
            }
          ) : null,
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            GwIcon,
            {
              name: node.type === "tree" ? isOpen ? "folder-open" : "folder" : "file",
              size: 13,
              style: { color: node.type === "tree" ? "var(--dsw-alias-accent-primary)" : "var(--dsw-alias-label-tertiary)" }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "gw-tree-name", children: node.name }),
          node.type === "blob" && node.size !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { marginLeft: "auto", fontSize: 10, color: "var(--dsw-alias-label-tertiary)" }, children: fmtSize(node.size) })
        ]
      }
    ),
    node.type === "tree" && isOpen && node.children?.map((c) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      TreeRow,
      {
        node: c,
        depth: depth + 1,
        expanded: props.expanded,
        selected: props.selected,
        onToggle: props.onToggle,
        onSelect: props.onSelect
      },
      c.path
    ))
  ] });
}
function FilePane(props) {
  const [data, setData] = (0, import_react2.useState)(null);
  const [error, setError] = (0, import_react2.useState)(null);
  (0, import_react2.useEffect)(() => {
    let dead = false;
    setData(null);
    setError(null);
    getFileContent(props.ghRef, props.path, props.branch).then((r) => {
      if (!dead) setData(r);
    }).catch((e) => {
      if (!dead) setError(errText(e));
    });
    return () => {
      dead = true;
    };
  }, [props.ghRef.owner, props.ghRef.repo, props.path, props.branch]);
  const name2 = props.path.split("/").pop() ?? props.path;
  const dir = props.path.includes("/") ? props.path.slice(0, props.path.lastIndexOf("/")) + " / " : "";
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "gw-crumb", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "gw-crumb-path", children: [
        dir,
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("b", { children: name2 })
      ] }),
      data && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "gw-muted", children: fmtSize(data.size) }),
      data && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
        "a",
        {
          className: "gw-link",
          href: data.htmlUrl,
          target: "_blank",
          rel: "noreferrer",
          style: { display: "inline-flex", alignItems: "center", gap: 4, marginLeft: "auto", flex: "none" },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(GwIcon, { name: "external-link", size: 11 }),
            "GitHub"
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "gw-hbtn", title: "\u5173\u95ED", onClick: props.onClose, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(GwIcon, { name: "x-circle", size: 13 }) })
    ] }),
    error && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ErrorBox, { msg: error }),
    !error && !data && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Loading, { label: "\u8BFB\u53D6\u6587\u4EF6\u2026" }),
    data?.kind === "text" && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "gw-code", children: [
      (data.text ?? "").split("\n").map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "gw-ln", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "gw-no", children: i + 1 }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { whiteSpace: "pre" }, children: line || " " })
      ] }, i)),
      data.truncatedLines && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "gw-pop-hint", style: { padding: "6px 12px" }, children: "\u8D85\u8FC7 3000 \u884C,\u5DF2\u622A\u65AD \u2014\u2014 \u5B8C\u6574\u5185\u5BB9\u8BF7\u5230 GitHub \u67E5\u770B\u3002" })
    ] }),
    data && data.kind !== "text" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "gw-empty", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
      data.kind === "too-big" ? "\u6587\u4EF6\u8D85\u8FC7 900KB,\u4E0D\u5728\u4FA7\u8FB9\u680F\u5185\u8054\u6E32\u67D3\u3002" : "\u4E8C\u8FDB\u5236\u6587\u4EF6,\u65E0\u6CD5\u6587\u672C\u9884\u89C8\u3002",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("br", {}),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("a", { className: "gw-link", href: data.htmlUrl, target: "_blank", rel: "noreferrer", children: "\u5728 GitHub \u6253\u5F00 \u2197" })
    ] }) })
  ] });
}

// src/issues-view.tsx
var import_react4 = require("react");

// src/inbox-store.ts
var LS_ITEMS = "gw.inbox.items";
var LS_READ = "gw.inbox.read";
var LS_WATER = "gw.inbox.watermark";
var MAX_ITEMS = 100;
var MAX_READ = 500;
var WEEK_MS = 7 * 24 * 60 * 6e4;
var VISIBLE_MS = 15e3;
var HIDDEN_MS = 45e3;
var BACKOFF_MS = 6e4;
function hitToItem(hit, unread) {
  return {
    key: inboxItemKey(hit.kind, hit.owner, hit.repo, hit.number),
    kind: hit.kind,
    owner: hit.owner,
    repo: hit.repo,
    number: hit.number,
    title: hit.title,
    htmlUrl: hit.htmlUrl,
    user: hit.user,
    createdAt: hit.createdAt,
    unread
  };
}
function runToItem(owner, repo, run, unread) {
  return {
    key: inboxItemKey("actions", owner, repo, run.id),
    kind: "actions",
    owner,
    repo,
    number: run.id,
    title: run.display_title || run.name || `run #${run.id}`,
    htmlUrl: run.html_url,
    user: run.actor?.login ?? "ghost",
    createdAt: run.created_at,
    unread
  };
}
function capByKind(items) {
  const buckets = { issue: [], pr: [], actions: [] };
  for (const it of items) buckets[it.kind].push(it);
  return [
    ...buckets.issue.slice(0, 50),
    ...buckets.pr.slice(0, 50),
    ...buckets.actions.slice(0, 30)
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
function unreadByKind(items) {
  const out = { issue: 0, pr: 0, actions: 0 };
  for (const it of items) if (it.unread) out[it.kind] += 1;
  return out;
}
function mergeIncoming(prev, incoming, readKeys, selfKeys) {
  const map = new Map(prev.map((it) => [it.key, it]));
  const fresh = [];
  for (const it of incoming) {
    if (map.has(it.key)) continue;
    const unread = !readKeys.has(it.key) && !selfKeys.has(it.key);
    const next = { ...it, unread };
    map.set(it.key, next);
    if (unread) fresh.push(next);
  }
  const items = capByKind([...map.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  return { items, fresh };
}
function unreadCountOf(items) {
  return items.reduce((n, it) => n + (it.unread ? 1 : 0), 0);
}
function memoryStorage() {
  const m = /* @__PURE__ */ new Map();
  return {
    getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => {
      m.set(k, v);
    }
  };
}
function browserStorage() {
  return {
    getItem(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch {
      }
    }
  };
}
function parseKind(v) {
  return v === "pr" || v === "actions" || v === "issue" ? v : "issue";
}
function parseItems(raw) {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    const out = [];
    for (const x of arr) {
      if (!x || typeof x !== "object") continue;
      const o = x;
      if (typeof o.key !== "string" || typeof o.number !== "number") continue;
      let kind = parseKind(o.kind);
      let key = o.key;
      if (!key.startsWith("issue:") && !key.startsWith("pr:") && !key.startsWith("actions:")) {
        kind = "issue";
        key = inboxItemKey("issue", String(o.owner ?? ""), String(o.repo ?? ""), o.number);
      }
      out.push({
        key,
        kind,
        owner: String(o.owner ?? ""),
        repo: String(o.repo ?? ""),
        number: o.number,
        title: String(o.title ?? ""),
        htmlUrl: String(o.htmlUrl ?? ""),
        user: String(o.user ?? "ghost"),
        createdAt: String(o.createdAt ?? ""),
        unread: o.unread !== false
      });
    }
    return out;
  } catch {
    return [];
  }
}
function parseRead(raw) {
  if (!raw) return /* @__PURE__ */ new Set();
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return /* @__PURE__ */ new Set();
    const next = /* @__PURE__ */ new Set();
    for (const x of arr) {
      if (typeof x !== "string") continue;
      next.add(x);
      if (!x.startsWith("issue:") && !x.startsWith("pr:") && !x.startsWith("actions:")) {
        next.add(`issue:${x}`);
      }
    }
    return next;
  } catch {
    return /* @__PURE__ */ new Set();
  }
}
function createInboxStore(deps) {
  const storage = deps.storage ?? (typeof localStorage === "undefined" ? memoryStorage() : browserStorage());
  const now = () => deps.now?.() ?? Date.now();
  let items = parseItems(storage.getItem(LS_ITEMS));
  let readKeys = parseRead(storage.getItem(LS_READ));
  const selfKeys = /* @__PURE__ */ new Set();
  let watermark = storage.getItem(LS_WATER) || new Date(now() - WEEK_MS).toISOString();
  let truncatedWatch = false;
  let lastError = null;
  let extraWatch = null;
  let firstTick = true;
  const listeners = /* @__PURE__ */ new Set();
  let timer = null;
  let stopped = true;
  let inFlight = false;
  let onFresh = null;
  let snapCache = {
    items,
    unreadCount: unreadCountOf(items),
    unreadByKind: unreadByKind(items),
    truncatedWatch,
    lastError,
    hasToken: Boolean(deps.getToken())
  };
  function persist() {
    storage.setItem(LS_ITEMS, JSON.stringify(items.slice(0, MAX_ITEMS)));
    storage.setItem(LS_READ, JSON.stringify([...readKeys].slice(0, MAX_READ)));
    storage.setItem(LS_WATER, watermark);
  }
  function currentUnread() {
    return deps.getToken() ? unreadCountOf(items) : 0;
  }
  function emit() {
    snapCache = {
      items,
      unreadCount: currentUnread(),
      unreadByKind: deps.getToken() ? unreadByKind(items) : { issue: 0, pr: 0, actions: 0 },
      truncatedWatch,
      lastError,
      hasToken: Boolean(deps.getToken())
    };
    for (const fn of listeners) {
      try {
        fn();
      } catch {
      }
    }
  }
  function snapshot() {
    return snapCache;
  }
  async function tick() {
    const token = deps.getToken();
    if (!token) {
      lastError = null;
      truncatedWatch = false;
      emit();
      return [];
    }
    const hidden = new Set(deps.loadHiddenRepos());
    const mine = await deps.getMyRepos();
    const names = mine.filter((r) => !r.isPrivate && !hidden.has(r.fullName)).map((r) => r.fullName);
    if (extraWatch && !names.includes(extraWatch) && !hidden.has(extraWatch)) names.push(extraWatch);
    truncatedWatch = deps.myReposTruncated();
    const incoming = [];
    if (names.length > 0) {
      const viewer = await deps.getViewerLogin();
      const allowed = new Set(names);
      const { hits, queryTruncated } = await deps.searchInboxCreatedSince(names, watermark, viewer);
      if (queryTruncated) truncatedWatch = true;
      for (const h of hits) {
        if (!allowed.has(`${h.owner}/${h.repo}`)) continue;
        incoming.push(hitToItem(h, true));
      }
    }
    const actionRepos = [];
    for (const n of [extraWatch, ...deps.loadRecentRepos()]) {
      if (!n || hidden.has(n) || actionRepos.includes(n)) continue;
      actionRepos.push(n);
      if (actionRepos.length >= 5) break;
    }
    for (const full of actionRepos) {
      const ref = parseRepoInput(full);
      if (!ref) continue;
      try {
        const runs = await deps.listRunsCreatedSince(ref, watermark);
        for (const run of runs) incoming.push(runToItem(ref.owner, ref.repo, run, true));
      } catch {
      }
    }
    if (incoming.length === 0 && names.length === 0) {
      lastError = null;
      persist();
      emit();
      firstTick = false;
      return [];
    }
    const merged = mergeIncoming(items, incoming, readKeys, selfKeys);
    items = merged.items;
    const newest = incoming.reduce((acc, h) => h.createdAt > acc ? h.createdAt : acc, watermark);
    const floor = new Date(now() - 3e4).toISOString();
    watermark = newest > floor ? newest : floor;
    lastError = null;
    persist();
    emit();
    const skipToast = firstTick;
    firstTick = false;
    if (!skipToast && merged.fresh.length) {
      try {
        onFresh?.(merged.fresh);
      } catch {
      }
    }
    return skipToast ? [] : merged.fresh;
  }
  async function pollOnce() {
    if (inFlight) return [];
    inFlight = true;
    try {
      return await tick();
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
      emit();
      return [];
    } finally {
      inFlight = false;
    }
  }
  function delayMs() {
    if (!deps.getToken()) return HIDDEN_MS;
    if (lastError) return BACKOFF_MS;
    const hidden = typeof document !== "undefined" && document.hidden;
    return hidden ? HIDDEN_MS : VISIBLE_MS;
  }
  function schedule() {
    if (stopped) return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      void pollOnce().finally(() => schedule());
    }, delayMs());
  }
  function start() {
    stopped = false;
    void pollOnce().finally(() => schedule());
    const onVis = () => {
      if (!stopped) schedule();
    };
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", onVis);
    }
    return () => {
      stopped = true;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", onVis);
      }
    };
  }
  function markRead(key) {
    readKeys = new Set(readKeys);
    readKeys.add(key);
    items = items.map((it) => it.key === key ? { ...it, unread: false } : it);
    persist();
    emit();
  }
  function markAllRead(kind) {
    const keys = items.filter((it) => !kind || it.kind === kind).map((it) => it.key);
    readKeys = /* @__PURE__ */ new Set([...readKeys, ...keys]);
    items = items.map((it) => (!kind || it.kind === kind) && it.unread ? { ...it, unread: false } : it);
    persist();
    emit();
  }
  function markSelfCreated(key) {
    selfKeys.add(key);
    readKeys = new Set(readKeys);
    readKeys.add(key);
    items = items.map((it) => it.key === key ? { ...it, unread: false } : it);
    persist();
    emit();
  }
  function setExtraWatchRepo(fullName) {
    extraWatch = fullName;
  }
  function subscribe(fn) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }
  return {
    getSnapshot: snapshot,
    subscribe,
    start,
    pollOnce,
    markRead,
    markAllRead,
    markSelfCreated,
    setExtraWatchRepo,
    setOnFresh(fn) {
      onFresh = fn;
    },
    unreadCount: currentUnread
  };
}
var singleton = null;
function getInboxStore(factory) {
  if (!singleton) singleton = createInboxStore((factory ?? liveInboxDeps)());
  return singleton;
}
function liveInboxDeps() {
  return {
    getToken,
    getMyRepos,
    myReposTruncated,
    loadHiddenRepos,
    getViewerLogin,
    searchInboxCreatedSince,
    listRunsCreatedSince,
    loadRecentRepos
  };
}

// src/comments.tsx
var import_react3 = require("react");
var import_jsx_runtime3 = require("react/jsx-runtime");
function CommentsBlock(props) {
  const ui = useUI();
  const [viewer, setViewer] = (0, import_react3.useState)(null);
  (0, import_react3.useEffect)(() => {
    getViewerLogin().then(setViewer);
  }, []);
  async function del(c) {
    if (!await ui.confirm({
      title: "\u5220\u9664\u8FD9\u6761\u8BC4\u8BBA?",
      body: c.body.slice(0, 120),
      confirmText: "\u5220\u9664",
      danger: true
    })) return;
    try {
      await deleteComment(props.ghRef, c.id);
      ui.toast("\u8BC4\u8BBA\u5DF2\u5220\u9664");
      props.onChanged();
    } catch (e) {
      ui.toast(errText(e), "err");
    }
  }
  if (props.comments.length === 0 && !props.nextUrl) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "gw-pop-divider", style: { margin: "14px 0 4px" } }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "gw-muted", style: { fontSize: 11, marginBottom: 2 }, children: [
      "\u2014\u2014 \u8BC4\u8BBA ",
      props.comments.length,
      props.nextUrl ? "+" : "",
      " \u2014\u2014"
    ] }),
    props.comments.map((c) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      CommentRow,
      {
        comment: c,
        mine: viewer != null && c.user?.login === viewer,
        ghRef: props.ghRef,
        onChanged: props.onChanged,
        onDelete: () => del(c)
      },
      c.id
    )),
    props.nextUrl && props.onLoadMore && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "gw-more", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "gw-btn", disabled: props.loadingMore, onClick: props.onLoadMore, children: props.loadingMore ? "\u52A0\u8F7D\u4E2D\u2026" : "\u52A0\u8F7D\u66F4\u591A\u8BC4\u8BBA" }) })
  ] });
}
function CommentRow(props) {
  const ui = useUI();
  const [editing, setEditing] = (0, import_react3.useState)(false);
  const [text, setText] = (0, import_react3.useState)(props.comment.body);
  const [busy, setBusy] = (0, import_react3.useState)(false);
  if (editing) {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "gw-comment", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("textarea", { className: "gw-input gw-textarea", value: text, onChange: (e) => setText(e.target.value), autoFocus: true }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "gw-composer-row", style: { marginTop: 6 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "gw-btn primary", disabled: busy || !text.trim(), onClick: async () => {
          setBusy(true);
          try {
            await editComment(props.ghRef, props.comment.id, text);
            ui.toast("\u8BC4\u8BBA\u5DF2\u66F4\u65B0");
            setEditing(false);
            props.onChanged();
          } catch (e) {
            ui.toast(errText(e), "err");
          } finally {
            setBusy(false);
          }
        }, children: "\u4FDD\u5B58" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "gw-btn", onClick: () => {
          setEditing(false);
          setText(props.comment.body);
        }, children: "\u53D6\u6D88" })
      ] })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "gw-comment", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "gw-comment-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("strong", { style: { color: "var(--dsw-alias-label-secondary)" }, children: props.comment.user?.login ?? "ghost" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: timeAgo(props.comment.created_at) }),
      props.mine && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { style: { marginLeft: "auto", display: "inline-flex", gap: 4 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "gw-hbtn", title: "\u7F16\u8F91\u8BC4\u8BBA", onClick: () => setEditing(true), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(GwIcon, { name: "pencil", size: 12 }) }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "gw-hbtn", title: "\u5220\u9664\u8BC4\u8BBA", onClick: props.onDelete, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(GwIcon, { name: "trash", size: 12 }) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { whiteSpace: "pre-wrap", wordBreak: "break-word" }, children: props.comment.body })
  ] });
}
function CommentComposer(props) {
  const ui = useUI();
  const [text, setText] = (0, import_react3.useState)("");
  const [busy, setBusy] = (0, import_react3.useState)(false);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    "textarea",
    {
      className: "gw-input gw-textarea",
      placeholder: "\u5199\u4E0B\u8BC4\u8BBA\u2026(Markdown)",
      value: text,
      onChange: (e) => setText(e.target.value),
      onKeyDown: (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && text.trim() && !busy) {
          e.preventDefault();
          submit();
        }
      }
    }
  );
  async function submit() {
    setBusy(true);
    try {
      await addComment(props.ghRef, props.number, text.trim());
      ui.toast("\u8BC4\u8BBA\u5DF2\u53D1\u8868");
      setText("");
      props.onDone();
    } catch (e) {
      ui.toast(errText(e), "err");
    } finally {
      setBusy(false);
    }
  }
}

// src/issues-view.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
function IssuesView({ ghRef, onCount, initialDetail, onConsumeDeep }) {
  const ui = useUI();
  const [list, setList] = (0, import_react4.useState)(null);
  const [error, setError] = (0, import_react4.useState)(null);
  const [detail, setDetail] = (0, import_react4.useState)(initialDetail ?? null);
  (0, import_react4.useEffect)(() => {
    if (initialDetail != null) onConsumeDeep?.();
  }, [initialDetail]);
  const [showNew, setShowNew] = (0, import_react4.useState)(false);
  const [stateFilter, setStateFilter] = (0, import_react4.useState)("open");
  const [sort, setSort] = (0, import_react4.useState)("created");
  const [nextUrl, setNextUrl] = (0, import_react4.useState)(null);
  const [total, setTotal] = (0, import_react4.useState)(null);
  const [loadingMore, setLoadingMore] = (0, import_react4.useState)(false);
  const reqId = (0, import_react4.useRef)(0);
  const load = (0, import_react4.useCallback)((silent, pageUrl) => {
    const id = pageUrl ? reqId.current : ++reqId.current;
    if (pageUrl) setLoadingMore(true);
    else if (!silent) setList(null);
    setError(null);
    listIssues(ghRef, stateFilter, sort, pageUrl).then((page) => {
      if (id !== reqId.current) return;
      setList((prev) => pageUrl && prev ? [...prev, ...page.items] : page.items);
      setNextUrl(page.nextUrl);
      setTotal(page.totalCount);
      if (stateFilter === "open" && page.totalCount != null) onCount(page.totalCount);
    }).catch((e) => {
      if (id === reqId.current) setError(errText(e));
    }).finally(() => {
      if (id === reqId.current) setLoadingMore(false);
    });
  }, [ghRef.owner, ghRef.repo, onCount, stateFilter, sort]);
  (0, import_react4.useEffect)(() => {
    setList(null);
    setDetail(null);
    setNextUrl(null);
    load(false);
  }, [ghRef.owner, ghRef.repo, stateFilter, sort]);
  const reload = (0, import_react4.useCallback)(() => load(true), [load]);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "gw-colpane", style: { flex: 1, minHeight: 0, display: "flex" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "gw-toolbar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "gw-open-count", children: list ? `${list.length}${total != null ? ` / ${total}` : ""} ${stateFilter === "open" ? "open" : "closed"}` : "\u2026" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { style: { display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
          "select",
          {
            className: "gw-select",
            style: { marginLeft: 0, maxWidth: 118 },
            value: sort,
            onChange: (e) => setSort(e.target.value),
            title: "\u6392\u5E8F",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "created", children: "\u6700\u65B0\u521B\u5EFA" }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "updated", children: "\u6700\u8FD1\u66F4\u65B0" })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "button",
          {
            className: `gw-btn ${stateFilter === "open" ? "primary" : ""}`,
            onClick: () => setStateFilter("open"),
            children: "\u5F00\u653E"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "button",
          {
            className: `gw-btn ${stateFilter === "closed" ? "primary" : ""}`,
            onClick: () => setStateFilter("closed"),
            children: "\u5DF2\u5173\u95ED"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { className: "gw-btn primary", onClick: () => setShowNew(true), children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(GwIcon, { name: "plus", size: 12 }),
          "\u65B0\u5EFA Issue"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "gw-list", children: [
      error && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(ErrorBox, { msg: error, onRetry: () => reload() }),
      !error && !list && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Loading, {}),
      list?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Empty, { children: stateFilter === "open" ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
        "\u6CA1\u6709\u6253\u5F00\u7684 Issue\u3002",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("br", {}),
        "\u7528\u4E0A\u65B9\u6309\u94AE\u521B\u5EFA\u7B2C\u4E00\u4E2A\u3002"
      ] }) : "\u6CA1\u6709\u5DF2\u5173\u95ED\u7684 Issue\u3002" }),
      list?.map((it) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { className: "gw-row", onClick: () => setDetail(it.number), children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "span",
          {
            className: "gw-stateic",
            style: { color: it.state === "closed" ? "var(--dsw-alias-state-danger-primary)" : "var(--dsw-alias-state-success-primary)" },
            children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(GwIcon, { name: it.state === "closed" ? "x-circle" : "issue" })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "gw-rowmain", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "gw-rowtitle", children: it.title }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "gw-rowsub", children: [
            "#",
            it.number,
            " \xB7 ",
            timeAgo(it.updated_at),
            " \u66F4\u65B0 \xB7 ",
            it.user?.login ?? "ghost",
            it.comments > 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
              " \xB7 ",
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(GwIcon, { name: "comment", size: 10 }),
              " ",
              it.comments
            ] }),
            it.labels.map((l) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
              "span",
              {
                className: "gw-label-chip",
                style: { background: `#${l.color.replace("#", "")}`, color: labelTextColor(l.color), marginLeft: 4 },
                children: l.name
              },
              l.name
            ))
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "gw-meta", children: [
          "\u66F4\u65B0",
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("br", {}),
          timeAgo(it.updated_at)
        ] })
      ] }, it.number)),
      nextUrl && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "gw-more", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "gw-btn", disabled: loadingMore, onClick: () => load(true, nextUrl), children: loadingMore ? "\u52A0\u8F7D\u4E2D\u2026" : "\u52A0\u8F7D\u66F4\u591A" }) }),
      !nextUrl && total != null && (list?.length ?? 0) >= 1e3 && total > 1e3 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "gw-muted", style: { textAlign: "center", padding: "8px 12px 14px" }, children: "Search \u6700\u591A\u5C55\u793A 1000 \u6761\uFF0C\u5176\u4F59\u8BF7\u4E0A GitHub \u7F51\u9875" })
    ] }),
    showNew && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      NewIssueDrawer,
      {
        ghRef,
        onClose: () => setShowNew(false),
        onCreated: (n) => {
          setShowNew(false);
          reload();
          setDetail(n);
        }
      }
    ),
    detail !== null && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      IssueDrawer,
      {
        ghRef,
        number: detail,
        onClose: () => setDetail(null),
        onChanged: () => {
          reload();
        }
      },
      detail
    )
  ] });
}
function NewIssueDrawer(props) {
  const ui = useUI();
  const [title, setTitle] = (0, import_react4.useState)("");
  const [body, setBody] = (0, import_react4.useState)("");
  const [busy, setBusy] = (0, import_react4.useState)(false);
  const [error, setError] = (0, import_react4.useState)(null);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "gw-detail", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "gw-detail-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { className: "backbtn gw-btn", onClick: props.onClose, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(GwIcon, { name: "chevron-left", size: 12 }),
        "\u8FD4\u56DE\u5217\u8868"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { fontWeight: 600, marginTop: 6 }, children: "\u65B0\u5EFA Issue" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "gw-detail-body", style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "input",
        {
          className: "gw-input",
          placeholder: "\u6807\u9898(\u5FC5\u586B)",
          value: title,
          onChange: (e) => setTitle(e.target.value),
          autoFocus: true
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "textarea",
        {
          className: "gw-input gw-textarea",
          rows: 7,
          placeholder: "\u6B63\u6587(Markdown)",
          value: body,
          onChange: (e) => setBody(e.target.value)
        }
      ),
      error && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "gw-errbox", children: error })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "gw-composer", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "gw-composer-row", style: { justifyContent: "flex-end" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "gw-btn", onClick: props.onClose, children: "\u53D6\u6D88" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "button",
        {
          className: "gw-btn primary",
          disabled: !title.trim() || busy,
          onClick: () => {
            setBusy(true);
            setError(null);
            createIssue(props.ghRef, title.trim(), body).then((it) => {
              ui.toast(`Issue #${it.number} \u5DF2\u521B\u5EFA`);
              getInboxStore().markSelfCreated(inboxItemKey("issue", props.ghRef.owner, props.ghRef.repo, it.number));
              props.onCreated(it.number);
            }).catch((e) => {
              setError(errText(e));
            }).finally(() => setBusy(false));
          },
          children: busy ? "\u521B\u5EFA\u4E2D\u2026" : "\u521B\u5EFA"
        }
      )
    ] }) })
  ] });
}
function IssueDrawer(props) {
  const ui = useUI();
  const [issue, setIssue] = (0, import_react4.useState)(null);
  const [comments, setComments] = (0, import_react4.useState)([]);
  const [commentsNext, setCommentsNext] = (0, import_react4.useState)(null);
  const [loadingMoreComments, setLoadingMoreComments] = (0, import_react4.useState)(false);
  const [error, setError] = (0, import_react4.useState)(null);
  const [editing, setEditing] = (0, import_react4.useState)(false);
  const [eTitle, setETitle] = (0, import_react4.useState)("");
  const [eBody, setEBody] = (0, import_react4.useState)("");
  const loadAll = (0, import_react4.useCallback)(() => {
    setError(null);
    Promise.all([getIssue(props.ghRef, props.number), listComments(props.ghRef, props.number)]).then(([i, c]) => {
      setIssue(i);
      setComments(c.items);
      setCommentsNext(c.nextUrl);
      setETitle(i.title);
      setEBody(i.body ?? "");
    }).catch((e) => setError(errText(e)));
  }, [props.ghRef.owner, props.ghRef.repo, props.number]);
  (0, import_react4.useEffect)(() => {
    loadAll();
  }, [loadAll]);
  const closed = issue?.state === "closed";
  async function toggleState() {
    if (!issue) return;
    const toClosed = !closed;
    if (toClosed && !await ui.confirm({
      title: `\u5173\u95ED Issue #${issue.number}?`,
      body: issue.title,
      confirmText: "\u5173\u95ED",
      danger: true
    })) return;
    try {
      await patchIssue(props.ghRef, issue.number, { state: toClosed ? "closed" : "open" });
      ui.toast(toClosed ? `Issue #${issue.number} \u5DF2\u5173\u95ED` : `Issue #${issue.number} \u5DF2\u91CD\u65B0\u6253\u5F00`);
      loadAll();
      props.onChanged();
    } catch (e) {
      ui.toast(errText(e), "err");
    }
  }
  async function saveEdit() {
    if (!issue) return;
    try {
      await patchIssue(props.ghRef, issue.number, { title: eTitle.trim(), body: eBody });
      ui.toast("\u5DF2\u4FDD\u5B58");
      setEditing(false);
      loadAll();
      props.onChanged();
    } catch (e) {
      ui.toast(errText(e), "err");
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "pane-wrap gw-pane-wrap", style: { position: "absolute", inset: 0, zIndex: 30, display: "flex" }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "gw-detail", style: { position: "static", flex: 1 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "gw-detail-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { className: "gw-btn backbtn", onClick: props.onClose, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(GwIcon, { name: "chevron-left", size: 12 }),
        "\u8FD4\u56DE\u5217\u8868"
      ] }),
      issue ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { fontWeight: 600, marginTop: 6, fontSize: 13 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StateIcon, { closed: issue.state === "closed" }),
          issue.title,
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "gw-muted", children: [
            "#",
            issue.number
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "gw-rowsub", style: { marginTop: 3 }, children: [
          issue.user?.login ?? "ghost",
          " \u521B\u5EFA\u4E8E ",
          timeAgo(issue.created_at),
          " \xB7 ",
          issue.state === "closed" ? "\u5DF2\u5173\u95ED" : "\u5F00\u653E",
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
            "a",
            {
              className: "gw-link",
              href: issue.html_url,
              target: "_blank",
              rel: "noreferrer",
              style: { display: "inline-flex", alignItems: "center", gap: 3 },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(GwIcon, { name: "external-link", size: 10 }),
                "GitHub"
              ]
            }
          )
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "gw-muted", style: { marginTop: 8 }, children: "\u52A0\u8F7D\u4E2D\u2026" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "gw-detail-body", children: [
      error && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(ErrorBox, { msg: error, onRetry: loadAll }),
      !error && !issue && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Loading, {}),
      issue && (editing ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { className: "gw-input", value: eTitle, onChange: (e) => setETitle(e.target.value) }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "textarea",
          {
            className: "gw-input gw-textarea",
            rows: 8,
            value: eBody,
            onChange: (e) => setEBody(e.target.value)
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "gw-composer-row", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "gw-btn primary", onClick: saveEdit, children: "\u4FDD\u5B58\u4FEE\u6539" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "gw-btn", onClick: () => {
            setEditing(false);
            setETitle(issue.title);
            setEBody(issue.body ?? "");
          }, children: "\u53D6\u6D88" })
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
        issue.body || "(\u65E0\u6B63\u6587)",
        issue.labels.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { marginTop: 10 }, children: issue.labels.map((l) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "span",
          {
            className: "gw-label-chip",
            style: { background: `#${l.color.replace("#", "")}`, color: labelTextColor(l.color) },
            children: l.name
          },
          l.name
        )) }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          CommentsBlock,
          {
            ghRef: props.ghRef,
            number: props.number,
            comments,
            onChanged: loadAll,
            nextUrl: commentsNext,
            loadingMore: loadingMoreComments,
            onLoadMore: () => {
              if (!commentsNext) return;
              setLoadingMoreComments(true);
              listComments(props.ghRef, props.number, commentsNext).then((page) => {
                setComments((prev) => [...prev, ...page.items]);
                setCommentsNext(page.nextUrl);
              }).catch((e) => ui.toast(errText(e), "err")).finally(() => setLoadingMoreComments(false));
            }
          }
        )
      ] }))
    ] }),
    issue && !editing && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "gw-composer", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(CommentComposer, { ghRef: props.ghRef, number: props.number, onDone: loadAll }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "gw-composer-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: `gw-btn ${closed ? "" : "danger"}`, onClick: toggleState, children: closed ? "\u91CD\u65B0\u6253\u5F00" : "\u5173\u95ED Issue" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { className: "gw-btn", onClick: () => setEditing(true), children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(GwIcon, { name: "pencil", size: 11 }),
          "\u7F16\u8F91"
        ] })
      ] })
    ] })
  ] }) });
}
function StateIcon(props) {
  const color = props.merged ? "var(--dsw-alias-state-merged, #a371f7)" : props.closed ? "var(--dsw-alias-state-danger-primary)" : "var(--dsw-alias-state-success-primary)";
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "gw-stateic", style: { color, display: "inline-flex", marginRight: 6, verticalAlign: "-2px" }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(GwIcon, { name: props.merged ? "merge" : props.closed ? "x-circle" : "issue", size: 13 }) });
}

// src/pulls-view.tsx
var import_react5 = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
var METHOD_LABEL = {
  merge: "Merge",
  squash: "Squash and merge",
  rebase: "Rebase and merge"
};
var FILTER_LABEL = {
  open: "open",
  closed: "closed",
  merged: "merged"
};
function PullsView({ ghRef, branches, visible, onCount, initialDetail, onConsumeDeep }) {
  const ui = useUI();
  const [list, setList] = (0, import_react5.useState)(null);
  const [error, setError] = (0, import_react5.useState)(null);
  const [detail, setDetail] = (0, import_react5.useState)(initialDetail ?? null);
  (0, import_react5.useEffect)(() => {
    if (initialDetail != null) onConsumeDeep?.();
  }, [initialDetail]);
  const [showNew, setShowNew] = (0, import_react5.useState)(false);
  const [stateFilter, setStateFilter] = (0, import_react5.useState)("open");
  const [sort, setSort] = (0, import_react5.useState)("created");
  const [nextUrl, setNextUrl] = (0, import_react5.useState)(null);
  const [total, setTotal] = (0, import_react5.useState)(null);
  const [loadingMore, setLoadingMore] = (0, import_react5.useState)(false);
  const reqId = (0, import_react5.useRef)(0);
  const load = (0, import_react5.useCallback)((silent, pageUrl) => {
    const id = pageUrl ? reqId.current : ++reqId.current;
    if (pageUrl) setLoadingMore(true);
    else if (!silent) setList(null);
    setError(null);
    listPulls(ghRef, stateFilter, sort, pageUrl).then((page) => {
      if (id !== reqId.current) return;
      setList((prev) => pageUrl && prev ? [...prev, ...page.items] : page.items);
      setNextUrl(page.nextUrl);
      setTotal(page.totalCount);
      if (stateFilter === "open" && page.totalCount != null) onCount(page.totalCount);
    }).catch((e) => {
      if (id === reqId.current) setError(errText(e));
    }).finally(() => {
      if (id === reqId.current) setLoadingMore(false);
    });
  }, [ghRef.owner, ghRef.repo, onCount, stateFilter, sort]);
  (0, import_react5.useEffect)(() => {
    setList(null);
    setDetail(null);
    setNextUrl(null);
    load(false);
  }, [ghRef.owner, ghRef.repo, stateFilter, sort]);
  (0, import_react5.useEffect)(() => {
    const sec = Number(localStorage.getItem("gw.autoSec") ?? 0);
    if (!visible || sec <= 0) return;
    const t = setInterval(() => load(true), sec * 1e3);
    return () => clearInterval(t);
  }, [visible, load]);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "gw-colpane", style: { flex: 1, minHeight: 0, display: "flex" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "gw-toolbar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "gw-open-count", children: list ? `${list.length}${total != null ? ` / ${total}` : ""} ${FILTER_LABEL[stateFilter]}` : "\u2026" }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { style: { display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
          "select",
          {
            className: "gw-select",
            style: { marginLeft: 0, maxWidth: 118 },
            value: sort,
            onChange: (e) => setSort(e.target.value),
            title: "\u6392\u5E8F",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: "created", children: "\u6700\u65B0\u521B\u5EFA" }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: "updated", children: "\u6700\u8FD1\u66F4\u65B0" })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "button",
          {
            className: `gw-btn ${stateFilter === "open" ? "primary" : ""}`,
            onClick: () => setStateFilter("open"),
            children: "\u5F00\u653E"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "button",
          {
            className: `gw-btn ${stateFilter === "closed" ? "primary" : ""}`,
            onClick: () => setStateFilter("closed"),
            children: "\u5DF2\u5173\u95ED"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "button",
          {
            className: `gw-btn ${stateFilter === "merged" ? "primary" : ""}`,
            onClick: () => setStateFilter("merged"),
            children: "\u5DF2\u5408\u5E76"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("button", { className: "gw-btn primary", onClick: () => setShowNew(true), children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(GwIcon, { name: "plus", size: 12 }),
          "\u65B0\u5EFA PR"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "gw-list", children: [
      error && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(ErrorBox, { msg: error, onRetry: () => load(true) }),
      !error && !list && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Loading, {}),
      list?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Empty, { children: stateFilter === "open" ? "\u6CA1\u6709\u6253\u5F00\u7684 Pull Request\u3002" : stateFilter === "merged" ? "\u6CA1\u6709\u5DF2\u5408\u5E76\u7684 Pull Request\u3002" : "\u6CA1\u6709\u5DF2\u5173\u95ED(\u672A\u5408\u5E76)\u7684 Pull Request\u3002" }),
      list?.map((pr) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("button", { className: "gw-row", onClick: () => setDetail(pr.number), children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "span",
          {
            className: "gw-stateic",
            style: { color: stateFilter === "merged" || pr.merged_at && pr.state === "closed" ? "var(--dsw-alias-state-merged, #a371f7)" : pr.state === "closed" ? "var(--dsw-alias-state-danger-primary)" : pr.draft ? "var(--dsw-alias-label-tertiary)" : "var(--dsw-alias-state-success-primary)" },
            children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(GwIcon, { name: stateFilter === "merged" || pr.merged_at ? "merge" : pr.state === "closed" ? "x-circle" : "pr" })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "gw-rowmain", children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "gw-rowtitle", children: [
            pr.title,
            pr.draft && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "gw-chip", style: { marginLeft: 6 }, children: "draft" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "gw-rowsub", children: [
            "#",
            pr.number,
            pr.head.ref && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
              " \xB7 ",
              /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "gw-branch-chip", children: [
                pr.head.ref,
                " \u2192 ",
                pr.base.ref
              ] })
            ] }),
            "\xB7 ",
            timeAgo(pr.updated_at)
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "gw-meta", children: [
          "\u66F4\u65B0",
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("br", {}),
          timeAgo(pr.updated_at)
        ] })
      ] }, pr.number)),
      nextUrl && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "gw-more", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { className: "gw-btn", disabled: loadingMore, onClick: () => load(true, nextUrl), children: loadingMore ? "\u52A0\u8F7D\u4E2D\u2026" : "\u52A0\u8F7D\u66F4\u591A" }) }),
      !nextUrl && total != null && (list?.length ?? 0) >= 1e3 && total > 1e3 && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "gw-muted", style: { textAlign: "center", padding: "8px 12px 14px" }, children: "Search \u6700\u591A\u5C55\u793A 1000 \u6761\uFF0C\u5176\u4F59\u8BF7\u4E0A GitHub \u7F51\u9875" })
    ] }),
    showNew && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      NewPRDrawer,
      {
        ghRef,
        branches,
        onClose: () => setShowNew(false),
        onCreated: (n) => {
          setShowNew(false);
          load(true);
          setDetail(n);
        }
      }
    ),
    detail !== null && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      PullDrawer,
      {
        ghRef,
        number: detail,
        onClose: () => setDetail(null),
        onChanged: () => load(true)
      },
      detail
    )
  ] });
}
function NewPRDrawer(props) {
  const ui = useUI();
  const defBase = props.branches[0]?.name ?? "";
  const [title, setTitle] = (0, import_react5.useState)("");
  const [body, setBody] = (0, import_react5.useState)("");
  const [head, setHead] = (0, import_react5.useState)("");
  const [base, setBase] = (0, import_react5.useState)(defBase);
  const [busy, setBusy] = (0, import_react5.useState)(false);
  const [error, setError] = (0, import_react5.useState)(null);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { position: "absolute", inset: 0, zIndex: 30, display: "flex" }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "gw-detail", style: { position: "static", flex: 1 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "gw-detail-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("button", { className: "gw-btn backbtn", onClick: props.onClose, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(GwIcon, { name: "chevron-left", size: 12 }),
        "\u8FD4\u56DE\u5217\u8868"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { fontWeight: 600, marginTop: 6 }, children: "\u65B0\u5EFA Pull Request" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "gw-detail-body", style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "gw-formrow", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "gw-field", style: { flex: 1 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("label", { children: "head(\u6E90\u5206\u652F)" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "input",
            {
              className: "gw-input",
              placeholder: "feature/xxx",
              value: head,
              list: "gw-branches",
              onChange: (e) => setHead(e.target.value),
              autoFocus: true
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("datalist", { id: "gw-branches", children: props.branches.map((b) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: b.name }, b.name)) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "gw-field", style: { width: 140 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("label", { children: "base(\u76EE\u6807\u5206\u652F)" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "select",
            {
              className: "gw-input",
              value: base,
              onChange: (e) => setBase(e.target.value),
              style: { appearance: "auto", backgroundImage: "none", paddingRight: 8 },
              children: props.branches.map((b) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: b.name, children: b.name }, b.name))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "input",
        {
          className: "gw-input",
          placeholder: "\u6807\u9898(\u5FC5\u586B)",
          value: title,
          onChange: (e) => setTitle(e.target.value)
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "textarea",
        {
          className: "gw-input gw-textarea",
          rows: 6,
          placeholder: "\u63CF\u8FF0(Markdown)",
          value: body,
          onChange: (e) => setBody(e.target.value)
        }
      ),
      error && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "gw-errbox", children: error })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "gw-composer", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "gw-composer-row", style: { justifyContent: "flex-end" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { className: "gw-btn", onClick: props.onClose, children: "\u53D6\u6D88" }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "button",
        {
          className: "gw-btn primary",
          disabled: !title.trim() || !head.trim() || !base || busy,
          onClick: () => {
            setBusy(true);
            setError(null);
            createPull(props.ghRef, { title: title.trim(), body, head: head.trim(), base }).then((pr) => {
              ui.toast(`PR #${pr.number} \u5DF2\u521B\u5EFA`);
              getInboxStore().markSelfCreated(inboxItemKey("pr", props.ghRef.owner, props.ghRef.repo, pr.number));
              props.onCreated(pr.number);
            }).catch((e) => setError(errText(e))).finally(() => setBusy(false));
          },
          children: busy ? "\u521B\u5EFA\u4E2D\u2026" : "\u521B\u5EFA PR"
        }
      )
    ] }) })
  ] }) });
}
function PullDrawer(props) {
  const ui = useUI();
  const [pull, setPull] = (0, import_react5.useState)(null);
  const [comments, setComments] = (0, import_react5.useState)([]);
  const [commentsNext, setCommentsNext] = (0, import_react5.useState)(null);
  const [loadingMoreComments, setLoadingMoreComments] = (0, import_react5.useState)(false);
  const [checks, setChecks] = (0, import_react5.useState)(null);
  const [error, setError] = (0, import_react5.useState)(null);
  const [method, setMethod] = (0, import_react5.useState)("squash");
  const [busy, setBusy] = (0, import_react5.useState)(false);
  const loadAll = (0, import_react5.useCallback)(() => {
    setError(null);
    Promise.all([
      getPull(props.ghRef, props.number),
      listComments(props.ghRef, props.number)
    ]).then(([p, c]) => {
      setPull(p);
      setComments(c.items);
      setCommentsNext(c.nextUrl);
    }).catch((e) => setError(errText(e)));
  }, [props.ghRef.owner, props.ghRef.repo, props.number]);
  (0, import_react5.useEffect)(() => {
    loadAll();
  }, [loadAll]);
  (0, import_react5.useEffect)(() => {
    if (!pull?.head.sha) return;
    setChecks(null);
    listCheckRuns(props.ghRef, pull.head.sha).then(setChecks).catch(() => setChecks([]));
  }, [pull?.head.sha, props.ghRef.owner, props.ghRef.repo]);
  if (error) {
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { position: "absolute", inset: 0, zIndex: 30, display: "flex" }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "gw-detail", style: { position: "static", flex: 1 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "gw-detail-head", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("button", { className: "gw-btn backbtn", onClick: props.onClose, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(GwIcon, { name: "chevron-left", size: 12 }),
        "\u8FD4\u56DE\u5217\u8868"
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(ErrorBox, { msg: error, onRetry: loadAll })
    ] }) });
  }
  if (!pull) return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Loading, {});
  const closed = pull.state === "closed";
  const merged = Boolean(pull.merged_at);
  const okChecks = checks?.filter((c) => c.conclusion === "success").length ?? 0;
  const badChecks = checks?.filter((c) => c.conclusion && c.conclusion !== "success" && c.conclusion !== "skipped" && c.conclusion !== "neutral").length ?? 0;
  const pendingChecks = checks?.filter((c) => !c.conclusion).length ?? 0;
  const canMerge = !closed && !pull.draft;
  async function doMerge() {
    if (!pull) return;
    if (!await ui.confirm({
      title: `\u4EE5 ${METHOD_LABEL[method]} \u5408\u5E76 #${pull.number}?`,
      body: `${pull.head.ref} \u2192 ${pull.base.ref}
\u5C06\u6309 GitHub \u7684\u8BE5\u65B9\u5F0F\u4EA7\u751F\u63D0\u4EA4,\u5408\u5E76\u540E\u901A\u5E38\u81EA\u52A8\u5220\u9664\u6E90\u5206\u652F\u3002`,
      confirmText: METHOD_LABEL[method],
      danger: true
    })) return;
    setBusy(true);
    try {
      await mergePull(props.ghRef, pull.number, method);
      ui.toast(`PR #${pull.number} \u5DF2\u5408\u5E76(${METHOD_LABEL[method]})`);
      props.onChanged();
      loadAll();
    } catch (e) {
      ui.toast(errText(e), "err");
    } finally {
      setBusy(false);
    }
  }
  async function toggleState() {
    if (!pull) return;
    const toClosed = !closed;
    if (toClosed && !await ui.confirm({
      title: `\u5173\u95ED PR #${pull.number}?`,
      body: pull.title,
      confirmText: "\u5173\u95ED",
      danger: true
    })) return;
    try {
      await patchIssue(props.ghRef, pull.number, { state: toClosed ? "closed" : "open" });
      ui.toast(toClosed ? `PR #${pull.number} \u5DF2\u5173\u95ED` : `PR #${pull.number} \u5DF2\u91CD\u65B0\u6253\u5F00`);
      props.onChanged();
      loadAll();
    } catch (e) {
      ui.toast(errText(e), "err");
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { position: "absolute", inset: 0, zIndex: 30, display: "flex" }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "gw-detail", style: { position: "static", flex: 1 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "gw-detail-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("button", { className: "gw-btn backbtn", onClick: props.onClose, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(GwIcon, { name: "chevron-left", size: 12 }),
        "\u8FD4\u56DE\u5217\u8868"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { fontWeight: 600, marginTop: 6, fontSize: 13 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(StateIcon, { closed, merged }),
        pull.title,
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "gw-muted", children: [
          "#",
          pull.number
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "gw-rowsub", style: { marginTop: 3, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "gw-branch-chip", children: [
          pull.head.label,
          " \u2192 ",
          pull.base.label
        ] }),
        pull.additions !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "gw-diffstat-add", children: [
            "+",
            pull.additions
          ] }),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "gw-diffstat-del", children: [
            "\u2212",
            pull.deletions
          ] }),
          pull.changed_files !== void 0 ? ` \xB7 ${pull.changed_files} files` : ""
        ] }),
        "\xB7 ",
        timeAgo(pull.created_at),
        " \u521B\u5EFA",
        checks !== null && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { style: { display: "inline-flex", alignItems: "center", gap: 3 }, children: [
          "\xB7",
          badChecks > 0 ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "gw-checkdot", style: { background: "var(--dsw-alias-state-danger-primary)" } }) : pendingChecks > 0 ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "gw-checkdot", style: { background: "var(--dsw-alias-state-attention-primary)" } }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "gw-checkdot", style: { background: "var(--dsw-alias-state-success-primary)" } }),
          badChecks > 0 ? `\u5931\u8D25 ${badChecks}` : pendingChecks > 0 ? "\u8FDB\u884C\u4E2D" : `\u901A\u8FC7 ${okChecks}`
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
          "a",
          {
            className: "gw-link",
            href: pull.html_url,
            target: "_blank",
            rel: "noreferrer",
            style: { display: "inline-flex", alignItems: "center", gap: 3 },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(GwIcon, { name: "external-link", size: 10 }),
              "GitHub"
            ]
          }
        )
      ] }),
      canMerge && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "gw-composer-row", style: { marginTop: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
          "select",
          {
            className: "gw-select",
            style: { marginLeft: 0, maxWidth: 190 },
            value: method,
            onChange: (e) => setMethod(e.target.value),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: "merge", children: "Create a merge commit" }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: "squash", children: "Squash and merge" }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: "rebase", children: "Rebase and merge" })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
          "button",
          {
            className: "gw-btn primary",
            disabled: busy || pull.mergeable === false,
            onClick: doMerge,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(GwIcon, { name: "merge", size: 12 }),
              METHOD_LABEL[method]
            ]
          }
        ),
        pull.mergeable === false && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "gw-muted", style: { fontSize: 10 }, children: "\u5B58\u5728\u51B2\u7A81,\u65E0\u6CD5\u5408\u5E76" })
      ] }),
      checks !== null && checks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { marginTop: 8, display: "flex", flexDirection: "column", gap: 2 }, children: [
        checks.slice(0, 8).map((c) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
          "a",
          {
            className: "gw-rowsub gw-link",
            href: c.html_url,
            target: "_blank",
            rel: "noreferrer",
            style: { textDecoration: "none" },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(CheckDot, { run: c }),
              c.name ?? "check",
              " \xB7 ",
              c.conclusion ?? c.status
            ]
          },
          c.id
        )),
        checks.length > 8 && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "gw-muted", children: [
          "\u2026 \u5176\u4F59 ",
          checks.length - 8,
          " \u9879\u89C1 GitHub"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "gw-detail-body", children: [
      pull.body || "(\u65E0\u63CF\u8FF0)",
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        CommentsBlock,
        {
          ghRef: props.ghRef,
          number: props.number,
          comments,
          onChanged: loadAll,
          nextUrl: commentsNext,
          loadingMore: loadingMoreComments,
          onLoadMore: () => {
            if (!commentsNext) return;
            setLoadingMoreComments(true);
            listComments(props.ghRef, props.number, commentsNext).then((page) => {
              setComments((prev) => [...prev, ...page.items]);
              setCommentsNext(page.nextUrl);
            }).catch((e) => ui.toast(errText(e), "err")).finally(() => setLoadingMoreComments(false));
          }
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "gw-composer", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(CommentComposer, { ghRef: props.ghRef, number: props.number, onDone: loadAll }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "gw-composer-row", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { className: `gw-btn ${closed ? "" : "danger"}`, onClick: toggleState, children: closed ? "\u91CD\u65B0\u6253\u5F00" : "\u5173\u95ED PR" }) })
    ] })
  ] }) });
}
function CheckDot(props) {
  const color = props.run.conclusion === "success" ? "var(--dsw-alias-state-success-primary)" : props.run.conclusion && props.run.conclusion !== "skipped" && props.run.conclusion !== "neutral" ? "var(--dsw-alias-state-danger-primary)" : "var(--dsw-alias-state-attention-primary)";
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "gw-checkdot", style: { background: color } });
}

// src/actions-view.tsx
var import_react6 = require("react");
var import_jsx_runtime6 = require("react/jsx-runtime");
function ActionsView({ ghRef, visible, onCount }) {
  const ui = useUI();
  const [runs, setRuns] = (0, import_react6.useState)(null);
  const [error, setError] = (0, import_react6.useState)(null);
  const [tick, setTick] = (0, import_react6.useState)(0);
  const reload = (0, import_react6.useCallback)((silent = false) => {
    if (!silent) setError(null);
    listRuns(ghRef).then((arr) => {
      setRuns(arr);
      onCount(arr.length);
    }).catch((e) => setError(errText(e)));
  }, [ghRef.owner, ghRef.repo, onCount]);
  (0, import_react6.useEffect)(() => {
    reload();
  }, [reload]);
  (0, import_react6.useEffect)(() => {
    if (!visible) return;
    const t = setInterval(() => setTick((n) => n + 1), 3e4);
    return () => clearInterval(t);
  }, [visible]);
  (0, import_react6.useEffect)(() => {
    if (!visible) return;
    const sec = loadAutoRefreshSec();
    if (sec <= 0) return;
    const t = setInterval(() => reload(true), sec * 1e3);
    return () => clearInterval(t);
  }, [visible, reload]);
  async function rerun(run) {
    try {
      await rerunRun(ghRef, run.id);
      ui.toast(`\u5DF2\u89E6\u53D1\u91CD\u8DD1:${run.display_title || run.name || "#" + run.id}`);
      setTimeout(() => reload(false), 1200);
    } catch (e) {
      ui.toast(errText(e), "err");
    }
  }
  async function cancel(run) {
    if (!await ui.confirm({
      title: `\u53D6\u6D88\u8FD0\u884C #${run.id}?`,
      body: `${run.display_title || run.name} \xB7 ${run.head_branch}`,
      confirmText: "\u53D6\u6D88\u8FD0\u884C",
      danger: true
    })) return;
    try {
      await cancelRun(ghRef, run.id);
      ui.toast("\u5DF2\u53D1\u9001\u53D6\u6D88\u8BF7\u6C42");
      setTimeout(() => reload(false), 1e3);
    } catch (e) {
      ui.toast(errText(e), "err");
    }
  }
  const active = runs?.filter((r) => r.status === "in_progress" || r.status === "queued").length ?? 0;
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "gw-colpane", style: { flex: 1, minHeight: 0, display: "flex" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "gw-toolbar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "gw-open-count", children: [
        "\u6700\u8FD1 20 \u6B21",
        active > 0 ? ` \xB7 ${active} \u4E2A\u8FDB\u884C\u4E2D` : ""
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("button", { className: "gw-btn", onClick: () => reload(false), children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(GwIcon, { name: "refresh", size: 11 }),
        "\u5237\u65B0"
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "gw-list", children: [
      error && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(ErrorBox, { msg: error, onRetry: reload }),
      !error && !runs && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Loading, {}),
      runs?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Empty, { children: "\u8FD9\u4E2A\u4ED3\u5E93\u8FD8\u6CA1\u6709 workflow \u8FD0\u884C\u8BB0\u5F55\u3002" }),
      runs?.map((run) => {
        const isActive = run.status === "in_progress" || run.status === "queued";
        const dur = Date.parse(run.updated_at) - Date.parse(run.created_at);
        return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
          "div",
          {
            className: "gw-row",
            style: { cursor: "pointer" },
            onClick: () => window.open(run.html_url, "_blank", "noopener"),
            title: "\u70B9\u51FB\u5728\u65B0\u7A97\u53E3\u6253\u5F00\u6B64\u6B21\u8FD0\u884C",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "gw-stateic", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(RunIcon, { run }) }),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "gw-rowmain", children: [
                /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "gw-rowtitle", children: [
                  run.name ?? "workflow",
                  " \xB7 ",
                  run.display_title
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "gw-rowsub", children: [
                  "#",
                  run.id,
                  " \xB7 ",
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "gw-branch-chip", children: run.head_branch }),
                  " \xB7 ",
                  run.event,
                  run.status === "completed" ? ` \xB7 \u7528\u65F6 ${fmtDuration(Math.max(0, dur))}` : ` \xB7 ${run.status === "queued" ? "\u6392\u961F\u4E2D" : "\u8FD0\u884C\u4E2D"}(#${run.run_attempt})`
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "gw-hoverbar", onClick: (e) => e.stopPropagation(), children: [
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("button", { className: "gw-btn", onClick: () => rerun(run), children: [
                    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(GwIcon, { name: "refresh", size: 11 }),
                    "\u91CD\u8DD1"
                  ] }),
                  isActive && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { className: "gw-btn danger", onClick: () => cancel(run), children: "\u53D6\u6D88" }),
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("a", { className: "gw-btn", href: run.html_url, target: "_blank", rel: "noreferrer", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(GwIcon, { name: "external-link", size: 11 }),
                    "\u539F\u9875"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "gw-meta", "data-tick": tick, children: timeAgo(run.created_at) })
            ]
          },
          run.id
        );
      })
    ] })
  ] });
}
function RunIcon(props) {
  const r = props.run;
  let name2 = "circle-idle";
  let color = "var(--dsw-alias-label-tertiary)";
  let spin = false;
  if (r.status === "in_progress") {
    name2 = "loader";
    color = "var(--dsw-alias-state-attention-primary)";
    spin = true;
  } else if (r.status === "queued") {
    name2 = "loader";
    color = "var(--dsw-alias-label-secondary)";
  } else if (r.conclusion === "success") {
    name2 = "check-circle";
    color = "var(--dsw-alias-state-success-primary)";
  } else if (r.conclusion && r.conclusion !== "skipped" && r.conclusion !== "neutral") {
    name2 = "x-circle";
    color = "var(--dsw-alias-state-danger-primary)";
  }
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(GwIcon, { name: name2, className: spin ? "gw-spin" : "", style: { color } });
}

// src/inbox-view.tsx
var import_react7 = require("react");
var import_jsx_runtime7 = require("react/jsx-runtime");
function useInboxSnapshot(store) {
  return (0, import_react7.useSyncExternalStore)(store.subscribe, store.getSnapshot, store.getSnapshot);
}
var TABS = [
  { id: "issue", icon: "issue", label: "Issues" },
  { id: "pr", icon: "pr", label: "Pull requests" },
  { id: "actions", icon: "play", label: "Actions" }
];
function InboxOverlay(props) {
  const snap = useInboxSnapshot(props.store);
  const [tab, setTab] = (0, import_react7.useState)("issue");
  const unread = snap.unreadCount;
  const tabUnread = snap.unreadByKind[tab];
  const rows = snap.items.filter((it) => it.kind === tab);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "gw-inbox", "data-gw-inbox": "", children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "gw-inbox-bar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("button", { className: "gw-btn backbtn", onClick: props.onReturn, type: "button", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(GwIcon, { name: "chevron-left", size: 12 }),
        props.snapLabel ? `\u8FD4\u56DE ${props.snapLabel}` : "\u8FD4\u56DE\u539F\u4ED3\u9875"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: "gw-open-count", children: [
        "\u6536\u4EF6\u7BB1",
        unread > 0 ? ` \xB7 ${unread} \u672A\u8BFB` : ""
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        "button",
        {
          className: "gw-btn",
          type: "button",
          disabled: tabUnread === 0,
          onClick: () => props.store.markAllRead(tab),
          children: "\u672C\u9875\u5DF2\u8BFB"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "gw-tabs", children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
      "button",
      {
        type: "button",
        className: `gw-tab ${tab === t.id ? "on" : ""}`,
        onClick: () => setTab(t.id),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(GwIcon, { name: t.icon, size: 13 }),
          t.label,
          snap.unreadByKind[t.id] > 0 && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "gw-count", children: snap.unreadByKind[t.id] })
        ]
      },
      t.id
    )) }),
    snap.truncatedWatch && tab !== "actions" && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "gw-pop-hint", style: { padding: "6px 12px" }, children: "Issues / PR \u4EC5\u76D1\u89C6\u6700\u8FD1\u63A8\u9001\u7684\u6700\u591A 300 \u4E2A\u516C\u5F00\u4ED3\u3002" }),
    tab === "actions" && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "gw-pop-hint", style: { padding: "6px 12px" }, children: "Actions \u53EA\u76D1\u89C6\u5F53\u524D\u4ED3\u548C\u6700\u8FD1\u4F7F\u7528\u7684\u516C\u5F00\u4ED3(\u6700\u591A 5 \u4E2A)\u3002" }),
    snap.lastError && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "gw-errbox", children: snap.lastError }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "gw-list", children: [
      !snap.hasToken && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Empty, { children: "\u586B PAT \u540E\u76D1\u89C6\u4F60\u6709\u6743\u9650\u7684\u516C\u5F00\u4ED3\u3002" }),
      snap.hasToken && rows.length === 0 && !snap.lastError && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Empty, { children: emptyCopy(tab) }),
      snap.hasToken && rows.map((it) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
        "button",
        {
          type: "button",
          className: `gw-row${it.unread ? " gw-inbox-unread" : ""}`,
          onClick: () => props.onJump(it),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: `gw-inbox-dot${it.unread ? " on" : ""}` }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: "gw-rowmain", children: [
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "gw-rowtitle", children: it.title }),
              /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: "gw-rowsub", children: [
                it.owner,
                "/",
                it.repo,
                " ",
                it.kind === "actions" ? `run #${it.number}` : `#${it.number}`,
                " \xB7 ",
                it.user,
                " \xB7 ",
                timeAgo(it.createdAt)
              ] })
            ] })
          ]
        },
        it.key
      ))
    ] })
  ] });
}
function emptyCopy(tab) {
  if (tab === "pr") return "\u6700\u8FD1\u4E03\u5929\u6CA1\u6709\u516C\u5F00\u4ED3\u7684\u65B0 Pull request\u3002";
  if (tab === "actions") return "\u76D1\u89C6\u4ED3\u91CC\u6700\u8FD1\u6CA1\u6709\u65B0\u7684 workflow \u8FD0\u884C\u3002";
  return "\u6700\u8FD1\u4E03\u5929\u6CA1\u6709\u516C\u5F00\u4ED3\u7684\u65B0 Issue\u3002";
}
function InboxReturnBar(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "gw-inbox-return", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("button", { className: "gw-btn backbtn", type: "button", onClick: props.onReturn, children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(GwIcon, { name: "chevron-left", size: 12 }),
    "\u8FD4\u56DE ",
    props.label
  ] }) });
}

// src/workbench.tsx
var import_jsx_runtime8 = require("react/jsx-runtime");
var UICtx = (0, import_react8.createContext)({
  confirm: async () => false,
  toast: () => void 0
});
function useUI() {
  return (0, import_react8.useContext)(UICtx);
}
function errText(e) {
  return e instanceof Error ? e.message : String(e);
}
var SUBTABS = [
  { id: "code", icon: "code", label: "Code" },
  { id: "issues", icon: "issue", label: "Issues" },
  { id: "pulls", icon: "pr", label: "Pull requests" },
  { id: "actions", icon: "play", label: "Actions" }
];
function isSubtab(v) {
  return SUBTABS.some((t) => t.id === v);
}
function WorkbenchApp({ sessionId, visible, seedUrl }) {
  const [repoFull, setRepoFull] = (0, import_react8.useState)(loadRepo());
  const ref = (0, import_react8.useMemo)(() => parseRepoInput(repoFull), [repoFull]);
  const [branch, setBranch] = (0, import_react8.useState)(loadBranch());
  const [subtab, setSubtab] = (0, import_react8.useState)(() => {
    const saved = loadSubtab();
    return isSubtab(saved) ? saved : "code";
  });
  const [meta, setMeta] = (0, import_react8.useState)(null);
  const [branches, setBranches] = (0, import_react8.useState)([]);
  const [error, setError] = (0, import_react8.useState)(null);
  const [detecting, setDetecting] = (0, import_react8.useState)(false);
  const [reload, setReload] = (0, import_react8.useState)(0);
  const [rate, setRate] = (0, import_react8.useState)(null);
  const [token, setToken2] = (0, import_react8.useState)(loadToken());
  const [fontSize, setFontSize] = (0, import_react8.useState)(loadFontSize());
  const [counts, setCounts] = (0, import_react8.useState)({});
  const [repoPop, setRepoPop] = (0, import_react8.useState)(false);
  const [setPop, setSetPop] = (0, import_react8.useState)(false);
  const [deep, setDeep] = (0, import_react8.useState)(null);
  const [inboxOpen, setInboxOpen] = (0, import_react8.useState)(false);
  const [returnSnap, setReturnSnap] = (0, import_react8.useState)(null);
  const inboxStore = getInboxStore();
  const inboxSnap = useInboxSnapshot(inboxStore);
  const rootRef = (0, import_react8.useRef)(null);
  const [paneW, setPaneW] = (0, import_react8.useState)(0);
  (0, import_react8.useEffect)(() => {
    const el = rootRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      setPaneW(Math.round(entries[0]?.contentRect.width ?? 0));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  (0, import_react8.useEffect)(() => {
    ensureStyles();
    absorbHostToken({
      effect(fn) {
        fn();
      }
    });
    setToken2(loadToken());
  }, []);
  (0, import_react8.useEffect)(() => {
    if (!seedUrl) return;
    const m = parseGithubUrl(seedUrl);
    if (!m) return;
    applyRepo(ghRefKey(m.ref));
    if (m.kind === "issues") {
      switchTab("issues");
      setDeep({ tab: "issues", number: m.number });
    } else if (m.kind === "pulls") {
      switchTab("pulls");
      setDeep({ tab: "pulls", number: m.number });
    } else if (m.kind === "actions") {
      switchTab("actions");
      setDeep({ tab: "actions" });
    } else {
      switchTab("code");
      setDeep(null);
    }
  }, [seedUrl]);
  (0, import_react8.useEffect)(() => {
    if (ref) return;
    let dead = false;
    setDetecting(true);
    detectWorkspaceRepo(sessionId).then((detected) => {
      if (dead || !detected) return;
      applyRepo(ghRefKey(detected));
    }).finally(() => {
      if (!dead) setDetecting(false);
    });
    return () => {
      dead = true;
    };
  }, [sessionId]);
  (0, import_react8.useEffect)(() => {
    if (!ref) return;
    let dead = false;
    setError(null);
    getRepoMeta(ref).then((m) => {
      if (!dead) setMeta(m);
    }).catch((e) => {
      if (!dead) setError(errText(e));
    });
    getBranches(ref).then((b) => {
      if (!dead) setBranches(b);
    }).catch(() => {
    });
    return () => {
      dead = true;
    };
  }, [ref?.owner, ref?.repo]);
  (0, import_react8.useEffect)(() => {
    if (!visible) return;
    setRate(rateRemaining());
    const t = setInterval(() => setRate(rateRemaining()), 3e3);
    return () => clearInterval(t);
  }, [visible]);
  const effBranch = branch || meta?.defaultBranch || "";
  function applyRepo(fullName, opts) {
    const parsed = parseRepoInput(fullName);
    if (!parsed) return;
    const next = ghRefKey(parsed);
    setRepoFull(next);
    saveRepo(next);
    pushRecentRepo(next);
    setBranch("");
    saveBranch("");
    setMeta(null);
    setCounts({});
    if (!opts?.fromInbox) {
      setInboxOpen(false);
      setReturnSnap(null);
    }
  }
  function openInbox() {
    setRepoPop(false);
    setSetPop(false);
    if (inboxOpen) {
      setInboxOpen(false);
      return;
    }
    setReturnSnap((prev) => prev ?? {
      repoFull,
      branch: effBranch,
      subtab,
      detailNumber: deep?.number
    });
    setInboxOpen(true);
  }
  function restoreSnap() {
    const snap = returnSnap;
    setInboxOpen(false);
    setReturnSnap(null);
    if (!snap) return;
    applyRepo(snap.repoFull, { fromInbox: true });
    if (snap.branch) {
      setBranch(snap.branch);
      saveBranch(snap.branch);
    }
    switchTab(snap.subtab);
    setDeep(snap.detailNumber != null ? { tab: snap.subtab, number: snap.detailNumber } : null);
  }
  function jumpInbox(item) {
    inboxStore.markRead(item.key);
    setInboxOpen(false);
    const full = `${item.owner}/${item.repo}`;
    if (full !== repoFull) applyRepo(full, { fromInbox: true });
    if (item.kind === "pr") {
      switchTab("pulls");
      setDeep({ tab: "pulls", number: item.number });
    } else if (item.kind === "actions") {
      switchTab("actions");
      setDeep({ tab: "actions" });
    } else {
      switchTab("issues");
      setDeep({ tab: "issues", number: item.number });
    }
  }
  const switchTab = (0, import_react8.useCallback)((id) => {
    setSubtab(id);
    saveSubtab(id);
  }, []);
  const onCount = (0, import_react8.useCallback)((id) => (n) => {
    setCounts((prev) => prev[id] === n ? prev : { ...prev, [id]: n });
  }, []);
  (0, import_react8.useEffect)(() => {
    inboxStore.setExtraWatchRepo(meta?.isPrivate ? null : repoFull || null);
  }, [inboxStore, repoFull, meta?.isPrivate]);
  const [dialog, setDialog] = (0, import_react8.useState)(null);
  const [toasts, setToasts] = (0, import_react8.useState)([]);
  const seq = (0, import_react8.useRef)(0);
  const ui = (0, import_react8.useMemo)(() => ({
    confirm: (opts) => new Promise((resolve) => setDialog({ opts, resolve })),
    toast: (msg, kind = "ok") => {
      const id = ++seq.current;
      setToasts((list) => [...list, { id, msg, kind }]);
      setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), kind === "err" ? 6e3 : 3200);
    }
  }), []);
  (0, import_react8.useEffect)(() => {
    inboxStore.setOnFresh(visible ? (fresh) => {
      const top = fresh[0];
      if (top) {
        const kind = top.kind === "pr" ? "PR" : top.kind === "actions" ? "CI" : "Issue";
        const id = top.kind === "actions" ? `run #${top.number}` : `#${top.number}`;
        ui.toast(`\u65B0 ${kind} \xB7 ${top.owner}/${top.repo} ${id}`, "ok");
      }
    } : null);
    return () => inboxStore.setOnFresh(null);
  }, [visible, ui, inboxStore]);
  const header = /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "gw-header", children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(GwIcon, { name: "octo", size: 19 }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
      "button",
      {
        className: "gw-repo-btn",
        onClick: () => {
          setRepoPop((v) => !v);
          setSetPop(false);
        },
        title: "\u5207\u6362\u4EE3\u7801\u5E93",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "gw-repo-name", children: repoFull || "\u9009\u62E9\u4ED3\u5E93" }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(GwIcon, { name: "chevron-down", size: 12, style: { color: "var(--dsw-alias-label-tertiary)" } })
        ]
      }
    ),
    meta?.isPrivate && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { className: "gw-chip", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(GwIcon, { name: "lock", size: 9 }),
      "private"
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
      "select",
      {
        className: "gw-select",
        value: effBranch,
        title: "\u5206\u652F",
        onChange: (e) => {
          setBranch(e.target.value);
          saveBranch(e.target.value);
        },
        children: [
          (branches.length ? branches : meta ? [{ name: meta.defaultBranch }] : []).map((b) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: b.name, children: b.name }, b.name)),
          meta && !branches.some((b) => b.name === meta.defaultBranch) && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: meta.defaultBranch, children: meta.defaultBranch })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
      "button",
      {
        className: "gw-hbtn",
        title: "\u5728\u6D4F\u89C8\u5668\u6253\u5F00\u5F53\u524D\u4ED3\u5E93",
        onClick: () => window.open(meta?.htmlUrl || `https://github.com/${repoFull}`, "_blank", "noopener"),
        children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(GwIcon, { name: "external-link", size: 14 })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
      "button",
      {
        className: `gw-hbtn${inboxSnap.unreadCount > 0 ? " has-unread" : ""}`,
        title: inboxSnap.unreadCount > 0 ? `\u6536\u4EF6\u7BB1 \xB7 ${inboxSnap.unreadCount} \u672A\u8BFB` : "\u6536\u4EF6\u7BB1",
        onClick: openInbox,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(GwIcon, { name: "inbox", size: 14 }),
          inboxSnap.unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "gw-inbox-badge", children: inboxSnap.unreadCount > 99 ? "99+" : inboxSnap.unreadCount })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("button", { className: "gw-hbtn", title: "\u5237\u65B0", onClick: () => setReload((n) => n + 1), children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(GwIcon, { name: "refresh", size: 14 }) }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("button", { className: "gw-hbtn", title: "\u8BBE\u7F6E(Token / \u81EA\u52A8\u5237\u65B0)", onClick: () => {
      setSetPop((v) => !v);
      setRepoPop(false);
    }, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(GwIcon, { name: "gear", size: 14 }) }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
      "span",
      {
        className: `gw-dot ${token ? "ok" : ""}`,
        title: token ? "\u5DF2\u914D\u7F6E PAT(5000 \u6B21/\u5C0F\u65F6)" : "\u672A\u914D\u7F6E Token:\u533F\u540D 60 \u6B21/\u5C0F\u65F6\u4E14\u65E0\u6CD5\u5199\u64CD\u4F5C"
      }
    )
  ] });
  const body = !ref ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(SetupCard, { detecting, onSubmit: applyRepo, error }) : /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_jsx_runtime8.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "gw-tabs", children: SUBTABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("button", { className: `gw-tab ${subtab === t.id ? "on" : ""}`, onClick: () => switchTab(t.id), children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(GwIcon, { name: t.icon, size: 13 }),
      t.label,
      counts[t.id] !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "gw-count", children: counts[t.id] })
    ] }, t.id)) }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "gw-body", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
      ViewPort,
      {
        subtab,
        reloadKey: `${ghRefKey(ref)}@${effBranch}#${reload}`,
        ghRef: ref,
        branch: effBranch,
        branches,
        visible,
        onCount,
        initialDetail: deep && (subtab === "issues" && deep.tab === "issues" || subtab === "pulls" && deep.tab === "pulls") ? deep.number ?? null : null,
        onConsumeDeep: () => setDeep(null)
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "gw-footer", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { children: "api.github.com \xB7 REST v3" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { children: [
        rate != null ? `core \u5269\u4F59 ${rate}` : "\u2014",
        " \xB7 ",
        token ? "PAT \u5DF2\u914D\u7F6E" : "\u533F\u540D\u53EA\u8BFB",
        " \xB7 \u5BB9\u5668 ",
        paneW,
        "px"
      ] })
    ] })
  ] });
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(UICtx.Provider, { value: ui, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
    "div",
    {
      ref: rootRef,
      className: "gw-root",
      style: fontSize === "dsh" ? void 0 : { "--gw-body-size": fontSize },
      children: [
        header,
        returnSnap && !inboxOpen && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(InboxReturnBar, { label: returnSnap.repoFull || "\u539F\u4ED3\u9875", onReturn: restoreSnap }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { style: { flex: 1, minHeight: 0, position: "relative", display: "flex", flexDirection: "column" }, children: [
          body,
          inboxOpen && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
            InboxOverlay,
            {
              store: inboxStore,
              snapLabel: returnSnap?.repoFull ?? null,
              onReturn: restoreSnap,
              onJump: jumpInbox
            }
          )
        ] }),
        repoPop && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          RepoPopover,
          {
            recent: loadRecentRepos(),
            current: repoFull,
            hasToken: !!token,
            onPick: (full) => {
              applyRepo(full);
              setRepoPop(false);
            },
            onClose: () => setRepoPop(false)
          }
        ),
        setPop && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          SettingsPopover,
          {
            token,
            onSaveToken: (t) => {
              saveToken(t);
              setToken(t);
              setToken2(t);
              void inboxStore.pollOnce();
            },
            fontSize,
            onSaveFontSize: (v) => {
              saveFontSize(v);
              setFontSize(v);
            },
            onClose: () => setSetPop(false)
          }
        ),
        dialog && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          ConfirmDialog,
          {
            opts: dialog.opts,
            onDone: (v) => {
              dialog.resolve(v);
              setDialog(null);
            }
          }
        ),
        toasts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "gw-toasts", children: toasts.map((t) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: `gw-toast ${t.kind}`, children: t.msg }, t.id)) })
      ]
    }
  ) });
}
function ViewPort(p) {
  switch (p.subtab) {
    case "code":
      return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(CodeView, { ghRef: p.ghRef, branch: p.branch }, `c:${p.reloadKey}`);
    case "issues":
      return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(IssuesView, { ghRef: p.ghRef, visible: p.visible, onCount: p.onCount("issues"), initialDetail: p.initialDetail, onConsumeDeep: p.onConsumeDeep }, `i:${p.reloadKey}`);
    case "pulls":
      return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(PullsView, { ghRef: p.ghRef, branches: p.branches, visible: p.visible, onCount: p.onCount("pulls"), initialDetail: p.initialDetail, onConsumeDeep: p.onConsumeDeep }, `p:${p.reloadKey}`);
    case "actions":
      return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ActionsView, { ghRef: p.ghRef, visible: p.visible, onCount: p.onCount("actions") }, `a:${p.reloadKey}`);
  }
}
function SetupCard(props) {
  const [value, setValue] = (0, import_react8.useState)("");
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "gw-empty", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { style: { maxWidth: 340, width: "100%" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(GwIcon, { name: "octo", size: 40, style: { margin: "0 auto 14px", color: "var(--dsw-alias-label-tertiary)" } }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: { marginBottom: 10, lineHeight: 1.7 }, children: props.detecting ? "\u6B63\u5728\u8BC6\u522B\u5F53\u524D\u5DE5\u4F5C\u533A\u7684 GitHub \u4ED3\u5E93\u2026" : "\u8F93\u5165\u8981\u67E5\u770B\u7684\u4ED3\u5E93(owner/repo \u6216\u7C98\u8D34 URL)\u3002" }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("form", { className: "gw-formrow", onSubmit: (e) => {
      e.preventDefault();
      props.onSubmit(value);
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        "input",
        {
          className: "gw-input",
          placeholder: "owner/repo",
          value,
          onChange: (e) => setValue(e.target.value),
          autoFocus: true
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("button", { className: "gw-btn primary", type: "submit", children: "\u8F7D\u5165" })
    ] }),
    props.error && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "gw-errbox", children: props.error })
  ] }) });
}
function RepoPopover(props) {
  const [value, setValue] = (0, import_react8.useState)("");
  const [repos, setRepos] = (0, import_react8.useState)(null);
  const [loadErr, setLoadErr] = (0, import_react8.useState)(null);
  const [pub, setPub] = (0, import_react8.useState)(null);
  const [searching, setSearching] = (0, import_react8.useState)(false);
  const [hidden, setHidden] = (0, import_react8.useState)(() => loadHiddenRepos());
  const [viewer, setViewer] = (0, import_react8.useState)(null);
  const [manage, setManage] = (0, import_react8.useState)(false);
  const [recent, setRecent] = (0, import_react8.useState)(props.recent);
  const dropFromRecent = (e, full) => {
    e.stopPropagation();
    const owner = full.split("/")[0];
    if (viewer === null || owner !== viewer) hideRepo(full);
    setRecent(removeRecentRepo(full));
  };
  const wrap = (0, import_react8.useRef)(null);
  (0, import_react8.useEffect)(() => {
    if (props.hasToken) getViewerLogin().then(setViewer);
  }, [props.hasToken]);
  (0, import_react8.useEffect)(() => {
    if (!props.hasToken) return;
    let dead = false;
    getMyRepos().then((r) => {
      if (!dead) setRepos(r);
    }).catch((e) => {
      if (!dead) setLoadErr(errText(e));
    });
    return () => {
      dead = true;
    };
  }, [props.hasToken]);
  (0, import_react8.useEffect)(() => {
    const close = (e) => {
      if (!(e.target instanceof Node) || !wrap.current?.contains(e.target)) props.onClose();
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [props]);
  const q = value.trim();
  const ql = q.toLowerCase();
  (0, import_react8.useEffect)(() => {
    if (q.length < 3 || manage) {
      setPub(null);
      setSearching(false);
      return;
    }
    let dead = false;
    setSearching(true);
    const t = setTimeout(() => {
      searchPublicRepos(q).then((r) => {
        if (!dead) {
          setPub(r);
          setSearching(false);
        }
      }).catch(() => {
        if (!dead) {
          setPub([]);
          setSearching(false);
        }
      });
    }, 450);
    return () => {
      dead = true;
      clearTimeout(t);
    };
  }, [q, manage]);
  const mineAll = repos ?? [];
  const visibleMine = mineAll.filter((r) => !hidden.includes(r.fullName) || r.fullName === props.current);
  const mineFiltered = ql && visibleMine.length ? visibleMine.filter((r) => r.fullName.toLowerCase().includes(ql)).slice(0, 20) : ql ? [] : visibleMine.slice(0, 20);
  const canDrop = (r) => !!r.ownerLogin && r.ownerLogin !== viewer;
  const dropRepo = (e, fullName) => {
    e.stopPropagation();
    hideRepo(fullName);
    setHidden(loadHiddenRepos());
  };
  const submit = () => {
    const parsed = parseRepoInput(value.trim());
    if (parsed) props.onPick(`${parsed.owner}/${parsed.repo}`);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { ref: wrap, style: { position: "absolute", inset: 0, zIndex: 50 }, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "gw-pop left", style: { top: 44, position: "absolute", width: "min(380px, calc(100% - 20px))" }, children: !manage ? /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_jsx_runtime8.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("form", { className: "gw-formrow", onSubmit: (e) => {
      e.preventDefault();
      submit();
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        "input",
        {
          className: "gw-input",
          placeholder: props.hasToken ? "\u8FC7\u6EE4\u6211\u7684\u4ED3\u5E93 / \u641C\u7D22\u516C\u5F00\u4ED3\u5E93 / owner/repo" : "owner/repo \u6216\u7C98\u8D34\u4ED3\u5E93 URL",
          value,
          onChange: (e) => setValue(e.target.value),
          autoFocus: true
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("button", { className: "gw-btn primary", type: "submit", children: "\u5207\u6362" })
    ] }),
    props.recent.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_jsx_runtime8.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "gw-pop-title", style: { paddingTop: 8 }, children: "\u6700\u8FD1\u4F7F\u7528" }),
      recent.map((full) => {
        const owner = full.split("/")[0];
        const droppable = viewer === null || owner !== viewer;
        return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
          "button",
          {
            className: `gw-pop-item ${full === props.current ? "cur" : ""}`,
            onClick: () => props.onPick(full),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "gw-dot" }),
              full,
              full === props.current && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "gw-pop-cur", children: "\u5F53\u524D" }),
              droppable && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
                "span",
                {
                  className: "gw-x",
                  title: "\u79FB\u9664(\u4ED6\u4EBA\u7684\u4ED3\u540C\u65F6\u52A0\u5165\u9690\u85CF\u540D\u5355)",
                  onMouseDown: (e) => e.stopPropagation(),
                  onClick: (e) => dropFromRecent(e, full),
                  children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(GwIcon, { name: "trash", size: 10 })
                }
              )
            ]
          },
          `r:${full}`
        );
      })
    ] }),
    props.hasToken && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_jsx_runtime8.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "gw-pop-title", style: { paddingTop: 8 }, children: [
        "\u6709\u6743\u9650\u7684\u4ED3\u5E93 \xB7 \u53EF\u89C1 ",
        visibleMine.length,
        "/",
        mineAll.length
      ] }),
      !repos && !loadErr && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "gw-pop-hint", children: "\u62C9\u53D6\u5217\u8868\u2026" }),
      mineFiltered.map((r) => /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
        "button",
        {
          className: `gw-pop-item ${r.fullName === props.current ? "cur" : ""}`,
          onClick: () => props.onPick(r.fullName),
          title: r.description ?? r.fullName,
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
              GwIcon,
              {
                name: "lock",
                size: 9,
                style: { color: "var(--dsw-alias-label-tertiary)", opacity: r.isPrivate ? 1 : 0 }
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { style: { overflow: "hidden", textOverflow: "ellipsis" }, children: r.fullName }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "gw-meta", style: { marginLeft: "auto", paddingLeft: 8 }, children: timeAgo(r.pushedAt) }),
            canDrop(r) && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
              "span",
              {
                className: "gw-x",
                title: "\u4ECE\u5217\u8868\u79FB\u9664(\u4E0D\u5F71\u54CD GitHub)",
                onMouseDown: (e) => e.stopPropagation(),
                onClick: (e) => dropRepo(e, r.fullName),
                children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(GwIcon, { name: "trash", size: 10 })
              }
            )
          ]
        },
        r.fullName
      )),
      hidden.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "gw-pop-hint", style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { children: [
          "\u5DF2\u9690\u85CF ",
          hidden.length,
          " \u4E2A\u975E\u672C\u4EBA\u4ED3\u5E93"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("button", { className: "gw-btn", style: { padding: "1px 8px" }, onClick: () => setManage(true), children: "\u7BA1\u7406" })
      ] })
    ] }),
    loadErr && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "gw-errbox", children: loadErr }),
    !props.hasToken && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "gw-pop-hint", children: "\u{1F4A1} \u5728 \u2699 \u586B Token \u540E\u81EA\u52A8\u5217\u51FA\u4F60\u6709\u6743\u9650\u7684\u4ED3\u5E93\u3002" }),
    (q.length >= 3 || searching) && !manage && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_jsx_runtime8.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "gw-pop-title", style: { paddingTop: 8 }, children: [
        "\u516C\u5F00\u4ED3\u5E93\u641C\u7D22\u300C",
        q,
        "\u300D"
      ] }),
      searching && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "gw-pop-hint", children: "\u641C\u7D22\u4E2D\u2026" }),
      !searching && pub && pub.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "gw-pop-hint", children: "\u65E0\u7ED3\u679C\u3002" }),
      (pub ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
        "button",
        {
          className: "gw-pop-item",
          onClick: () => props.onPick(r.fullName),
          title: r.description ?? r.fullName,
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(GwIcon, { name: "octo", size: 11, style: { color: "var(--dsw-alias-label-tertiary)" } }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { style: { overflow: "hidden", textOverflow: "ellipsis" }, children: r.fullName }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { className: "gw-meta", style: { marginLeft: "auto", paddingLeft: 8 }, children: [
              "\u2B50 ",
              r.stars
            ] })
          ]
        },
        `p:${r.fullName}`
      )),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "gw-pop-hint", children: "\u63D0\u793A:\u56DE\u8F66\u6309\u8F93\u5165\u5185\u5BB9\u89E3\u6790\u4E3A owner/repo\u3002" })
    ] })
  ] }) : /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_jsx_runtime8.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "gw-pop-title", children: [
      "\u5DF2\u9690\u85CF\u7684\u4ED3\u5E93(",
      hidden.length,
      ")\u2014\u2014 \u4EC5\u4ECE\u672C\u5217\u8868\u79FB\u9664,\u4E0D\u5F71\u54CD GitHub"
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { style: { maxHeight: 240, overflow: "auto" }, children: [
      hidden.map((full) => /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("button", { className: "gw-pop-item", onClick: () => {
        unhideRepo(full);
        setHidden(loadHiddenRepos());
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(GwIcon, { name: "plus", size: 10 }),
        full,
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "gw-pop-cur", children: "\u6062\u590D" })
      ] }, full)),
      hidden.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "gw-pop-hint", children: "\u7A7A\u3002" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "gw-formrow", style: { justifyContent: "flex-end", paddingTop: 6 }, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("button", { className: "gw-btn", onClick: () => setManage(false), children: "\u8FD4\u56DE\u5217\u8868" }) })
  ] }) }) });
}
function SettingsPopover(props) {
  const [tok, setTok] = (0, import_react8.useState)(props.token);
  const [autoSec, setAutoSec] = (0, import_react8.useState)(loadAutoRefreshSec());
  const [fontSel, setFontSel] = (0, import_react8.useState)(props.fontSize);
  const wrap = (0, import_react8.useRef)(null);
  (0, import_react8.useEffect)(() => {
    const close = (e) => {
      if (!(e.target instanceof Node) || !wrap.current?.contains(e.target)) props.onClose();
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [props]);
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { ref: wrap, style: { position: "absolute", inset: 0, zIndex: 50 }, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "gw-pop right", style: { top: 44, position: "absolute" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "gw-pop-title", children: "GitHub \u8BBF\u95EE\u4EE4\u724C(Personal Access Token)" }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "gw-field", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
      "input",
      {
        className: "gw-input",
        type: "password",
        placeholder: "ghp_\u2026 / github_pat_\u2026(\u7559\u7A7A = \u533F\u540D\u53EA\u8BFB)",
        value: tok,
        onChange: (e) => setTok(e.target.value),
        autoFocus: true
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "gw-field", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("label", { children: "PR / Actions \u81EA\u52A8\u5237\u65B0\u5468\u671F(\u79D2,0 = \u5173\u95ED)" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        "input",
        {
          className: "gw-input",
          type: "number",
          min: 0,
          max: 120,
          value: autoSec,
          onChange: (e) => setAutoSec(Number(e.target.value) || 0)
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "gw-field", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("label", { children: "\u6B63\u6587\u5B57\u53F7(Issue / PR \u5217\u8868\u4E0E\u8BE6\u60C5)" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
        "select",
        {
          className: "gw-input",
          value: fontSel,
          onChange: (e) => setFontSel(e.target.value),
          style: { appearance: "auto", paddingRight: 8 },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: "dsh", children: "\u8DDF\u968F DSH \u4FA7\u8FB9\u680F(12px,\u9ED8\u8BA4)" }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: "13", children: "13 px(\u7D27\u51D1)" }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: "14", children: "14 px" }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: "14", children: "14 px(\u5927)" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "gw-formrow", style: { justifyContent: "flex-end", paddingTop: 6 }, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("button", { className: "gw-btn primary", onClick: () => {
      props.onSaveToken(tok.trim());
      saveAutoRefreshSec(autoSec);
      props.onSaveFontSize(fontSel);
      props.onClose();
    }, children: "\u4FDD\u5B58" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "gw-pop-hint", children: [
      "\u7EC6\u7C92\u5EA6 Token \u6743\u9650:Contents(R)\u3001Issues(RW)\u3001Pull requests(RW)\u3001Actions(RW); \u7ECF\u5178 Token \u7528 ",
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("code", { children: "repo" }),
      "\u3002\u4EC5\u4FDD\u5B58\u5728\u672C\u6D4F\u89C8\u5668,\u4E0D\u7ECF\u8FC7\u4EFB\u4F55\u670D\u52A1\u7AEF\u3002"
    ] })
  ] }) });
}
function ConfirmDialog(props) {
  const { opts } = props;
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "gw-scrim", onMouseDown: (e) => {
    if (e.target === e.currentTarget) props.onDone(false);
  }, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "gw-dialog", children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h4", { children: opts.title }),
    opts.body && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { children: opts.body }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "gw-dialog-actions", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("button", { className: "gw-btn", onClick: () => props.onDone(false), children: "\u53D6\u6D88" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        "button",
        {
          className: `gw-btn ${opts.danger ? "danger" : "primary"}`,
          autoFocus: true,
          onClick: () => props.onDone(true),
          children: opts.confirmText ?? "\u786E\u8BA4"
        }
      )
    ] })
  ] }) });
}

// src/mount.ts
var TAB_ID = "github-workbench:repo";
function lookup(ctx) {
  try {
    const svc = ctx.betterSidebar;
    if (svc && typeof svc.registerTab === "function") return svc;
  } catch {
  }
  return void 0;
}
function mountWorkbench(ctx) {
  ensureStyles();
  const stopInbox = getInboxStore().start();
  let tabDisposer = null;
  let standaloneDisposer = null;
  let settled = false;
  const started = Date.now();
  let nativeDisposer = null;
  let seatDisposer;
  if (typeof ctx.inject === "function") {
    try {
      const seat = ctx.inject(["sidebarRightTabs", "sidebarRight"], (injected2) => {
        const tabs = injected2.get("sidebarRightTabs");
        if (tabs === void 0 || typeof tabs.register !== "function") return;
        try {
          tabDisposer?.();
          tabDisposer = null;
        } catch {
        }
        try {
          standaloneDisposer?.();
          standaloneDisposer = null;
        } catch {
        }
        settled = true;
        const disposeType = tabs.register({
          id: "dsh-github-workbench",
          kind: "github-workbench",
          priority: "extension",
          title: () => inboxTitle(),
          guide: [{
            order: 55,
            title: () => "GitHub \u5DE5\u4F5C\u53F0",
            icon: (props) => iconFor("octo")(props.size ?? 16)
          }]
        });
        const slots = ctx.slots;
        const disposeSlots = [];
        if (slots !== void 0) {
          disposeSlots.push(
            slots.inject("sidebar.right.pane.tab", () => slots.register({
              name: "sidebar.right.pane.tab",
              key: "dsh-github-workbench",
              inject: (sessionId) => ({ sessionId })
            }, NativeBody)),
            slots.inject("sidebar.right.pane.tab.title", () => slots.register({
              name: "sidebar.right.pane.tab.title",
              key: "dsh-github-workbench",
              inject: () => ({})
            }, NativeTitle))
          );
        } else {
          console.warn("[github-workbench] ctx.slots \u4E0D\u53EF\u7528,\u539F\u751F\u5185\u5BB9\u4F53\u672A\u6CE8\u518C");
        }
        nativeDisposer = () => {
          for (const dispose of disposeSlots.reverse()) dispose();
          disposeType();
          nativeDisposer = null;
        };
        return nativeDisposer;
      });
      seatDisposer = typeof seat?.dispose === "function" ? () => seat.dispose?.() : void 0;
    } catch (error) {
      console.warn("[github-workbench] \u539F\u751F\u53F3\u4FA7\u680F\u7B49\u5F85\u542F\u52A8\u5931\u8D25:", error);
    }
  }
  const immediate = nativeDisposer === null ? lookup(ctx) : void 0;
  if (immediate) {
    const disposeTab = mountAsTab(ctx, immediate);
    return () => {
      stopInbox();
      disposeTab();
      seatDisposer?.();
    };
  }
  const dbg = window;
  dbg.__GW_DEBUG__ = {
    startedAt: (/* @__PURE__ */ new Date()).toISOString(),
    ticks: 0,
    lookupOk: false,
    marker: false,
    lastLookupError: "",
    settled: "",
    ctxKeysAttempted: []
  };
  const probeLookup = () => {
    try {
      const svc = ctx.betterSidebar;
      dbg.__GW_DEBUG__.lookupOk = !!(svc && typeof svc.registerTab === "function");
      return svc && typeof svc.registerTab === "function" ? svc : void 0;
    } catch (e) {
      dbg.__GW_DEBUG__.lastLookupError = String(e);
      return void 0;
    }
  };
  const sidebarMarker = () => typeof document !== "undefined" && !!document.querySelector("[data-dsh-better-sidebar]");
  const timer = setInterval(() => {
    const d = dbg.__GW_DEBUG__;
    d.ticks = d.ticks + 1;
    d.marker = typeof document !== "undefined" && !!document.querySelector("[data-dsh-better-sidebar]");
    const reg = nativeDisposer === null ? probeLookup() : void 0;
    if (reg) {
      clearInterval(timer);
      if (standaloneDisposer) {
        console.info("[github-workbench] betterSidebar \u670D\u52A1\u8FDF\u5230:\u5378\u8F7D\u72EC\u7ACB\u9762\u677F,\u5207\u6362\u4E3A\u4FA7\u8FB9\u680F\u9875\u7B7E");
        standaloneDisposer();
        standaloneDisposer = null;
      }
      tabDisposer = mountAsTab(ctx, reg);
      settled = true;
      d.settled = "tab";
      return;
    }
    if (settled) return;
    if (d.marker) return;
    if (Date.now() - started > 5e3 && nativeDisposer === null) {
      clearInterval(timer);
      standaloneDisposer = mountStandalone();
      settled = true;
      d.settled = "standalone";
      const lateCheck = setInterval(() => {
        const lateReg = nativeDisposer === null ? lookup(ctx) : void 0;
        if (lateReg && standaloneDisposer) {
          clearInterval(lateCheck);
          console.info("[github-workbench] \u72EC\u7ACB\u9762\u677F\u8FD0\u884C\u4E2D\u68C0\u6D4B\u5230 betterSidebar,\u81EA\u52A8\u5207\u6362\u4E3A\u4FA7\u8FB9\u680F\u9875\u7B7E");
          standaloneDisposer?.();
          standaloneDisposer = null;
          tabDisposer = mountAsTab(ctx, lateReg);
        } else if (!standaloneDisposer) {
          clearInterval(lateCheck);
        }
      }, 2e3);
    }
  }, 250);
  return () => {
    clearInterval(timer);
    stopInbox();
    tabDisposer?.();
    standaloneDisposer?.();
    nativeDisposer?.();
    seatDisposer?.();
  };
}
function inboxTitle() {
  const n = getInboxStore().unreadCount();
  return n > 0 ? `GitHub \u5DE5\u4F5C\u53F0 (${n})` : "GitHub \u5DE5\u4F5C\u53F0";
}
function NativeBody(props) {
  return (0, import_react9.createElement)(WorkbenchApp, {
    sessionId: props.sessionId ?? "",
    visible: true
  });
}
function NativeTitle() {
  const [title, setTitle] = (0, import_react9.useState)(inboxTitle());
  (0, import_react9.useEffect)(() => getInboxStore().subscribe(() => setTitle(inboxTitle())), []);
  return title;
}
function bindInboxBadge(registry) {
  const paint = () => {
    const n = getInboxStore().unreadCount();
    const title = n > 0 ? `GitHub \u5DE5\u4F5C\u53F0 (${n})` : "GitHub \u5DE5\u4F5C\u53F0";
    const tabs = registry.getSnapshot?.().state?.tabs ?? [];
    const ours = tabs.filter((t) => t.type === TAB_ID);
    if (ours.length === 0) {
      try {
        registry.updateTab?.(TAB_ID, { title });
      } catch {
      }
      return;
    }
    for (const t of ours) {
      try {
        registry.updateTab?.(t.id, { title });
      } catch {
      }
    }
  };
  return getInboxStore().subscribe(paint);
}
function mountAsTab(ctx, registry) {
  const descriptor = {
    id: TAB_ID,
    title: inboxTitle,
    icon: iconFor("octo"),
    order: 55,
    badge: () => {
      const n = getInboxStore().unreadCount();
      return n > 0 ? n : null;
    },
    // 认领聊天中的 github.com 链接(需宿主「接管外链」开关开启):
    // 每个链接铸造独立实例,URL 落在 tab.path,由 WorkbenchApp 解析深链
    urlTarget: (url) => /(^|\.)github\.com$/.test(url.hostname),
    createTab: (state) => ({
      tab: {
        id: `${TAB_ID}:link:${state.nextBrowser}`,
        type: TAB_ID,
        title: "GitHub \u5DE5\u4F5C\u53F0"
      },
      patch: { nextBrowser: (state.nextBrowser ?? 0) + 1 }
    }),
    // 原生齿轮设置:token 兜底来源与自动刷新周期(值经 absorbHostToken 合并进组件)
    settings: {
      toggles: [
        { key: "browserInterceptLinks", title: "\u63A5\u7BA1\u804A\u5929\u4E2D\u7684 GitHub \u94FE\u63A5\u5230\u5DE5\u4F5C\u53F0" },
        { key: "browserInterceptHttps", title: "\u63A5\u7BA1 https:// \u94FE\u63A5" }
      ],
      pluginToggles: [
        { key: "token", title: "GitHub Token(PAT)", type: "text" },
        { key: "autoRefreshSec", title: "\u81EA\u52A8\u5237\u65B0\u5468\u671F(\u79D2)", type: "number", min: 0, max: 120 }
      ]
    },
    component: (props) => (0, import_react9.createElement)(WorkbenchApp, {
      sessionId: props.scope.sessionId,
      cwd: props.scope.cwd,
      visible: props.visible,
      seedUrl: props.tab.path
    })
  };
  let disposer;
  try {
    disposer = registry.registerTab(descriptor);
  } catch (error) {
    console.warn("[github-workbench] registerTab \u5931\u8D25:", error);
  }
  const unsubBadge = bindInboxBadge(registry);
  return () => {
    unsubBadge();
    disposer?.();
  };
}
function mountStandalone() {
  const host = document.createElement("div");
  host.setAttribute("data-github-workbench-host", "");
  host.style.cssText = [
    "position:fixed",
    "top:0",
    "right:0",
    "bottom:0",
    "z-index:40",
    "display:flex",
    "align-items:stretch",
    "pointer-events:none"
  ].join(";");
  document.body.appendChild(host);
  const width = loadPanelWidth();
  const panel = document.createElement("div");
  panel.style.cssText = [
    "pointer-events:auto",
    "width:100%",
    "height:100%",
    "position:relative",
    "display:flex",
    "flex-direction:column",
    "background:var(--dsw-alias-bg-layer-1,#16181d)",
    "border-left:1px solid var(--dsw-alias-border-l1,rgba(128,128,128,.2))",
    "box-shadow:-12px 0 32px rgba(0,0,0,.22)",
    "color:var(--dsw-alias-label-primary,#e6edf3)",
    `font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif`
  ].join(";");
  host.appendChild(panel);
  const inner = document.createElement("div");
  inner.style.cssText = "flex:1;min-height:0;position:relative";
  panel.appendChild(inner);
  const toggle = document.createElement("button");
  toggle.title = "\u6536\u8D77 GitHub \u5DE5\u4F5C\u53F0";
  toggle.textContent = "\u2039";
  toggle.style.cssText = [
    "position:absolute",
    "left:-13px",
    "top:50%",
    "transform:translateY(-50%)",
    "z-index:5",
    "width:26px",
    "height:52px",
    "border:1px solid var(--dsw-alias-border-l1,rgba(128,128,128,.25))",
    "border-radius:8px",
    "background:var(--dsw-alias-bg-layer-2,#1c1f26)",
    "color:var(--dsw-alias-label-secondary,#9aa1ab)",
    "cursor:pointer",
    "font-size:14px",
    "padding:0"
  ].join(";");
  panel.appendChild(toggle);
  const edge = document.createElement("button");
  edge.textContent = "\u{1F419} \u5DE5\u4F5C\u53F0";
  edge.title = "\u5C55\u5F00 GitHub \u5DE5\u4F5C\u53F0";
  edge.style.cssText = [
    "position:fixed",
    "right:0",
    "top:50%",
    "transform:translateY(-50%)",
    "z-index:41",
    "writing-mode:vertical-rl",
    "padding:16px 7px",
    "letter-spacing:.18em",
    "font-size:12px",
    "border:1px solid var(--dsw-alias-border-l1,rgba(128,128,128,.25))",
    "border-right:none",
    "border-radius:10px 0 0 10px",
    "background:var(--dsw-alias-bg-layer-2,#1c1f26)",
    "color:var(--dsw-alias-label-secondary,#9aa1ab)",
    "cursor:pointer",
    "display:none",
    "pointer-events:auto"
  ].join(";");
  document.body.appendChild(edge);
  const resizer = document.createElement("div");
  resizer.style.cssText = [
    "position:absolute",
    "left:-3px",
    "top:0",
    "bottom:0",
    "width:6px",
    "cursor:col-resize",
    "z-index:6",
    "pointer-events:auto"
  ].join(";");
  panel.appendChild(resizer);
  const state = {
    root: (0, import_client.createRoot)(inner),
    host,
    observer: null,
    visible: true,
    collapsed: false
  };
  function render() {
    state.root.render((0, import_react9.createElement)(WorkbenchApp, {
      sessionId: "",
      // 独立形态无会话上下文:跳过工作区自动识别,由用户手动输入仓库
      visible: state.visible
    }));
  }
  function setCollapsed(v) {
    state.collapsed = v;
    host.style.display = v ? "none" : "flex";
    edge.style.display = v ? "inline-flex" : "none";
  }
  toggle.addEventListener("click", () => setCollapsed(true));
  edge.addEventListener("click", () => setCollapsed(false));
  let dragStartX = 0, startWidth = width;
  function onDown(e) {
    dragStartX = e.clientX;
    startWidth = panel.getBoundingClientRect().width;
    resizer.setPointerCapture(e.pointerId);
    e.preventDefault();
  }
  function onMove(e) {
    if (!resizer.hasPointerCapture(e.pointerId)) return;
    const w = Math.min(720, Math.max(320, Math.round(startWidth + (dragStartX - e.clientX))));
    host.style.width = `${w}px`;
  }
  function onUp(e) {
    if (!resizer.hasPointerCapture(e.pointerId)) return;
    resizer.releasePointerCapture(e.pointerId);
    savePanelWidth(panel.getBoundingClientRect().width);
  }
  resizer.addEventListener("pointerdown", onDown);
  resizer.addEventListener("pointermove", onMove);
  resizer.addEventListener("pointerup", onUp);
  if (typeof IntersectionObserver !== "undefined") {
    state.observer = new IntersectionObserver((entries) => {
      state.visible = entries[0]?.isIntersecting ?? true;
      render();
    }, { threshold: 0 });
    state.observer.observe(panel);
  }
  host.style.width = `${width}px`;
  render();
  const paintEdge = () => {
    const n = getInboxStore().unreadCount();
    edge.textContent = n > 0 ? `\u{1F419} \u5DE5\u4F5C\u53F0 \xB7 ${n}` : "\u{1F419} \u5DE5\u4F5C\u53F0";
    if (n > 0) edge.setAttribute("data-gw-inbox-unread", String(n));
    else edge.removeAttribute("data-gw-inbox-unread");
  };
  paintEdge();
  const unsubEdge = getInboxStore().subscribe(paintEdge);
  return () => {
    unsubEdge();
    state.observer?.disconnect();
    state.root.unmount();
    host.remove();
    edge.remove();
  };
}

// src/client.ts
var name = "github-workbench";
var inject = ["slots"];
function apply(ctx) {
  ctx.effect(() => mountWorkbench(ctx), "github-workbench: dual-mode mount");
}

return module.exports;
}});
