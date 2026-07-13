import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Changing this value resets the boundary (e.g. navigating away). */
  resetKey?: unknown;
}

interface State {
  error: Error | null;
}

/**
 * Catches render/runtime errors in the view tree so a single broken component
 * shows a readable message instead of blanking the entire window. Resets when
 * `resetKey` changes so navigating to a different view clears a stale error.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface it for anyone with the devtools/console open.
    console.error("View crashed:", error, info.componentStack);
  }

  componentDidUpdate(prev: Props) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="view-error">
          <h2>Something went wrong in this view</h2>
          <pre>{this.state.error.message}</pre>
          {this.state.error.stack && <pre className="view-error-stack">{this.state.error.stack}</pre>}
        </div>
      );
    }
    return this.props.children;
  }
}
