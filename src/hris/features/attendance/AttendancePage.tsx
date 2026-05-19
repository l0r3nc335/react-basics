import { useQuery } from '@tanstack/react-query'
import { api } from '@/hris/api/client'
import { endpoints } from '@/hris/api/endpoints'
import { queryKeys } from '@/hris/api/queryKeys'
import type { AttendanceRecord, Employee } from '@/hris/types'
import { PageHeader } from '@/hris/components/shared/PageHeader'
import { StatusBadge } from '@/hris/components/shared/StatusBadge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/hris/components/ui/table'

export default function AttendancePage() {
  const { data: records, isLoading } = useQuery({
    queryKey: queryKeys.attendance(),
    queryFn: () => api<AttendanceRecord[]>(endpoints.attendance),
  })

  const { data: employees } = useQuery({
    queryKey: queryKeys.employees(),
    queryFn: () => api<{ data: Employee[] }>(endpoints.employees),
  })

  const empName = (id: string) => {
    const e = employees?.data.find((emp) => emp.id === id)
    return e ? `${e.firstName} ${e.lastName}` : id
  }

  return (
    <div>
      <PageHeader title="Attendance" description="Timesheets and clock events" />
      {isLoading ? <p>Loading...</p> : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Clock In</TableHead>
              <TableHead>Clock Out</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records?.slice(0, 30).map((r) => (
              <TableRow key={r.id}>
                <TableCell>{empName(r.employeeId)}</TableCell>
                <TableCell>{r.date}</TableCell>
                <TableCell>{r.clockIn}</TableCell>
                <TableCell>{r.clockOut ?? '—'}</TableCell>
                <TableCell>{r.hours}</TableCell>
                <TableCell><StatusBadge status={r.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
