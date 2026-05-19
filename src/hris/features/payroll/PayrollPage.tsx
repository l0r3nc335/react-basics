import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/hris/api/client'
import { endpoints } from '@/hris/api/endpoints'
import { queryKeys } from '@/hris/api/queryKeys'
import type { PayrollRun, Payslip, Employee } from '@/hris/types'
import { PageHeader } from '@/hris/components/shared/PageHeader'
import { StatusBadge } from '@/hris/components/shared/StatusBadge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/hris/components/ui/table'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/hris/components/ui/sheet'
import { Card, CardContent, CardHeader, CardTitle } from '@/hris/components/ui/card'

export default function PayrollPage() {
  const [selectedSlip, setSelectedSlip] = useState<Payslip | null>(null)

  const { data: runs } = useQuery({
    queryKey: queryKeys.payroll,
    queryFn: () => api<PayrollRun[]>(endpoints.payroll),
  })

  const { data: payslips } = useQuery({
    queryKey: queryKeys.payslips,
    queryFn: () => api<Payslip[]>(endpoints.payslips),
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
      <PageHeader title="Payroll" description="View payroll runs and payslips (read-only)" />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {runs?.map((run) => (
          <Card key={run.id}>
            <CardHeader className="pb-2"><CardTitle className="text-base">{run.period}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${run.totalAmount.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">{run.employeeCount} employees</p>
              <StatusBadge status={run.status} />
            </CardContent>
          </Card>
        ))}
      </div>
      <h2 className="mb-4 text-lg font-semibold">Payslips</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Gross</TableHead>
            <TableHead>Deductions</TableHead>
            <TableHead>Net Pay</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payslips?.map((slip) => (
            <TableRow key={slip.id} className="cursor-pointer" onClick={() => setSelectedSlip(slip)}>
              <TableCell>{empName(slip.employeeId)}</TableCell>
              <TableCell>{slip.period}</TableCell>
              <TableCell>${slip.grossPay.toFixed(2)}</TableCell>
              <TableCell>${slip.deductions.toFixed(2)}</TableCell>
              <TableCell className="font-medium">${slip.netPay.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Sheet open={!!selectedSlip} onOpenChange={() => setSelectedSlip(null)}>
        <SheetContent>
          <SheetHeader><SheetTitle>Payslip Detail</SheetTitle></SheetHeader>
          {selectedSlip && (
            <div className="mt-4 space-y-2 text-sm">
              <p><strong>Employee:</strong> {empName(selectedSlip.employeeId)}</p>
              <p><strong>Period:</strong> {selectedSlip.period}</p>
              <p><strong>Gross Pay:</strong> ${selectedSlip.grossPay.toFixed(2)}</p>
              <p><strong>Deductions:</strong> ${selectedSlip.deductions.toFixed(2)}</p>
              <p><strong>Net Pay:</strong> ${selectedSlip.netPay.toFixed(2)}</p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
