import { useEffect } from "react";
import type { ReactNode } from "react";
import { useOnboardingStore } from "../state/onboarding";

interface Step {
  icon: ReactNode;
  title: string;
  body: string;
}

const icon = (children: ReactNode) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const STEPS: Step[] = [
  {
    icon: icon(
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </>,
    ),
    title: "Add artifacts",
    body: "Drag files right into the window, or use Import files… — HTML, SVG, Markdown, React, images, PDFs.",
  },
  {
    icon: icon(
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />,
    ),
    title: "Organize into projects",
    body: "Group them in the sidebar. ⌘-click to select several, drag to move, right-click to rename, nest, or export.",
  },
  {
    icon: icon(
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
      </>,
    ),
    title: "View & edit live",
    body: "Click any artifact to open it. Edit the code with instant preview, or roll back from version history.",
  },
  {
    icon: icon(
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
    ),
    title: "Edit with AI",
    body: "Use your API key in the Ask AI panel, or point an MCP client at Satchel to edit on your Claude/Codex subscription — changes appear here live.",
  },
];

export function Welcome() {
  const seen = useOnboardingStore((s) => s.seen);
  const markSeen = useOnboardingStore((s) => s.markSeen);

  useEffect(() => {
    if (seen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") markSeen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [seen, markSeen]);

  if (seen) return null;

  return (
    <div className="welcome-backdrop" onClick={markSeen}>
      <div className="welcome-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Welcome to Satchel">
        <h1 className="welcome-title">Welcome to Satchel</h1>
        <p className="welcome-sub">
          A home for the artifacts your AI makes — collect, organize, view, and keep editing them.
        </p>

        <ul className="welcome-list">
          {STEPS.map((step) => (
            <li key={step.title} className="welcome-step">
              <span className="welcome-step-icon">{step.icon}</span>
              <span className="welcome-step-text">
                <span className="welcome-step-title">{step.title}</span>
                <span className="welcome-step-body">{step.body}</span>
              </span>
            </li>
          ))}
        </ul>

        <p className="welcome-shortcuts">⌘K search · ⌘B sidebar · right-click for actions</p>

        <button className="btn-primary welcome-cta" onClick={markSeen}>
          Get started
        </button>
      </div>
    </div>
  );
}
