import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/hris/api/client'
import { endpoints } from '@/hris/api/endpoints'
import { queryKeys } from '@/hris/api/queryKeys'
import type { Department, Employee } from '@/hris/types'
import { PageHeader } from '@/hris/components/shared/PageHeader'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/hris/components/ui/table'
import { Skeleton } from '@/hris/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/hris/components/ui/select'

export default function DepartmentsPage() {
  const queryClient = useQueryClient()

  const { data: departments, isLoading } = useQuery({
    queryKey: queryKeys.departments,
    queryFn: () => api<Department[]>(endpoints.departments),
  })

  const { data: employees } = useQuery({
    queryKey: queryKeys.employees(),
    queryFn: () => api<{ data: Employee[] }>(endpoints.employees),
  })

  const assignMutation = useMutation({
    mutationFn: ({ deptId, managerId }: { deptId: string; managerId: string }) =>
      api(endpoints.department(deptId), { method: 'PATCH', body: JSON.stringify({ managerId }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments })
      toast.success('Manager assigned')
    },
  })

  const empName = (id?: string) => {
    const e = employees?.data.find((emp) => emp.id === id)
    return e ? `${e.firstName} ${e.lastName}` : '—'
  }

  if (isLoading) return <Skeleton className="h-64 w-full" />

  return (
    <div>
      <PageHeader title="Departments" description="Organizational structure and management" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Headcount</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Manager</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments?.map((dept) => (
            <TableRow key={dept.id}>
              <TableCell className="font-medium">{dept.name}</TableCell>
              <TableCell>{dept.code}</TableCell>
              <TableCell>{dept.headcount}</TableCell>
              <TableCell>${dept.budget.toLocaleString()}</TableCell>
              <TableCell>
                <Select
                  value={dept.managerId ?? ''}
                  onValueChange={(v) => assignMutation.mutate({ deptId: dept.id, managerId: v })}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Assign manager">{empName(dept.managerId)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {employees?.data.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.firstName} {e.lastName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
