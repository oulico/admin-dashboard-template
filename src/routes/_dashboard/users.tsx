import { createFileRoute } from "@tanstack/react-router";
import { Users } from "@/features/users";
import { AsyncBoundary } from "@/shared/ui";
import { ErrorFallback } from "@/shared/ui";

export const Route = createFileRoute("/_dashboard/users")({
  component: () => (
    <AsyncBoundary
      pending={<div>Loading...</div>}
      rejected={<ErrorFallback message="Failed to load users" />}
    >
      <Users />
    </AsyncBoundary>
  ),
});
