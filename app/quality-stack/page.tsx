"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const rows = ["Requirements specification", "Requirements review", "Unit tests", "Unit integration tests", "Code analysis", "PR review by AI", "PR review by Dev/QA", "SCA", "SAST", "DAST", "API tests", "E2E tests", "Exploratory tests", "Performance tests", "Monitoring"];
type Cell = { row: number; col: number; tone?: "standard" | "light" };

const attributeHeaders = ["IQ", "Func", "Secur", "UX", "Perf"];
const attributeCells: Cell[] = [[1, 0], [1, 1], [1, 2], [1, 3], [2, 1], [3, 1], [4, 0], [4, 1], [5, 0], [5, 1], [5, 2], [6, 0], [6, 1], [6, 2], [6, 3], [7, 2], [8, 2], [9, 2], [10, 1], [10, 2], [11, 1], [11, 2], [11, 3], [12, 1], [12, 2], [12, 3], [13, 4], [14, 1], [14, 2], [14, 4]].map(([row, col]) => ({ row, col }));
const environmentHeaders = ["DEV", "CI", "TST", "ACC", "PRD"];
const environmentCells: Cell[] = [[2, 0], [2, 1], [3, 0], [3, 1], [4, 0], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1], [9, 2], [9, 3], [10, 0], [10, 1], [10, 2], [10, 3], [11, 0], [11, 1], [11, 2], [11, 3], [12, 0], [12, 1], [12, 2], [12, 3], [12, 4], [13, 2], [13, 3], [14, 2], [14, 3], [14, 4]].map(([row, col]) => ({ row, col }));
const applicationHeaders = ["GUI", "API", "LOGIC", "DAL", "DB", "INFRA"];
const applicationToneRows: Array<Array<Cell["tone"] | null>> = [
  ["standard", "standard", "standard", "standard", "standard", "standard"],
  ["light", "light", "light", "light", "light", "light"],
  ["standard", "light", "standard", "light", null, null],
  ["light", "light", "light", "light", null, null],
  ["light", "light", "light", "light", "light", "light"],
  ["light", "light", "light", "light", "light", "light"],
  ["light", "light", "light", "light", "light", "light"],
  ["standard", "standard", "standard", "standard", "standard", "standard"],
  ["light", "light", "light", "light", "light", "light"],
  ["light", "light", "light", "light", "light", "light"],
  [null, "standard", "standard", "standard", "standard", "standard"],
  ["standard", "standard", "standard", "standard", "standard", "standard"],
  ["light", "light", "light", "light", "light", "light"],
  ["light", "light", "light", "light", "light", "light"],
  ["standard", "standard", "standard", "standard", "standard", "standard"],
];
const applicationCells: Cell[] = applicationToneRows.flatMap((tones, row) =>
  tones.flatMap((tone, col) => tone ? [{ row, col, tone }] : [])
);

// Startstate per tone, zodat elke cel in zijn oorspronkelijke kleur opent:
// state 0 = grijs, state 1 = lichtgroen, state 2 = donkergroen. Klikcyclus: 0 -> 1 -> 2 -> 0.
const initialStates: Record<string, number> = Object.fromEntries(
  applicationCells.map((cell) => [`application-${cell.row}-${cell.col}`, cell.tone === "light" ? 1 : 2]),
);

type TableProps = {
  id: string;
  title: string;
  x: number;
  headers: string[];
  cells: Cell[];
  cellWidth?: number;
  interactive?: boolean;
  selected: Record<string, number>;
  onSelect: (id: string) => void;
};

