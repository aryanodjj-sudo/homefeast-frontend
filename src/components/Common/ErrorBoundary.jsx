import { Component } from "react";

// Catches render-time errors anywhere below it in the tree so a single broken
// component can't take down the whole app with a blank white screen.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // In production this is where you'd forward to an error-tracking service.
    console.error("ErrorBoundary caught an error:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <h2 className="text-2xl font-bold">Something went wrong</h2>
          <p className="max-w-md text-gray-500">
            An unexpected error occurred. Try reloading the page - if the
            problem continues, please come back later.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Back to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;