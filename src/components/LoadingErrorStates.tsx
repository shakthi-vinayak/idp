import { AlertTriangle, RefreshCw, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'hsl(var(--primary))' }} />
        <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Loading...</p>
      </div>
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3 text-center max-w-md">
        <AlertTriangle className="w-8 h-8" style={{ color: 'hsl(var(--destructive))' }} />
        <p className="text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>Failed to load data</p>
        <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>{message}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="gap-1.5 mt-1">
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </Button>
        )}
      </div>
    </div>
  )
}
