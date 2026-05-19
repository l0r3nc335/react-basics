import { useReducer, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/hris/api/client'
import { endpoints } from '@/hris/api/endpoints'
import { queryKeys } from '@/hris/api/queryKeys'
import type { LeaveRequest, Employee } from '@/hris/types'
import { PageHeader } from '@/hris/components/shared/PageHeader'
import { StatusBadge } from '@/hris/components/shared/StatusBadge'
import { Button } from '@/hris/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/hris/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/hris/components/ui/dialog'
import { Label } from '@/hris/components/ui/label'
import { Input } from '@/hris/components/ui/input'
import { Textarea } from '@/hris/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/hris/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/hris/components/ui/sheet'
import { useAuth } from '@/hris/context/AuthContext'

type WizardState = { step: number; type: string; startDate: string; endDate: string; reason: string }
type WizardAction = { type: 'NEXT' } | { type: 'BACK' } | { type: 'SET'; field: keyof WizardState; value: string }

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'NEXT': return { ...state, step: state.step + 1 }
    case 'BACK': return { ...state, step: Math.max(0, state.step - 1) }
    case 'SET': return { ...state, [action.field]: action.value }
    default: return state
  }
}

export default function LeavePage() {
  const { hasRole } = useAuth()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selected, setSelected] = useState<LeaveRequest | null>(null)
  const [wizard, dispatch] = useReducer(wizardReducer, { step: 0, type: 'vacation', startDate: '', endDate: '', reason: '' })
  const queryClient = useQueryClient()

  const { data: requests, isLoading } = useQuery({
    queryKey: queryKeys.leave(),
    queryFn: () => api<LeaveRequest[]>(endpoints.leave),
  })

  const { data: employees } = useQuery({
    queryKey: queryKeys.employees(),
    queryFn: () => api<{ data: Employee[] }>(endpoints.employees),
  })

  const empMap = Object.fromEntries((employees?.data ?? []).map((e) => [e.id, `${e.firstName} ${e.lastName}`]))

  const createMutation = useMutation({
    mutationFn: (body: Partial<LeaveRequest>) =>
      api(endpoints.leave, { method: 'POST', body: JSON.stringify(body) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leave() })
      toast.success('Leave request submitted')
      setDialogOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api(endpoints.leaveItem(id), { method: 'PATCH', body: JSON.stringify({ status }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leave() })
      toast.success('Request updated')
      setSelected(null)
    },
  })

  const submitRequest = () => {
    const start = new Date(wizard.startDate)
    const end = new Date(wizard.endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    createMutation.mutate({
      employeeId: 'e3',
      type: wizard.type as LeaveRequest['type'],
      startDate: wizard.startDate,
      endDate: wizard.endDate,
      days,
      reason: wizard.reason,
    })
  }

  return (
    <div>
      <PageHeader
        title="Leave Management"
        description="Request and approve time off"
        actions={<Button onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4" /> Request Leave</Button>}
      />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Days</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests?.map((req) => (
              <TableRow key={req.id}>
                <TableCell>{empMap[req.employeeId] ?? req.employeeId}</TableCell>
                <TableCell className="capitalize">{req.type}</TableCell>
                <TableCell>{req.startDate} – {req.endDate}</TableCell>
                <TableCell>{req.days}</TableCell>
                <TableCell><StatusBadge status={req.status} /></TableCell>
                <TableCell>
                  {req.status === 'pending' && hasRole('admin', 'manager') && (
                    <Button variant="outline" size="sm" onClick={() => setSelected(req)}>Review</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Request Leave — Step {wizard.step + 1}</DialogTitle></DialogHeader>
          {wizard.step === 0 && (
            <div className="space-y-4">
              <div>
                <Label>Type</Label>
                <Select value={wizard.type} onValueChange={(v) => dispatch({ type: 'SET', field: 'type', value: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['vacation', 'sick', 'personal', 'bereavement'].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => dispatch({ type: 'NEXT' })}>Next</Button>
            </div>
          )}
          {wizard.step === 1 && (
            <div className="space-y-4">
              <div><Label>Start Date</Label><Input type="date" value={wizard.startDate} onChange={(e) => dispatch({ type: 'SET', field: 'startDate', value: e.target.value })} /></div>
              <div><Label>End Date</Label><Input type="date" value={wizard.endDate} onChange={(e) => dispatch({ type: 'SET', field: 'endDate', value: e.target.value })} /></div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => dispatch({ type: 'BACK' })}>Back</Button>
                <Button onClick={() => dispatch({ type: 'NEXT' })}>Next</Button>
              </div>
            </div>
          )}
          {wizard.step === 2 && (
            <div className="space-y-4">
              <div><Label>Reason</Label><Textarea value={wizard.reason} onChange={(e) => dispatch({ type: 'SET', field: 'reason', value: e.target.value })} /></div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => dispatch({ type: 'BACK' })}>Back</Button>
                <Button onClick={submitRequest} disabled={createMutation.isPending}>Submit</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent>
          <SheetHeader><SheetTitle>Review Leave Request</SheetTitle></SheetHeader>
          {selected && (
            <div className="mt-4 space-y-4">
              <p><strong>Employee:</strong> {empMap[selected.employeeId]}</p>
              <p><strong>Type:</strong> {selected.type}</p>
              <p><strong>Dates:</strong> {format(new Date(selected.startDate), 'MMM d')} – {format(new Date(selected.endDate), 'MMM d, yyyy')}</p>
              <p><strong>Reason:</strong> {selected.reason}</p>
              <div className="flex gap-2">
                <Button onClick={() => updateMutation.mutate({ id: selected.id, status: 'approved' })}>Approve</Button>
                <Button variant="destructive" onClick={() => updateMutation.mutate({ id: selected.id, status: 'denied' })}>Deny</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
