import { memo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import type { Employee } from '@/hris/types'
import { TableCell, TableRow } from '@/hris/components/ui/table'
import { StatusBadge } from '@/hris/components/shared/StatusBadge'
import { Avatar, AvatarFallback } from '@/hris/components/ui/avatar'

interface EmployeeRowProps {
  employee: Employee
  departmentName: string
}

export const EmployeeRow = memo(function EmployeeRow({ employee, departmentName }: EmployeeRowProps) {
  const initials = `${employee.firstName[0]}${employee.lastName[0]}`

  const handleClick = useCallback(() => {}, [])

  return (
    <TableRow onClick={handleClick}>
      <TableCell>
        <Link to={`/hris/employees/${employee.id}`} className="flex items-center gap-2 hover:underline">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          {employee.firstName} {employee.lastName}
        </Link>
      </TableCell>
      <TableCell>{employee.jobTitle}</TableCell>
      <TableCell>{departmentName}</TableCell>
      <TableCell>{employee.email}</TableCell>
      <TableCell><StatusBadge status={employee.status} /></TableCell>
    </TableRow>
  )
})
