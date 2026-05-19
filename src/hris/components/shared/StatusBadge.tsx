import { Badge } from '@/hris/components/ui/badge'

const statusMap: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  active: 'success',
  approved: 'success',
  paid: 'success',
  completed: 'success',
  open: 'success',
  present: 'success',
  pending: 'warning',
  on_leave: 'warning',
  in_progress: 'warning',
  draft: 'secondary',
  denied: 'destructive',
  terminated: 'destructive',
  rejected: 'destructive',
  absent: 'destructive',
  closed: 'secondary',
  remote: 'default',
}

export function StatusBadge({ status }: { status: string }) {
  const variant = statusMap[status] ?? 'secondary'
  return (
    <Badge variant={variant} className="capitalize">
      {status.replace(/_/g, ' ')}
    </Badge>
  )
}
