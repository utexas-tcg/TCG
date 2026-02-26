'use client'
import React from 'react'
import BlurText from './ReactBits/BlurText'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <BlurText
            text="Something went wrong"
            className="text-xl font-bold text-tcg-gray-900 justify-center mb-2"
            animateBy="words"
          />
          <p className="text-sm text-tcg-gray-600 mb-4">
            {this.state.error?.message ?? 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-tcg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-tcg-blue-500 transition-colors"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
