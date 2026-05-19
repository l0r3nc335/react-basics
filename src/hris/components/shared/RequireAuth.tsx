import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hris/context/AuthContext'
import { Skeleton } from '@/hris/components/ui/skeleton'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/hris/login" state={{ from: location }} replace />
  }

  return children
}
