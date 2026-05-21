import { Component, type ErrorInfo, type ReactNode } from "react"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, info: ErrorInfo) => void
  t?: (key: string) => string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary] Caught:", error, info.componentStack)
    this.props.onError?.(error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      const t = this.props.t || ((key: string) => key)

      return (
        <div className="flex min-h-[400px] items-center justify-center p-[var(--space-lg)]">
          <div className="flex max-w-md flex-col items-center gap-[var(--space-md)] text-center">
            <div className="text-4xl">⚠️</div>
            <h2 className="text-xl font-bold text-foreground">{t('error_title')}</h2>
            <p className="text-sm text-muted-foreground">
              {this.state.error?.message || t('error_message')}
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] bg-primary px-sm text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition-all hover:bg-aau-light-blue hover:-translate-y-px hover:shadow-[var(--shadow-md)]"
            >
              {t('try_again')}
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
