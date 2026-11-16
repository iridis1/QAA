"use client";

import { useState } from "react";

type Step = { id: string; x: number; y: number; title: string[]; sub?: string };

const steps: Step[] = [
  { id: "spec", x: 22, y: 236, title: ["Requirement", "Specification"] },
  { id: "review", x: 186, y: 236, title: ["Requirement", "Review"] },
  { id: "test", x: 361, y: 132, title: ["AI Assisted", "Test Creation"] },
  { id: "dev", x: 361, y: 236, title: ["AI Assisted", "Development"] },
  { id: "agent", x: 567, y: 10, title: ["Agentic", "Review"] },
  { id: "human", x: 567, y: 101, title: ["Human", "Review"] },
  { id: "analysis", x: 567, y: 192, title: ["Code Analysis"], sub: "SonarQube" },
  { id: "unit", x: 567, y: 283, title: ["Unit Test", "Execution"] },
  { id: "sca", x: 567, y: 374, title: ["SCA"], sub: "Dependabot" },
  { id: "sast", x: 567, y: 465, title: ["SAST"], sub: "CodeQL" },
  { id: "acc", x: 765, y: 236, title: ["Deployment", "TST / ACC"] },
  { id: "api", x: 957, y: 96, title: ["API / E2E", "Test Execution"] },
  { id: "dast", x: 957, y: 188, title: ["DAST"], sub: "Nuclei" },
  { id: "explore", x: 957, y: 280, title: ["Exploratory", "Tests"] },
  { id: "monitor", x: 957, y: 372, title: ["Monitoring"] },
  { id: "prd", x: 1145, y: 236, title: ["Deployment", "PRD"] },
  { id: "final-monitor", x: 1308, y: 236, title: ["Monitoring"] },
];

const routes = [
  "M156 276H186", "M320 276H341V172H361", "M320 276H361", "M495 276H531V46H567", "M495 276H531V137H567", "M495 276H531V228H567", "M495 276H531V319H567", "M495 276H531V410H567", "M495 276H531V501H567",
  "M701 46H733V276H765", "M701 137H733V276H765", "M701 228H733V276H765", "M701 319H733V276H765", "M701 410H733V276H765", "M701 501H733V276H765",
  "M901 276H928V132H957", "M901 276H928V224H957", "M901 276H928V316H957", "M901 276H928V408H957", "M1091 132H1117V276H1145", "M1091 224H1117V276H1145", "M1091 316H1117V276H1145", "M1091 408H1117V276H1145", "M1279 276H1308"
];

export default function Home() {
  const [clicks, setClicks] = useState<Record<string, number>>({});
  // Status 0 is the initial light-blue state. Every click advances its colour.
  const select = (id: string) => setClicks((current) => ({ ...current, [id]: ((current[id] ?? 0) + 1) % 3 }));

  return <main>
    <header><h1>Quality Assurance Assessment</h1></header>
    <section className="diagram-shell" aria-label="Interactief ontwikkelproces">
      <svg className="workflow" viewBox="0 0 1465 565" role="img" aria-label="Development workflow met klikbare processtappen">
        <defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" className="arrowhead" /></marker></defs>
        <text x="14" y="33" className="diagram-title">Development Workflow</text>
        <g className="routes">{routes.map((d, index) => <path d={d} key={index} markerEnd="url(#arrow)" />)}</g>
        {steps.map((step) => {
          const state = clicks[step.id] ?? 0;
          return <g key={step.id} className={`step state-${state}`} onClick={() => select(step.id)} role="button" tabIndex={0} aria-label={`${step.title.join(" ")}, ${state} keer geselecteerd`} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(step.id); } }}>
            <rect x={step.x} y={step.y} width="134" height="80" rx="8" />
            <text x={step.x + 67} y={step.y + (step.title.length === 1 ? 36 : 34)} className="step-title">{step.title.map((line, i) => <tspan x={step.x + 67} dy={i === 0 ? 0 : 21} key={line}>{line}</tspan>)}</text>
            {step.sub && <text x={step.x + 67} y={step.y + 59} className="step-sub">{step.sub}</text>}
          </g>;
        })}
      </svg>
    </section>
  </main>;
}
