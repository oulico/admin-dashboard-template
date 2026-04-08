import type { ReactNode } from 'react'
import { ErrorBoundary, Suspense } from '@suspensive/react'
import { QueryErrorResetBoundary } from '@tanstack/react-query'

type AsyncBoundaryProps = {
  pending: ReactNode
  rejected: ReactNode
  children: ReactNode
}

export const AsyncBoundary = ({ pending, rejected, children }: AsyncBoundaryProps) => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary onReset={reset} fallback={rejected}>
        <Suspense fallback={pending}>{children}</Suspense>
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
)
