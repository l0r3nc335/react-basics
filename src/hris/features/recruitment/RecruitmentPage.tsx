import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/hris/api/client'
import { endpoints } from '@/hris/api/endpoints'
import { queryKeys } from '@/hris/api/queryKeys'
import type { JobPosting, Applicant } from '@/hris/types'
import { PageHeader } from '@/hris/components/shared/PageHeader'
import { StatusBadge } from '@/hris/components/shared/StatusBadge'
import { Button } from '@/hris/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/hris/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/hris/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/hris/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/hris/components/ui/dialog'
import { Input } from '@/hris/components/ui/input'
import { Label } from '@/hris/components/ui/label'

const stages = ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'] as const

export default function RecruitmentPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: jobs } = useQuery({
    queryKey: queryKeys.jobs,
    queryFn: () => api<JobPosting[]>(endpoints.jobs),
  })

  const { data: applicants } = useQuery({
    queryKey: queryKeys.applicants(),
    queryFn: () => api<Applicant[]>(endpoints.applicants),
  })

  const stageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: string }) =>
      api(`/recruitment/applicants/${id}`, { method: 'PATCH', body: JSON.stringify({ stage }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applicants() })
      toast.success('Applicant stage updated')
    },
  })

  const createJobMutation = useMutation({
    mutationFn: (body: Partial<JobPosting>) =>
      api(endpoints.jobs, { method: 'POST', body: JSON.stringify(body) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs })
      toast.success('Job posted')
      setDialogOpen(false)
    },
  })

  return (
    <div>
      <PageHeader
        title="Recruitment"
        description="Job postings and applicant pipeline"
        actions={<Button onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4" /> Post Job</Button>}
      />
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {jobs?.map((job) => (
          <Card key={job.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{job.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{job.location} · {job.type.replace('_', ' ')}</p>
              <p className="mt-1 font-medium">{job.applicants} applicants</p>
              <StatusBadge status={job.status} />
            </CardContent>
          </Card>
        ))}
      </div>
      <h2 className="mb-4 text-lg font-semibold">Applicants</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead>Stage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants?.map((app) => (
            <TableRow key={app.id}>
              <TableCell>{app.name}</TableCell>
              <TableCell>{app.email}</TableCell>
              <TableCell>{new Date(app.appliedAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Select value={app.stage} onValueChange={(v) => stageMutation.mutate({ id: app.id, stage: v })}>
                  <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {stages.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Post New Job</DialogTitle></DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const fd = new FormData(e.currentTarget)
              createJobMutation.mutate({
                title: fd.get('title') as string,
                departmentId: 'd1',
                location: fd.get('location') as string,
                type: 'full_time',
                status: 'open',
              })
            }}
            className="space-y-4"
          >
            <div><Label>Title</Label><Input name="title" required /></div>
            <div><Label>Location</Label><Input name="location" required /></div>
            <Button type="submit">Post</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
