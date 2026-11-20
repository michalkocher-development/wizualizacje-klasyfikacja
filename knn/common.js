/* Wizualizacje klasyfikacji – Koło Naukowe Data Science
   Wspólna biblioteka: dane, modele (KNN, drzewo, las, GBM), rysowanie.
   Brak zależności zewnętrznych – działa jako zwykła strona statyczna (GitHub Pages). */
(function (global) {
'use strict';

const COLORS = ['#e4572e', '#2b6fd6', '#2fa37a'];
const IRIS = [[5.1,3.5,1.4,0.2,0],[4.9,3.0,1.4,0.2,0],[4.7,3.2,1.3,0.2,0],[4.6,3.1,1.5,0.2,0],[5.0,3.6,1.4,0.2,0],[5.4,3.9,1.7,0.4,0],[4.6,3.4,1.4,0.3,0],[5.0,3.4,1.5,0.2,0],[4.4,2.9,1.4,0.2,0],[4.9,3.1,1.5,0.1,0],[5.4,3.7,1.5,0.2,0],[4.8,3.4,1.6,0.2,0],[4.8,3.0,1.4,0.1,0],[4.3,3.0,1.1,0.1,0],[5.8,4.0,1.2,0.2,0],[5.7,4.4,1.5,0.4,0],[5.4,3.9,1.3,0.4,0],[5.1,3.5,1.4,0.3,0],[5.7,3.8,1.7,0.3,0],[5.1,3.8,1.5,0.3,0],[5.4,3.4,1.7,0.2,0],[5.1,3.7,1.5,0.4,0],[4.6,3.6,1.0,0.2,0],[5.1,3.3,1.7,0.5,0],[4.8,3.4,1.9,0.2,0],[5.0,3.0,1.6,0.2,0],[5.0,3.4,1.6,0.4,0],[5.2,3.5,1.5,0.2,0],[5.2,3.4,1.4,0.2,0],[4.7,3.2,1.6,0.2,0],[4.8,3.1,1.6,0.2,0],[5.4,3.4,1.5,0.4,0],[5.2,4.1,1.5,0.1,0],[5.5,4.2,1.4,0.2,0],[4.9,3.1,1.5,0.2,0],[5.0,3.2,1.2,0.2,0],[5.5,3.5,1.3,0.2,0],[4.9,3.6,1.4,0.1,0],[4.4,3.0,1.3,0.2,0],[5.1,3.4,1.5,0.2,0],[5.0,3.5,1.3,0.3,0],[4.5,2.3,1.3,0.3,0],[4.4,3.2,1.3,0.2,0],[5.0,3.5,1.6,0.6,0],[5.1,3.8,1.9,0.4,0],[4.8,3.0,1.4,0.3,0],[5.1,3.8,1.6,0.2,0],[4.6,3.2,1.4,0.2,0],[5.3,3.7,1.5,0.2,0],[5.0,3.3,1.4,0.2,0],[7.0,3.2,4.7,1.4,1],[6.4,3.2,4.5,1.5,1],[6.9,3.1,4.9,1.5,1],[5.5,2.3,4.0,1.3,1],[6.5,2.8,4.6,1.5,1],[5.7,2.8,4.5,1.3,1],[6.3,3.3,4.7,1.6,1],[4.9,2.4,3.3,1.0,1],[6.6,2.9,4.6,1.3,1],[5.2,2.7,3.9,1.4,1],[5.0,2.0,3.5,1.0,1],[5.9,3.0,4.2,1.5,1],[6.0,2.2,4.0,1.0,1],[6.1,2.9,4.7,1.4,1],[5.6,2.9,3.6,1.3,1],[6.7,3.1,4.4,1.4,1],[5.6,3.0,4.5,1.5,1],[5.8,2.7,4.1,1.0,1],[6.2,2.2,4.5,1.5,1],[5.6,2.5,3.9,1.1,1],[5.9,3.2,4.8,1.8,1],[6.1,2.8,4.0,1.3,1],[6.3,2.5,4.9,1.5,1],[6.1,2.8,4.7,1.2,1],[6.4,2.9,4.3,1.3,1],[6.6,3.0,4.4,1.4,1],[6.8,2.8,4.8,1.4,1],[6.7,3.0,5.0,1.7,1],[6.0,2.9,4.5,1.5,1],[5.7,2.6,3.5,1.0,1],[5.5,2.4,3.8,1.1,1],[5.5,2.4,3.7,1.0,1],[5.8,2.7,3.9,1.2,1],[6.0,2.7,5.1,1.6,1],[5.4,3.0,4.5,1.5,1],[6.0,3.4,4.5,1.6,1],[6.7,3.1,4.7,1.5,1],[6.3,2.3,4.4,1.3,1],[5.6,3.0,4.1,1.3,1],[5.5,2.5,4.0,1.3,1],[5.5,2.6,4.4,1.2,1],[6.1,3.0,4.6,1.4,1],[5.8,2.6,4.0,1.2,1],[5.0,2.3,3.3,1.0,1],[5.6,2.7,4.2,1.3,1],[5.7,3.0,4.2,1.2,1],[5.7,2.9,4.2,1.3,1],[6.2,2.9,4.3,1.3,1],[5.1,2.5,3.0,1.1,1],[5.7,2.8,4.1,1.3,1],[6.3,3.3,6.0,2.5,2],[5.8,2.7,5.1,1.9,2],[7.1,3.0,5.9,2.1,2],[6.3,2.9,5.6,1.8,2],[6.5,3.0,5.8,2.2,2],[7.6,3.0,6.6,2.1,2],[4.9,2.5,4.5,1.7,2],[7.3,2.9,6.3,1.8,2],[6.7,2.5,5.8,1.8,2],[7.2,3.6,6.1,2.5,2],[6.5,3.2,5.1,2.0,2],[6.4,2.7,5.3,1.9,2],[6.8,3.0,5.5,2.1,2],[5.7,2.5,5.0,2.0,2],[5.8,2.8,5.1,2.4,2],[6.4,3.2,5.3,2.3,2],[6.5,3.0,5.5,1.8,2],[7.7,3.8,6.7,2.2,2],[7.7,2.6,6.9,2.3,2],[6.0,2.2,5.0,1.5,2],[6.9,3.2,5.7,2.3,2],[5.6,2.8,4.9,2.0,2],[7.7,2.8,6.7,2.0,2],[6.3,2.7,4.9,1.8,2],[6.7,3.3,5.7,2.1,2],[7.2,3.2,6.0,1.8,2],[6.2,2.8,4.8,1.8,2],[6.1,3.0,4.9,1.8,2],[6.4,2.8,5.6,2.1,2],[7.2,3.0,5.8,1.6,2],[7.4,2.8,6.1,1.9,2],[7.9,3.8,6.4,2.0,2],[6.4,2.8,5.6,2.2,2],[6.3,2.8,5.1,1.5,2],[6.1,2.6,5.6,1.4,2],[7.7,3.0,6.1,2.3,2],[6.3,3.4,5.6,2.4,2],[6.4,3.1,5.5,1.8,2],[6.0,3.0,4.8,1.8,2],[6.9,3.1,5.4,2.1,2],[6.7,3.1,5.6,2.4,2],[6.9,3.1,5.1,2.3,2],[5.8,2.7,5.1,1.9,2],[6.8,3.2,5.9,2.3,2],[6.7,3.3,5.7,2.5,2],[6.7,3.0,5.2,2.3,2],[6.3,2.5,5.0,1.9,2],[6.5,3.0,5.2,2.0,2],[6.2,3.4,5.4,2.3,2],[5.9,3.0,5.1,1.8,2]];

/* ---------- losowość ---------- */
function rng(seed) {
  let a = (seed >>> 0) || 1;
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function randn(r) {
  let u = 0, v = 0;
  while (u === 0) u = r();
  while (v === 0) v = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
function shuffle(arr, r) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- zbiory danych ---------- */
const DATASETS = {
  iris_sepal: 'Iris – działki kielicha (3 klasy)',
  iris_petal: 'Iris – płatki (3 klasy)',
  moons: 'Dwa półksiężyce (2 klasy)',
  blobs: 'Nakładające się chmury (3 klasy)',
  blobs2: 'Nakładające się chmury (2 klasy)',
  imbalanced: 'Niezbalansowane (5% klasy pozytywnej)',
  iris_binary: 'Iris – Versicolor vs Virginica (2 klasy)'
};

function makeDataset(key, seed) {
  const r = rng((seed || 11) * 7919 + 13);
  const X = [], y = [];
  let d;
  const irisLabels = ['Setosa', 'Versicolor', 'Virginica'];
  if (key === 'iris_sepal' || key === 'iris_petal') {
    const a = key === 'iris_sepal' ? 0 : 2;
    IRIS.forEach(row => { X.push([row[a], row[a + 1]]); y.push(row[4]); });
    d = { classes: 3, labels: irisLabels,
      axes: key === 'iris_sepal' ? ['długość działki (cm)', 'szerokość działki (cm)'] : ['długość płatka (cm)', 'szerokość płatka (cm)'] };
  } else if (key === 'iris_binary') {
    IRIS.forEach(row => { if (row[4] > 0) { X.push([row[2], row[3]]); y.push(row[4] - 1); } });
    d = { classes: 2, labels: ['Versicolor', 'Virginica'], axes: ['długość płatka (cm)', 'szerokość płatka (cm)'] };
  } else if (key === 'moons') {
    for (let i = 0; i < 200; i++) {
      const t = Math.PI * r();
      if (i % 2 === 0) { X.push([Math.cos(t) + 0.22 * randn(r), Math.sin(t) + 0.22 * randn(r)]); y.push(0); }
      else { X.push([1 - Math.cos(t) + 0.22 * randn(r), 0.5 - Math.sin(t) + 0.22 * randn(r)]); y.push(1); }
    }
    d = { classes: 2, labels: ['Klasa A', 'Klasa B'], axes: ['cecha 1', 'cecha 2'] };
  } else if (key === 'blobs') {
    const cs = [[-1.0, 0.1], [1.1, 0.9], [0.3, -1.3]];
    cs.forEach((c, k) => { for (let i = 0; i < 55; i++) { X.push([c[0] + 0.8 * randn(r), c[1] + 0.8 * randn(r)]); y.push(k); } });
    d = { classes: 3, labels: ['Klasa A', 'Klasa B', 'Klasa C'], axes: ['cecha 1', 'cecha 2'] };
  } else if (key === 'blobs2') {
    for (let i = 0; i < 90; i++) { X.push([-0.7 + 0.9 * randn(r), -0.4 + 0.9 * randn(r)]); y.push(0); }
    for (let i = 0; i < 90; i++) { X.push([0.8 + 0.9 * randn(r), 0.5 + 0.9 * randn(r)]); y.push(1); }
    d = { classes: 2, labels: ['Klasa A', 'Klasa B'], axes: ['cecha 1', 'cecha 2'] };
  } else { // imbalanced
    for (let i = 0; i < 380; i++) { X.push([0.9 * randn(r), 0.9 * randn(r)]); y.push(0); }
    for (let i = 0; i < 20; i++) { X.push([1.7 + 0.55 * randn(r), 1.3 + 0.55 * randn(r)]); y.push(1); }
    d = { classes: 2, labels: ['Legalna', 'Oszustwo'], axes: ['cecha 1', 'cecha 2'] };
  }
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  X.forEach(p => { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); });
  const px = (x1 - x0) * 0.08, py = (y1 - y0) * 0.08;
  d.xlim = [x0 - px, x1 + px];
  d.ylim = [y0 - py, y1 + py];
  d.X = X; d.y = y; d.key = key; d.name = DATASETS[key];
  return d;
}

function stratifiedSplit(ds, seed, testFrac) {
  const r = rng((seed || 1) * 104729 + 5);
  const byClass = [];
  for (let c = 0; c < ds.classes; c++) byClass.push([]);
  ds.y.forEach((c, i) => byClass[c].push(i));
  const tr = [], te = [];
  byClass.forEach(list => {
    const s = shuffle(list, r);
    const nt = Math.max(1, Math.round(s.length * testFrac));
    s.forEach((i, k) => (k < nt ? te : tr).push(i));
  });
  const pick = (idx) => ({ X: idx.map(i => ds.X[i]), y: idx.map(i => ds.y[i]) });
  const a = pick(shuffle(tr, r)), b = pick(shuffle(te, r));
  return { Xtr: a.X, ytr: a.y, Xte: b.X, yte: b.y };
}

/* ---------- metryki ---------- */
function accuracy(pred, y) {
  let ok = 0;
  for (let i = 0; i < y.length; i++) if (pred[i] === y[i]) ok++;
  return y.length ? ok / y.length : 0;
}
function argmax(a) {
  let b = 0;
  for (let i = 1; i < a.length; i++) if (a[i] > a[b]) b = i;
  return b;
}

/* ---------- KNN ---------- */
function dist(a, b, metric) {
  const dx = a[0] - b[0], dy = a[1] - b[1];
  return metric === 'manhattan' ? Math.abs(dx) + Math.abs(dy) : Math.sqrt(dx * dx + dy * dy);
}
/* zwraca posortowaną listę [odległość, indeks] */
function knnSorted(Xtr, x, metric, skip) {
  const out = [];
  for (let i = 0; i < Xtr.length; i++) {
    if (i === skip) continue;
    out.push([dist(Xtr[i], x, metric), i]);
  }
  out.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  return out;
}
function knnVotes(sorted, ytr, K, nc, weighted) {
  const v = new Array(nc).fill(0);
  const k = Math.min(K, sorted.length);
  for (let j = 0; j < k; j++) v[ytr[sorted[j][1]]] += weighted ? 1 / (sorted[j][0] + 1e-9) : 1;
  return v;
}
function knnProba(Xtr, ytr, nc, K, metric, weighted, x) {
  const v = knnVotes(knnSorted(Xtr, x, metric), ytr, K, nc, weighted);
  const s = v.reduce((a, b) => a + b, 0) || 1;
  return v.map(t => t / s);
}

/* ---------- drzewo decyzyjne (CART, gini) ---------- */
function bestSplit(X, y, nc, idx, feats, minLeaf) {
  let best = null;
  const n = idx.length;
  const tot = new Array(nc).fill(0);
  idx.forEach(i => tot[y[i]]++);
  for (const f of feats) {
    const order = idx.slice().sort((a, b) => X[a][f] - X[b][f]);
    const left = new Array(nc).fill(0);
    const right = tot.slice();
    for (let k = 0; k < n - 1; k++) {
      const i = order[k];
      left[y[i]]++; right[y[i]]--;
      const v = X[i][f], v2 = X[order[k + 1]][f];
      if (v === v2) continue;
      const nl = k + 1, nr = n - nl;
      if (nl < minLeaf || nr < minLeaf) continue;
      let gl = 1, gr = 1;
      for (let c = 0; c < nc; c++) { gl -= (left[c] / nl) ** 2; gr -= (right[c] / nr) ** 2; }
      const score = (nl * gl + nr * gr) / n;
      if (!best || score < best.score - 1e-12) best = { f: f, thr: (v + v2) / 2, score: score };
    }
  }
  return best;
}
function buildTree(X, y, nc, o, rand) {
  const opts = Object.assign({ maxDepth: 3, minLeaf: 1, maxFeatures: null }, o || {});
  const d = X[0].length;
  let nid = 0, maxd = 0, leaves = 0;
  function rec(idx, depth) {
    const counts = new Array(nc).fill(0);
    idx.forEach(i => counts[y[i]]++);
    const n = idx.length;
    let gini = 1;
    counts.forEach(c => { gini -= (c / n) ** 2; });
    const node = { id: nid++, depth: depth, n: n, counts: counts, gini: Math.max(0, gini), pred: argmax(counts) };
    maxd = Math.max(maxd, depth);
    if (depth >= opts.maxDepth || gini < 1e-12 || n < 2 * opts.minLeaf) { leaves++; return node; }
    let feats = [];
    for (let f = 0; f < d; f++) feats.push(f);
    if (opts.maxFeatures && opts.maxFeatures < d && rand) feats = shuffle(feats, rand).slice(0, opts.maxFeatures);
    let s = bestSplit(X, y, nc, idx, feats, opts.minLeaf);
    if ((!s || s.score >= gini - 1e-12) && feats.length < d) {
      s = bestSplit(X, y, nc, idx, Array.from({ length: d }, (_, f) => f), opts.minLeaf);
    }
    if (!s || s.score >= gini - 1e-12) { leaves++; return node; }
    node.f = s.f; node.thr = s.thr;
    const L = [], R = [];
    idx.forEach(i => (X[i][s.f] <= s.thr ? L : R).push(i));
    node.left = rec(L, depth + 1);
    node.right = rec(R, depth + 1);
    return node;
  }
  const root = rec(X.map((_, i) => i), 0);
  return { root: root, nc: nc, depth: maxd, leaves: leaves, nodes: nid };
}
function treeLeaf(tree, x) {
  let n = tree.root;
  while (n.left) n = x[n.f] <= n.thr ? n.left : n.right;
  return n;
}
function treeProba(tree, x) {
  const n = treeLeaf(tree, x);
  return n.counts.map(c => c / n.n);
}
function treePath(tree, x) {
  const p = [];
  let n = tree.root;
  p.push(n);
  while (n.left) { n = x[n.f] <= n.thr ? n.left : n.right; p.push(n); }
  return p;
}

/* ---------- las losowy ---------- */
function buildForest(X, y, nc, o) {
  const opts = Object.assign({ nTrees: 50, maxDepth: 5, minLeaf: 1, maxFeatures: 1, bootstrap: true, seed: 1 }, o || {});
  const trees = [];
  for (let t = 0; t < opts.nTrees; t++) {
    const r = rng(opts.seed * 100003 + t * 7919 + 3);
    let Xb = X, yb = y;
    if (opts.bootstrap) {
      const idx = [];
      for (let i = 0; i < X.length; i++) idx.push(Math.floor(r() * X.length));
      Xb = idx.map(i => X[i]); yb = idx.map(i => y[i]);
    }
    trees.push(buildTree(Xb, yb, nc, { maxDepth: opts.maxDepth, minLeaf: opts.minLeaf, maxFeatures: opts.maxFeatures }, r));
  }
  return { trees: trees, nc: nc, opts: opts };
}
function forestProba(forest, x, m) {
  const k = Math.min(m == null ? forest.trees.length : m, forest.trees.length);
  const acc = new Array(forest.nc).fill(0);
  for (let t = 0; t < k; t++) {
    const p = treeProba(forest.trees[t], x);
    for (let c = 0; c < forest.nc; c++) acc[c] += p[c];
  }
  return acc.map(v => v / Math.max(1, k));
}

/* ---------- gradient boosting (klasyfikacja binarna, logloss) ---------- */
function sigmoid(z) { return 1 / (1 + Math.exp(-z)); }
function buildRegTree(X, r, h, o) {
  const opts = Object.assign({ maxDepth: 2, minLeaf: 3 }, o || {});
  function leafVal(idx) {
    let sr = 0, sh = 0;
    idx.forEach(i => { sr += r[i]; sh += h[i]; });
    return Math.max(-4, Math.min(4, sr / (sh + 1e-6)));
  }
  function rec(idx, depth) {
    const node = { value: leafVal(idx), n: idx.length };
    if (depth >= opts.maxDepth || idx.length < 2 * opts.minLeaf) return node;
    let S = 0;
    idx.forEach(i => { S += r[i]; });
    const n = idx.length;
    let best = null;
    for (let f = 0; f < X[0].length; f++) {
      const order = idx.slice().sort((a, b) => X[a][f] - X[b][f]);
      let SL = 0;
      for (let k = 0; k < n - 1; k++) {
        SL += r[order[k]];
        const v = X[order[k]][f], v2 = X[order[k + 1]][f];
        if (v === v2) continue;
        const nl = k + 1, nr = n - nl;
        if (nl < opts.minLeaf || nr < opts.minLeaf) continue;
        const SR = S - SL;
        const gain = SL * SL / nl + SR * SR / nr - S * S / n;
        if (!best || gain > best.gain + 1e-12) best = { f: f, thr: (v + v2) / 2, gain: gain };
      }
    }
    if (!best || best.gain < 1e-9) return node;
    node.f = best.f; node.thr = best.thr;
    const L = [], R = [];
    idx.forEach(i => (X[i][best.f] <= best.thr ? L : R).push(i));
    node.left = rec(L, depth + 1);
    node.right = rec(R, depth + 1);
    return node;
  }
  return rec(X.map((_, i) => i), 0);
}
function regPredict(node, x) {
  while (node.left) node = x[node.f] <= node.thr ? node.left : node.right;
  return node.value;
}
function logloss(F, y) {
  let s = 0;
  for (let i = 0; i < y.length; i++) {
    const p = Math.min(1 - 1e-12, Math.max(1e-12, sigmoid(F[i])));
    s += -(y[i] * Math.log(p) + (1 - y[i]) * Math.log(1 - p));
  }
  return s / y.length;
}
function accF(F, y) {
  let ok = 0;
  for (let i = 0; i < y.length; i++) if ((F[i] > 0 ? 1 : 0) === y[i]) ok++;
  return ok / y.length;
}
/* Trenuje do nEst drzew i zapamiętuje stan po każdym etapie (do suwaka) */
function gbmFit(Xtr, ytr, Xte, yte, gridPts, o) {
  const opts = Object.assign({ nEst: 300, lr: 0.1, maxDepth: 2, minLeaf: 3 }, o || {});
  const n = Xtr.length;
  const p0 = Math.min(0.999, Math.max(0.001, ytr.reduce((a, b) => a + b, 0) / n));
  const F0 = Math.log(p0 / (1 - p0));
  let Ftr = new Array(n).fill(F0), Fte = new Array(Xte.length).fill(F0);
  let Fg = new Float32Array(gridPts.length).fill(F0);
  const st = { grid: [Fg], trainLoss: [logloss(Ftr, ytr)], testLoss: [logloss(Fte, yte)],
    trainAcc: [accF(Ftr, ytr)], testAcc: [accF(Fte, yte)], teF: [Fte.slice()], trF: [Ftr.slice()], trees: [], F0: F0, opts: opts };
  for (let m = 0; m < opts.nEst; m++) {
    const res = new Array(n), hh = new Array(n);
    for (let i = 0; i < n; i++) { const p = sigmoid(Ftr[i]); res[i] = ytr[i] - p; hh[i] = p * (1 - p); }
    const tree = buildRegTree(Xtr, res, hh, { maxDepth: opts.maxDepth, minLeaf: opts.minLeaf });
    st.trees.push(tree);
    Ftr = Ftr.map((f, i) => f + opts.lr * regPredict(tree, Xtr[i]));
    Fte = Fte.map((f, i) => f + opts.lr * regPredict(tree, Xte[i]));
    const ng = new Float32Array(gridPts.length);
    for (let g = 0; g < gridPts.length; g++) ng[g] = Fg[g] + opts.lr * regPredict(tree, gridPts[g]);
    Fg = ng;
    st.grid.push(Fg);
    st.trainLoss.push(logloss(Ftr, ytr)); st.testLoss.push(logloss(Fte, yte));
    st.trainAcc.push(accF(Ftr, ytr)); st.testAcc.push(accF(Fte, yte));
    st.teF.push(Fte.slice()); st.trF.push(Ftr.slice());
  }
  return st;
}

/* ---------- rysowanie ---------- */
function hexToRgb(h) {
  const v = parseInt(h.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}
function mixRgb(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }

function Plot(canvas, ds, opts) {
  this.c = canvas; this.ds = ds;
  this.opts = Object.assign({ margin: 34, grid: 110 }, opts || {});
  this.resize();
}
Plot.prototype.setDataset = function (ds) { this.ds = ds; };
Plot.prototype.resize = function () {
  const dpr = global.devicePixelRatio || 1;
  const r = this.c.getBoundingClientRect();
  const w = Math.max(60, r.width), h = Math.max(60, r.height);
  this.c.width = Math.round(w * dpr); this.c.height = Math.round(h * dpr);
  this.ctx = this.c.getContext('2d');
  this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  this.w = w; this.h = h;
  const m = this.opts.margin;
  this.l = m + 6; this.t = 10; this.r = w - 10; this.b = h - m;
};
Plot.prototype.sx = function (x) { const d = this.ds; return this.l + (x - d.xlim[0]) / (d.xlim[1] - d.xlim[0]) * (this.r - this.l); };
Plot.prototype.sy = function (y) { const d = this.ds; return this.b - (y - d.ylim[0]) / (d.ylim[1] - d.ylim[0]) * (this.b - this.t); };
Plot.prototype.ix = function (px) { const d = this.ds; return d.xlim[0] + (px - this.l) / (this.r - this.l) * (d.xlim[1] - d.xlim[0]); };
Plot.prototype.iy = function (py) { const d = this.ds; return d.ylim[0] + (this.b - py) / (this.b - this.t) * (d.ylim[1] - d.ylim[0]); };
Plot.prototype.gridPoints = function () {
  const G = this.opts.grid, d = this.ds, pts = [];
  for (let j = 0; j < G; j++) for (let i = 0; i < G; i++) {
    pts.push([d.xlim[0] + (i + 0.5) / G * (d.xlim[1] - d.xlim[0]), d.ylim[1] - (j + 0.5) / G * (d.ylim[1] - d.ylim[0])]);
  }
  return pts;
};
Plot.prototype.clear = function () {
  const c = ctxOf(this);
  c.clearRect(0, 0, this.w, this.h);
  c.fillStyle = '#ffffff';
  c.fillRect(this.l, this.t, this.r - this.l, this.b - this.t);
};
function ctxOf(p) { return p.ctx; }
/* probsList: tablica prawdopodobieństw dla punktów z gridPoints() */
Plot.prototype.regions = function (probsList, mode) {
  const G = this.opts.grid;
  const off = document.createElement('canvas');
  off.width = G; off.height = G;
  const octx = off.getContext('2d');
  const img = octx.createImageData(G, G);
  const cols = COLORS.map(hexToRgb);
  for (let k = 0; k < probsList.length; k++) {
    const p = probsList[k];
    let rgb, alpha;
    if (mode === 'blend' && p.length === 2) {
      rgb = mixRgb(cols[0], cols[1], p[1]);
      alpha = 0.18 + 0.42 * Math.abs(p[1] - 0.5) * 2;
    } else {
      const c = argmax(p);
      rgb = cols[c];
      const conf = (p[c] - 1 / p.length) / (1 - 1 / p.length);
      alpha = 0.22 + 0.33 * conf;
    }
    img.data[4 * k] = rgb[0]; img.data[4 * k + 1] = rgb[1]; img.data[4 * k + 2] = rgb[2];
    img.data[4 * k + 3] = Math.round(alpha * 255);
  }
  octx.putImageData(img, 0, 0);
  const c = this.ctx;
  c.save();
  c.beginPath(); c.rect(this.l, this.t, this.r - this.l, this.b - this.t); c.clip();
  c.imageSmoothingEnabled = false;
  c.drawImage(off, this.l, this.t, this.r - this.l, this.b - this.t);
  c.restore();
};
Plot.prototype.axes = function () {
  const c = this.ctx, d = this.ds;
  c.strokeStyle = '#9aa9cc'; c.lineWidth = 1;
  c.strokeRect(this.l + 0.5, this.t + 0.5, this.r - this.l, this.b - this.t);
  c.fillStyle = '#4a5a82'; c.font = '12px system-ui, sans-serif';
  c.textAlign = 'center';
  c.fillText(d.axes[0], (this.l + this.r) / 2, this.h - 6);
  c.save(); c.translate(12, (this.t + this.b) / 2); c.rotate(-Math.PI / 2);
  c.fillText(d.axes[1], 0, 0); c.restore();
  c.font = '11px system-ui, sans-serif';
  for (let i = 0; i <= 4; i++) {
    const x = d.xlim[0] + (d.xlim[1] - d.xlim[0]) * i / 4;
    const y = d.ylim[0] + (d.ylim[1] - d.ylim[0]) * i / 4;
    c.textAlign = 'center'; c.fillText(x.toFixed(1), this.sx(x), this.b + 14);
    c.textAlign = 'right'; c.fillText(y.toFixed(1), this.l - 4, this.sy(y) + 4);
  }
};
Plot.prototype.points = function (X, y, kind, radius) {
  const c = this.ctx, r = radius || 5;
  for (let i = 0; i < X.length; i++) {
    const px = this.sx(X[i][0]), py = this.sy(X[i][1]);
    c.beginPath();
    if (kind === 'test') {
      c.rect(px - r, py - r, 2 * r, 2 * r);
      c.fillStyle = '#fff'; c.fill();
      c.lineWidth = 2.2; c.strokeStyle = COLORS[y[i]]; c.stroke();
    } else {
      c.arc(px, py, r, 0, 2 * Math.PI);
      c.fillStyle = COLORS[y[i]]; c.fill();
      c.lineWidth = 1.5; c.strokeStyle = '#ffffff'; c.stroke();
    }
  }
};
Plot.prototype.query = function (x, color) {
  const c = this.ctx, px = this.sx(x[0]), py = this.sy(x[1]);
  c.save();
  c.beginPath(); c.arc(px, py, 9, 0, 2 * Math.PI);
  c.fillStyle = color || '#111'; c.fill();
  c.lineWidth = 3; c.strokeStyle = '#fff'; c.stroke();
  c.fillStyle = '#fff'; c.font = 'bold 12px system-ui'; c.textAlign = 'center'; c.fillText('?', px, py + 4);
  c.restore();
};
Plot.prototype.line = function (a, b, color, width, dash) {
  const c = this.ctx;
  c.save();
  c.beginPath(); c.rect(this.l, this.t, this.r - this.l, this.b - this.t); c.clip();
  c.beginPath(); c.moveTo(this.sx(a[0]), this.sy(a[1])); c.lineTo(this.sx(b[0]), this.sy(b[1]));
  c.strokeStyle = color; c.lineWidth = width || 1; c.setLineDash(dash || []); c.stroke();
  c.restore();
};
Plot.prototype.eventPoint = function (ev) {
  const r = this.c.getBoundingClientRect();
  const t = ev.touches ? ev.touches[0] : ev;
  const px = t.clientX - r.left, py = t.clientY - r.top;
  if (px < this.l || px > this.r || py < this.t || py > this.b) return null;
  return [this.ix(px), this.iy(py)];
};

/* prosty wykres liniowy (krzywe dokładności / straty) */
function LineChart(canvas, o) {
  this.c = canvas; this.o = Object.assign({ xlabel: '', ylabel: '', ymin: 0, ymax: 1, xmin: 0, xmax: 1, margin: 40 }, o || {});
  this.resize();
}
LineChart.prototype.resize = function () {
  const dpr = global.devicePixelRatio || 1;
  const r = this.c.getBoundingClientRect();
  this.w = Math.max(60, r.width); this.h = Math.max(60, r.height);
  this.c.width = Math.round(this.w * dpr); this.c.height = Math.round(this.h * dpr);
  this.ctx = this.c.getContext('2d'); this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
};
LineChart.prototype.draw = function (series, marker, extra) {
  const o = this.o, c = this.ctx, m = o.margin;
  const l = m + 4, t = 12, r = this.w - 12, b = this.h - m;
  const sx = x => l + (x - o.xmin) / (o.xmax - o.xmin) * (r - l);
  const sy = y => b - (y - o.ymin) / (o.ymax - o.ymin) * (b - t);
  c.clearRect(0, 0, this.w, this.h);
  c.fillStyle = '#fff'; c.fillRect(l, t, r - l, b - t);
  c.strokeStyle = '#e3e9f7'; c.lineWidth = 1; c.fillStyle = '#4a5a82'; c.font = '11px system-ui, sans-serif';
  for (let i = 0; i <= 4; i++) {
    const v = o.ymin + (o.ymax - o.ymin) * i / 4;
    c.beginPath(); c.moveTo(l, sy(v)); c.lineTo(r, sy(v)); c.stroke();
    c.textAlign = 'right'; c.fillText(v.toFixed(o.ydigits == null ? 2 : o.ydigits), l - 4, sy(v) + 4);
  }
  for (let i = 0; i <= 5; i++) {
    const v = o.xmin + (o.xmax - o.xmin) * i / 5;
    c.textAlign = 'center'; c.fillText(o.xdigits ? v.toFixed(o.xdigits) : Math.round(v), sx(v), b + 14);
  }
  c.strokeStyle = '#9aa9cc'; c.strokeRect(l + 0.5, t + 0.5, r - l, b - t);
  c.textAlign = 'center'; c.font = '12px system-ui, sans-serif';
  c.fillText(o.xlabel, (l + r) / 2, this.h - 5);
  c.save(); c.translate(11, (t + b) / 2); c.rotate(-Math.PI / 2); c.fillText(o.ylabel, 0, 0); c.restore();
  series.forEach(s => {
    c.beginPath();
    s.y.forEach((v, i) => { const x = sx(s.x ? s.x[i] : o.xmin + i); if (i === 0) c.moveTo(x, sy(v)); else c.lineTo(x, sy(v)); });
    c.strokeStyle = s.color; c.lineWidth = s.width || 2.2; c.setLineDash(s.dash || []); c.stroke(); c.setLineDash([]);
  });
  if (extra) extra(c, sx, sy, { l: l, t: t, r: r, b: b });
  if (marker != null) {
    c.beginPath(); c.moveTo(sx(marker), t); c.lineTo(sx(marker), b);
    c.strokeStyle = '#1f3b8a'; c.lineWidth = 1.5; c.setLineDash([5, 4]); c.stroke(); c.setLineDash([]);
  }
  // legenda
  let lx = l + 8;
  c.font = '12px system-ui, sans-serif'; c.textAlign = 'left';
  series.forEach(s => {
    if (!s.name) return;
    c.strokeStyle = s.color; c.lineWidth = 3; c.setLineDash(s.dash || []);
    c.beginPath(); c.moveTo(lx, t + 12); c.lineTo(lx + 18, t + 12); c.stroke(); c.setLineDash([]);
    c.fillStyle = '#2b3a63'; c.fillText(s.name, lx + 23, t + 16);
    lx += 30 + c.measureText(s.name).width;
  });
};

/* wykres drzewa jako SVG */
function drawTreeSVG(container, tree, ds, highlight) {
  const nc = tree.nc;
  const hl = new Set((highlight || []).map(n => n.id));
  let leafIdx = 0, maxD = 0;
  const pos = {};
  (function place(n) {
    maxD = Math.max(maxD, n.depth);
    if (!n.left) { pos[n.id] = { x: leafIdx++, y: n.depth }; return; }
    place(n.left); place(n.right);
    pos[n.id] = { x: (pos[n.left.id].x + pos[n.right.id].x) / 2, y: n.depth };
  })(tree.root);
  const dx = 84, dy = 92, bw = 76, bh = 54;
  const W = Math.max(1, leafIdx) * dx + 10, H = (maxD + 1) * dy + 14;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  svg.setAttribute('width', '100%');
  svg.style.maxHeight = '100%';
  const px = n => pos[n.id].x * dx + dx / 2 + 5, py = n => pos[n.id].y * dy + 8;
  const edges = document.createElementNS(ns, 'g'), nodes = document.createElementNS(ns, 'g');
  (function walk(n) {
    if (!n.left) return;
    [n.left, n.right].forEach((ch, k) => {
      const ln = document.createElementNS(ns, 'line');
      ln.setAttribute('x1', px(n)); ln.setAttribute('y1', py(n) + bh);
      ln.setAttribute('x2', px(ch)); ln.setAttribute('y2', py(ch));
      const on = hl.has(n.id) && hl.has(ch.id);
      ln.setAttribute('stroke', on ? '#1f3b8a' : '#9aa9cc');
      ln.setAttribute('stroke-width', on ? 3 : 1.5);
      edges.appendChild(ln);
      const t = document.createElementNS(ns, 'text');
      t.setAttribute('x', (px(n) + px(ch)) / 2 + (k === 0 ? -8 : 8));
      t.setAttribute('y', (py(n) + bh + py(ch)) / 2 + 3);
      t.setAttribute('font-size', 11); t.setAttribute('fill', '#4a5a82');
      t.setAttribute('text-anchor', k === 0 ? 'end' : 'start');
      t.textContent = k === 0 ? 'tak' : 'nie';
      edges.appendChild(t);
      walk(ch);
    });
  })(tree.root);
  (function walk(n) {
    const g = document.createElementNS(ns, 'g');
    const rect = document.createElementNS(ns, 'rect');
    rect.setAttribute('x', px(n) - bw / 2); rect.setAttribute('y', py(n));
    rect.setAttribute('width', bw); rect.setAttribute('height', bh); rect.setAttribute('rx', 9);
    const col = hexToRgb(COLORS[n.pred]);
    const purity = 1 - n.gini / (1 - 1 / nc);
    const mix = mixRgb([255, 255, 255], col, 0.25 + 0.6 * purity);
    rect.setAttribute('fill', 'rgb(' + mix.map(Math.round).join(',') + ')');
    rect.setAttribute('stroke', hl.has(n.id) ? '#1f3b8a' : '#9aa9cc');
    rect.setAttribute('stroke-width', hl.has(n.id) ? 3.5 : 1.2);
    g.appendChild(rect);
    const lines = n.left
      ? [ds.axes[n.f].split(' ')[0] + ' ' + (n.f === 0 ? 'x₁' : 'x₂') + ' ≤ ' + n.thr.toFixed(2), 'gini ' + n.gini.toFixed(2), 'n = ' + n.n]
      : [ds.labels[n.pred], 'gini ' + n.gini.toFixed(2), 'n = ' + n.n];
    lines.forEach((s, i) => {
      const t = document.createElementNS(ns, 'text');
      t.setAttribute('x', px(n)); t.setAttribute('y', py(n) + 17 + i * 15);
      t.setAttribute('text-anchor', 'middle'); t.setAttribute('font-size', i === 0 ? 11.5 : 10.5);
      t.setAttribute('font-weight', i === 0 ? '700' : '400'); t.setAttribute('fill', '#1d2a4d');
      t.textContent = s;
      g.appendChild(t);
    });
    nodes.appendChild(g);
    if (n.left) { walk(n.left); walk(n.right); }
  })(tree.root);
  svg.appendChild(edges); svg.appendChild(nodes);
  container.innerHTML = '';
  container.appendChild(svg);
}

/* ---------- drobne narzędzia UI ---------- */
function $(id) { return document.getElementById(id); }
function onResize(fn) {
  let t = null;
  global.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(fn, 120); });
}
function fillSelect(sel, keys) {
  sel.innerHTML = '';
  keys.forEach(k => { const o = document.createElement('option'); o.value = k; o.textContent = DATASETS[k]; sel.appendChild(o); });
}
function legendHTML(ds, showTest) {
  let h = '';
  ds.labels.forEach((l, i) => { h += '<span class="lg"><i style="background:' + COLORS[i] + '"></i>' + l + '</span>'; });
  h += '<span class="lg"><i class="dot"></i>zbiór treningowy</span>';
  if (showTest) h += '<span class="lg"><i class="sq"></i>zbiór testowy</span>';
  return h;
}
function pct(v) { return (v * 100).toFixed(1).replace('.', ',') + '%'; }

global.SKN = {
  COLORS, DATASETS, rng, randn, shuffle, makeDataset, stratifiedSplit, accuracy, argmax,
  knnSorted, knnVotes, knnProba, buildTree, treeProba, treeLeaf, treePath,
  buildForest, forestProba, gbmFit, sigmoid, Plot, LineChart, drawTreeSVG,
  $, onResize, fillSelect, legendHTML, pct, hexToRgb, mixRgb
};
})(typeof window !== 'undefined' ? window : globalThis);
