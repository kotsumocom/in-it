import { ErrorPage } from "@kotsumo/in-it/components";

export function NotFoundPage() {
  return (
    <ErrorPage
      code={404}
      title="Page Not Found"
      description="The page you're looking for doesn't exist or has been moved."
      actionLabel="Back to Home"
      onAction={() => window.location.href = "/"}
    />
  );
}
