import { useEffect } from "react";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { listen } from "@tauri-apps/api/event";
import { useLibraryStore } from "./state/library";
import { useUiStore } from "./state/ui";
import { Sidebar } from "./components/Sidebar";
import { ProjectGrid } from "./components/ProjectGrid";
import { ArtifactView } from "./components/ArtifactView";
import { Settings } from "./components/Settings";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./App.css";

export default function App() {
  const loadProjects = useLibraryStore((s) => s.loadProjects);
  const importPaths = useLibraryStore((s) => s.importPaths);
  const selectedArtifactId = useLibraryStore((s) => s.selectedArtifactId);
  const error = useLibraryStore((s) => s.error);
  const view = useUiStore((s) => s.view);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // In a shipped build, suppress WebKit's native right-click menu (Inspect
  // Element, Open Frame in New Window, …) so the only context menus are the
  // app's own. Left enabled in dev so devtools stay reachable.
  useEffect(() => {
    if (!import.meta.env.PROD) return;
    const onContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", onContextMenu);
    return () => document.removeEventListener("contextmenu", onContextMenu);
  }, []);

  // Live-refresh the grid/sidebar when an MCP client mutates the library.
  useEffect(() => {
    const unlisten = listen("library:changed", () => {
      useLibraryStore.getState().syncExternal();
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  useEffect(() => {
    const unlisten = getCurrentWebview().onDragDropEvent((event) => {
      if (event.payload.type === "drop") {
        importPaths(event.payload.paths);
      }
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, [importPaths]);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => useLibraryStore.setState({ error: null })}>Dismiss</button>
          </div>
        )}
        <ErrorBoundary resetKey={`${view}:${selectedArtifactId ?? ""}`}>
          {view === "settings" ? (
            <Settings />
          ) : selectedArtifactId ? (
            <ArtifactView />
          ) : (
            <ProjectGrid />
          )}
        </ErrorBoundary>
      </main>
    </div>
  );
}
