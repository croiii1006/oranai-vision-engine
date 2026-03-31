export default function Loading() {
  return (
    <div
      className="flex min-h-[40vh] items-center justify-center bg-background"
      role="status"
      aria-label="Loading"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}
