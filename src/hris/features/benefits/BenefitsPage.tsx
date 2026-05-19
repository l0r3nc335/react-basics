import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/hris/api/client'
import { endpoints } from '@/hris/api/endpoints'
import { queryKeys } from '@/hris/api/queryKeys'
import type { BenefitPlan, Enrollment } from '@/hris/types'
import { PageHeader } from '@/hris/components/shared/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/hris/components/ui/card'
import { Button } from '@/hris/components/ui/button'
import { Badge } from '@/hris/components/ui/badge'

export default function BenefitsPage() {
  const queryClient = useQueryClient()

  const { data: plans } = useQuery({
    queryKey: queryKeys.benefits,
    queryFn: () => api<BenefitPlan[]>(endpoints.benefits),
  })

  const { data: enrollments } = useQuery({
    queryKey: queryKeys.enrollments,
    queryFn: () => api<Enrollment[]>(endpoints.enrollments),
  })

  const enrollMutation = useMutation({
    mutationFn: (planId: string) =>
      api(endpoints.enrollments, { method: 'POST', body: JSON.stringify({ employeeId: 'e3', planId }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollments })
      toast.success('Enrolled successfully')
    },
  })

  const isEnrolled = (planId: string) => enrollments?.some((e) => e.planId === planId && e.employeeId === 'e3')

  return (
    <div>
      <PageHeader title="Benefits" description="Health, dental, vision, and retirement plans" />
      <div className="grid gap-4 md:grid-cols-2">
        {plans?.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{plan.name}</CardTitle>
                <Badge variant="secondary">{plan.type}</Badge>
              </div>
              <CardDescription>{plan.provider}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>
              <p className="font-medium mb-3">
                {plan.monthlyCost > 0 ? `$${plan.monthlyCost}/mo` : 'Company sponsored'}
              </p>
              {isEnrolled(plan.id) ? (
                <Badge variant="success">Enrolled</Badge>
              ) : (
                <Button size="sm" onClick={() => enrollMutation.mutate(plan.id)}>Enroll</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
