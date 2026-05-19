import { useState, useDeferredValue, useTransition } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/hris/api/client'
import { endpoints } from '@/hris/api/endpoints'
import { queryKeys } from '@/hris/api/queryKeys'
import type { Employee, PaginatedResponse, Department } from '@/hris/types'
import { PageHeader } from '@/hris/components/shared/PageHeader'
import { Button } from '@/hris/components/ui/button'
import { Input } from '@/hris/components/ui/input'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/hris/components/ui/table'
import { Skeleton } from '@/hris/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/hris/components/ui/dialog'
import { Label } from '@/hris/components/ui/label'
import { useDebounce } from '@/hris/hooks/useDebounce'
import { EmployeeRow } from './EmployeeRow'

export default function EmployeesPage() {
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const debouncedSearch = useDebounce(search, 300)
  const deferredSearch = useDeferredValue(debouncedSearch)
  const queryClient = useQueryClient()

  const { data: empData, isLoading } = useQuery({
    queryKey: queryKeys.employees({ search: deferredSearch }),
    queryFn: () => api<PaginatedResponse<Employee>>(`${endpoints.employees}?search=${deferredSearch}`),
  })

  const { data: departments } = useQuery({
    queryKey: queryKeys.departments,
    queryFn: () => api<Department[]>(endpoints.departments),
  })

  const deptMap = Object.fromEntries((departments ?? []).map((d) => [d.id, d.name]))

  const createMutation = useMutation({
    mutationFn: (body: Partial<Employee>) =>
      api<Employee>(endpoints.employees, { method: 'POST', body: JSON.stringify(body) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      toast.success('Employee created')
      setDialogOpen(false)
    },
  })

  const handleSearch = (value: string) => {
    startTransition(() => setSearch(value))
  }

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    createMutation.mutate({
      firstName: fd.get('firstName') as string,
      lastName: fd.get('lastName') as string,
      email: fd.get('email') as string,
      phone: fd.get('phone') as string,
      jobTitle: fd.get('jobTitle') as string,
      departmentId: fd.get('departmentId') as string,
      status: 'active',
      hireDate: new Date().toISOString().split('T')[0],
      salary: Number(fd.get('salary')),
    })
  }

  return (
    <div>
      <PageHeader
        title="Employees"
        description="Manage your workforce"
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" /> Add Employee
          </Button>
        }
      />
      <Input
        placeholder="Search employees..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="mb-4 max-w-sm"
      />
      {isPending && <p className="mb-2 text-xs text-muted-foreground">Updating...</p>}
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {empData?.data.map((emp) => (
              <EmployeeRow key={emp.id} employee={emp} departmentName={deptMap[emp.departmentId] ?? '—'} />
            ))}
          </TableBody>
        </Table>
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Employee</DialogTitle></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>First Name</Label><Input name="firstName" required /></div>
              <div><Label>Last Name</Label><Input name="lastName" required /></div>
            </div>
            <div><Label>Email</Label><Input name="email" type="email" required /></div>
            <div><Label>Phone</Label><Input name="phone" /></div>
            <div><Label>Job Title</Label><Input name="jobTitle" required /></div>
            <div><Label>Department ID</Label><Input name="departmentId" defaultValue="d1" required /></div>
            <div><Label>Salary</Label><Input name="salary" type="number" required /></div>
            <Button type="submit" disabled={createMutation.isPending}>Create</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
