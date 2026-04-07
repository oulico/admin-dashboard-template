import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard')({ component: () => <div style={{ display: 'flex' }}><main style={{ flex: 1, padding: '1rem' }}><Outlet /></main></div> })
