"use client";

import { useMemo, useState } from "react";
import Readout from "./Readout";

const PRESETS = {
  "x3-x-2": {
    label: "f(x) = x³ − x − 2",
    fn: (x) => x ** 3 - x - 2,
    defaultA: 1,
    defaultB: 2,
  },
  "cos-x-x": {
    label: "f(x) = cos(x) − x",
    fn: (x) => Math.cos(x) - x,
    defaultA: 0,
    defaultB: 1,
  },
  "x2-2": {
    label: "f(x) = x² − 2  (raiz de √2)",
    fn: (x) => x ** 2 - 2,
    defaultA: 0,
    defaultB: 2,
  },
};

function runBisection(fn, a0, b0, tol, maxIter) {
  const rows = [];
  let a = a0;
  let b = b0;
  let c = (a + b) / 2;

  if (fn(a) * fn(b) > 0) {
    return { rows, invalid: true };
  }

  for (let i = 1; i <= maxIter; i++) {
    c = (a + b) / 2;
    const fc = fn(c);
    const error = Math.abs(b - a) / 2;
    rows.push({ i, a, b, c, fc, error });

    if (Math.abs(fc) < 1e-12 || error < tol) {
      break;
    }

    if (fn(a) * fc < 0) {
      b = c;
    } else {
      a = c;
    }
  }

  return { rows, invalid: false };
}

// Amostra a função num intervalo e devolve um path SVG (linha poligonal).
function buildPath(fn, domainMin, domainMax, toSvgX, toSvgY, samples = 120) {
  let d = "";
  for (let i = 0; i <= samples; i++) {
    const x = domainMin + ((domainMax - domainMin) * i) / samples;
    const y = fn(x);
    const px = toSvgX(x);
    const py = toSvgY(y);
    d += `${i === 0 ? "M" : "L"} ${px.toFixed(2)} ${py.toFixed(2)} `;
  }
  return d;
}

export default function ConvergencePlot() {
  const [presetKey, setPresetKey] = useState("x3-x-2");
  const preset = PRESETS[presetKey];

  const [a, setA] = useState(preset.defaultA);
  const [b, setB] = useState(preset.defaultB);
  const [tol, setTol] = useState(0.001);
  const [maxIter, setMaxIter] = useState(15);

  function handlePresetChange(key) {
    setPresetKey(key);
    setA(PRESETS[key].defaultA);
    setB(PRESETS[key].defaultB);
  }

  const { rows, invalid } = useMemo(
    () => runBisection(preset.fn, Number(a), Number(b), Number(tol), Number(maxIter)),
    [preset, a, b, tol, maxIter]
  );

  const last = rows[rows.length - 1];
  const converged = last ? last.error < Number(tol) : false;

  // --- geometria do gráfico SVG ---
  const width = 560;
  const height = 260;
  const padding = 30;

  const domainMin = Math.min(Number(a), Number(b)) - 0.3;
  const domainMax = Math.max(Number(a), Number(b)) + 0.3;

  const yValues = rows.length
    ? rows.flatMap((r) => [r.fc])
    : [preset.fn(domainMin), preset.fn(domainMax)];
  const sampledYs = [];
  for (let i = 0; i <= 40; i++) {
    const x = domainMin + ((domainMax - domainMin) * i) / 40;
    sampledYs.push(preset.fn(x));
  }
  const allYs = [...yValues, ...sampledYs, 0];
  const yMin = Math.min(...allYs) - 0.3;
  const yMax = Math.max(...allYs) + 0.3;

  const toSvgX = (x) =>
    padding + ((x - domainMin) / (domainMax - domainMin)) * (width - 2 * padding);
  const toSvgY = (y) =>
    height - padding - ((y - yMin) / (yMax - yMin)) * (height - 2 * padding);

  const curvePath = buildPath(preset.fn, domainMin, domainMax, toSvgX, toSvgY);
  const zeroY = toSvgY(0);

  return (
    <div className="widget">
      <div className="widget-controls">
        <label>
          função
          <select
            value={presetKey}
            onChange={(e) => handlePresetChange(e.target.value)}
          >
            {Object.entries(PRESETS).map(([key, p]) => (
              <option key={key} value={key}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          a
          <input
            type="number"
            step="0.1"
            value={a}
            onChange={(e) => setA(e.target.value)}
          />
        </label>
        <label>
          b
          <input
            type="number"
            step="0.1"
            value={b}
            onChange={(e) => setB(e.target.value)}
          />
        </label>
        <label>
          tolerância
          <input
            type="number"
            step="0.0001"
            value={tol}
            onChange={(e) => setTol(e.target.value)}
          />
        </label>
        <label>
          máx. iterações
          <input
            type="number"
            step="1"
            min="1"
            max="50"
            value={maxIter}
            onChange={(e) => setMaxIter(e.target.value)}
          />
        </label>
      </div>

      {invalid ? (
        <p style={{ color: "var(--error)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
          f(a) e f(b) têm o mesmo sinal — não há garantia de raiz nesse intervalo pelo
          teorema de Bolzano. Ajuste a e b.
        </p>
      ) : (
        <>
          <div className="widget-svg-wrap">
            <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height}>
              <line
                x1={padding}
                y1={zeroY}
                x2={width - padding}
                y2={zeroY}
                stroke="var(--grid-line)"
                strokeWidth="1"
              />
              <path
                d={curvePath}
                fill="none"
                stroke="var(--ink)"
                strokeWidth="1.6"
              />
              {rows.map((r) => (
                <circle
                  key={r.i}
                  cx={toSvgX(r.c)}
                  cy={toSvgY(r.fc)}
                  r={r.i === rows.length ? 4.5 : 2.5}
                  fill={r.i === rows.length ? "var(--error)" : "var(--accent)"}
                  opacity={r.i === rows.length ? 1 : 0.55}
                />
              ))}
            </svg>
          </div>

          {last && (
            <div style={{ marginBottom: 16 }}>
              <Readout
                iteration={`${rows.length} / ${maxIter}`}
                error={last.error.toExponential(3)}
                status={converged ? "ok" : "pending"}
              />
            </div>
          )}

          <div className="widget-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>i</th>
                  <th>a</th>
                  <th>b</th>
                  <th>c = (a+b)/2</th>
                  <th>f(c)</th>
                  <th>erro</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.i}>
                    <td>{r.i}</td>
                    <td>{r.a.toFixed(5)}</td>
                    <td>{r.b.toFixed(5)}</td>
                    <td>{r.c.toFixed(5)}</td>
                    <td>{r.fc.toFixed(5)}</td>
                    <td>{r.error.toExponential(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
