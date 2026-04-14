export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-64 h-64 rounded-full bg-muted animate-pulse" />
      <div className="mt-8 space-y-4 w-full max-w-sm">
        <div className="h-12 bg-muted rounded-xl animate-pulse" />
        <div className="h-12 bg-muted rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
