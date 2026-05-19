import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/hris/api/client'
import { endpoints } from '@/hris/api/endpoints'
import { queryKeys } from '@/hris/api/queryKeys'
import type { PerformanceReview, Employee } from '@/hris/types'
import { PageHeader } from '@/hris/components/shared/PageHeader'
import { StatusBadge } from '@/hris/components/shared/StatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/hris/components/ui/card'
import { Button } from '@/hris/components/ui/button'

export default function PerformancePage() {
  const queryClient = useQueryClient()

  const { data: reviews, isLoading } = useQuery({
    queryKey: queryKeys.performance,
    queryFn: () => api<PerformanceReview[]>(endpoints.performance),
  })

  const { data: employees } = useQuery({
    queryKey: queryKeys.employees(),
    queryFn: () => api<{ data: Employee[] }>(endpoints.employees),
  })

  const submitMutation = useMutation({
    mutationFn: (id: string) =>
      api(`${endpoints.performance}/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'completed' }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.performance })
      toast.success('Review submitted')
    },
  })

  const empName = (id: string) => {
    const e = employees?.data.find((emp) => emp.id === id)
    return e ? `${e.firstName} ${e.lastName}` : id
  }

  if (isLoading) return <p>Loading...</p>

  return (
    <div>
      <PageHeader title="Performance Reviews" description="Q1 2026 review cycle" />
      <div className="grid gap-4 md:grid-cols-2">
        {reviews?.map((review) => (
          <Card key={review.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">{empName(review.employeeId)}</CardTitle>
              <StatusBadge status={review.status} />
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{review.summary}</p>
              <p>Rating: {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
              <ul className="space-y-1 text-sm">
                {review.goals.map((g) => (
                  <li key={g.id} className="flex justify-between">
                    <span>{g.title}</span>
                    <span>{g.progress}%</span>
                  </li>
                ))}
              </ul>
              {review.status !== 'completed' && (
                <Button size="sm" onClick={() => submitMutation.mutate(review.id)}>Submit Review</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