function StackTable({ id, title, x, headers, cells, cellWidth = 41, interactive = false, selected, onSelect }: TableProps) {
  const headerY = 36;
  const gridY = 57;
  const rowHeight = 22;
  const cellMap = new Map(cells.map((cell) => [`${cell.row}-${cell.col}`, cell]));
  return (
    <g className="quality-table">
      <text x={x + 2} y="29" className="quality-table-title">
        {title}
      </text>
      {headers.map((header, col) => (
        <g key={header}>
          <rect
            x={x + col * cellWidth}
            y={headerY}
            width={cellWidth}
            height="21"
            className="quality-header-cell"
          />
          <text
            x={x + col * cellWidth + cellWidth / 2}
            y="51"
            className="quality-header-text"
          >
            {header}
          </text>
        </g>
      ))}
      {rows.map((_, row) =>
        headers.map((_, col) => {
          const cell = cellMap.get(`${row}-${col}`);
          const key = `${id}-${row}-${col}`;
          const state = selected[key] ?? 0;
          const enabled = interactive && Boolean(cell);
          return (
            <g
              key={key}
              className={enabled ? "quality-interactive-cell" : undefined}
              onClick={enabled ? () => onSelect(key) : undefined}
              role={enabled ? "button" : undefined}
              tabIndex={enabled ? 0 : undefined}
              aria-label={
                enabled
                  ? `${title}, ${rows[row]}, ${headers[col]}`
                  : undefined
              }
              onKeyDown={
                enabled
                  ? (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelect(key);
                      }
                    }
                  : undefined
              }
            >
              <rect
                x={x + col * cellWidth}
                y={gridY + row * rowHeight}
                width={cellWidth}
                height={rowHeight}
                className={`quality-grid-cell ${
                  cell
                    ? `${interactive
                        ? `quality-cell tone-${cell.tone ?? "standard"} state-${state}`
                        : "quality-blue-cell"}`
                    : ""
                }`}
              />
            </g>
          );
        })
      )}
      <line
        x1={x}
        x2={x + headers.length * cellWidth}
        y1={gridY}
        y2={gridY}
        className="quality-section-line"
      />
      {[1, 3, 6, 9, 12, 13].map((row) => (
        <line
          key={row}
          x1={x}
          x2={x + headers.length * cellWidth}
          y1={gridY + (row + 1) * rowHeight}
          y2={gridY + (row + 1) * rowHeight}
          className="quality-section-line"
        />
      ))}
    </g>
  );
}

export default function QualityStackPage() {
  const [selected, setSelected] = useState<Record<string, number>>(initialStates);
  const select = (id: string) =>
    setSelected((current) => ({
      ...current,
      [id]: ((current[id] ?? 0) + 1) % 3,
    }));

  return (
    <main>
      <header className="site-header">
        <div className="company-banner">
          <Image src="/images/banner.png" width={142} height={50} alt="Company" />
        </div>
        <nav className="site-nav" aria-label="Paginanavigatie">
          <Link href="/">Development workflow</Link>
        </nav>
      </header>
      <section className="quality-stack-shell" aria-label="Quality stack">
        <svg
          className="quality-stack"
          viewBox="0 0 895 405"
          role="img"
          aria-label="Quality stack met klikbare applicatielaag"
        >
          <text
            x="14"
            y="29"
            className="application-quality-title"
          >
            &nbsp;
          </text>
          <rect
            x="12"
            y="57"
            width="214"
            height="330"
            className="quality-label-background"
          />
          {rows.map((label, row) => (
            <text
              key={label}
              x="16"
              y={70 + row * 22}
              className="quality-row-label"
            >
              {label}
            </text>
          ))}
          {rows.map((_, row) => (
            <line
              key={row}
              x1="12"
              x2="226"
              y1={57 + (row + 1) * 22}
              y2={57 + (row + 1) * 22}
              className="quality-label-line"
            />
          ))}
          <line
            x1="12"
            x2="226"
            y1="57"
            y2="57"
            className="quality-section-line"
          />
          {[1, 3, 6, 9, 12, 13].map((row) => (
            <line
              key={row}
              x1="12"
              x2="226"
              y1={57 + (row + 1) * 22}
              y2={57 + (row + 1) * 22}
              className="quality-section-line"
            />
          ))}
          <StackTable
            id="attribute"
            title="Quality attribute"
            x={226}
            headers={attributeHeaders}
            cells={attributeCells}
            selected={selected}
            onSelect={select}
          />
          <StackTable
            id="environment"
            title="Environment"
            x={439}
            headers={environmentHeaders}
            cells={environmentCells}
            cellWidth={34}
            selected={selected}
            onSelect={select}
          />
          <StackTable
            id="application"
            title="Application layer"
            x={620}
            headers={applicationHeaders}
            cells={applicationCells}
            interactive
            selected={selected}
            onSelect={select}
          />
        </svg>
      </section>
    </main>
  );
}
