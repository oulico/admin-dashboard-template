import { useQueryClient, type QueryKey } from '@tanstack/react-query'
import { useErrorBoundaryFallbackProps } from '@suspensive/react'

type ErrorFallbackProps = {
  message?: string
  queryKey?: QueryKey
  retryText?: string
}

export const ErrorFallback = ({
  message,
  queryKey,
  retryText = 'Retry',
}: ErrorFallbackProps) => {
  const { error, reset } = useErrorBoundaryFallbackProps()
  const queryClient = useQueryClient()

  const handleRetry = () => {
    if (queryKey) {
      queryClient.invalidateQueries({ queryKey })
    }
    reset()
  }

  return (
    <div>
      <p>{message ?? error.message}</p>
      <button onClick={handleRetry}>{retryText}</button>
    </div>
  )
}
