import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/hris/api/client'
import { endpoints } from '@/hris/api/endpoints'
import { queryKeys } from '@/hris/api/queryKeys'
import type { Employee, Department } from '@/hris/types'
import { PageHeader } from '@/hris/components/shared/PageHeader'
import { StatusBadge } from '@/hris/components/shared/StatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/hris/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/hris/components/ui/tabs'
import { Skeleton } from '@/hris/components/ui/skeleton'
import { Button } from '@/hris/components/ui/button'
import { Avatar, AvatarFallback } from '@/hris/components/ui/avatar'

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data: employee, isLoading } = useQuery({
    queryKey: queryKeys.employee(id!),
    queryFn: () => api<Employee>(endpoints.employee(id!)),
    enabled: !!id,
  })

  const { data: departments } = useQuery({
    queryKey: queryKeys.departments,
    queryFn: () => api<Department[]>(endpoints.departments),
  })

  const dept = departments?.find((d) => d.id === employee?.departmentId)

  if (isLoading) return <Skeleton className="h-64 w-full" />
  if (!employee) return <p>Employee not found</p>

  const initials = `${employee.firstName[0]}${employee.lastName[0]}`

  return (
    <div>
      <PageHeader
        title={`${employee.firstName} ${employee.lastName}`}
        description={employee.jobTitle}
        actions={<Button variant="outline" asChild><Link to="/hris/employees">← Back</Link></Button>}
      />
      <div className="mb-6 flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <StatusBadge status={employee.status} />
          <p className="mt-1 text-sm text-muted-foreground">{employee.email}</p>
        </div>
      </div>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compensation">Compensation</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2">
              <p><span className="text-muted-foreground">Department:</span> {dept?.name ?? '—'}</p>
              <p><span className="text-muted-foreground">Phone:</span> {employee.phone}</p>
              <p><span className="text-muted-foreground">Hire Date:</span> {employee.hireDate}</p>
              <p><span className="text-muted-foreground">Manager ID:</span> {employee.managerId ?? '—'}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="compensation">
          <Card>
            <CardHeader><CardTitle>Salary</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${employee.salary.toLocaleString()}/yr</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Employment history will appear here when connected to a live API.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
