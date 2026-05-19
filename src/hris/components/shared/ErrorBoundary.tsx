import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Alert, AlertDescription } from '@/hris/components/ui/alert'
import { Button } from '@/hris/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('HRIS Error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <Alert variant="destructive" className="m-4">
            <AlertDescription className="flex flex-col gap-2">
              <p>Something went wrong: {this.state.error?.message}</p>
              <Button variant="outline" size="sm" onClick={() => this.setState({ hasError: false })}>
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        )
      )
    }
    return this.props.children
  }
}
