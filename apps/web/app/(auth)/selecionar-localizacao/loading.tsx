export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-64 h-64 rounded-full bg-muted animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-muted via-muted/60 to-muted" />
      <div className="mt-8 space-y-4 w-full max-w-sm">
        <div className="h-12 rounded-xl animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-muted via-muted/60 to-muted" />
        <div className="h-12 rounded-xl animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-muted via-muted/60 to-muted" />
      </div>
    </div>
  );
}
