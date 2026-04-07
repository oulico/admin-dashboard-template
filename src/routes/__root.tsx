import { Outlet, createRootRoute } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/shared/lib/queryClient'

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      {import.meta.env.DEV && <ReactQueryDevtools />}
    </QueryClientProvider>
  ),
})
