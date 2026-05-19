import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/hris/api/client'
import { endpoints } from '@/hris/api/endpoints'
import { queryKeys } from '@/hris/api/queryKeys'
import type { ReportDefinition } from '@/hris/types'
import { PageHeader } from '@/hris/components/shared/PageHeader'
import { Button } from '@/hris/components/ui/button'
import { Badge } from '@/hris/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/hris/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/hris/components/ui/select'

export default function ReportsPage() {
  const [category, setCategory] = useState('all')

  const { data: reports } = useQuery({
    queryKey: queryKeys.reports,
    queryFn: () => api<ReportDefinition[]>(endpoints.reports),
  })

  const generateMutation = useMutation({
    mutationFn: (id: string) =>
      api(`${endpoints.reports}?id=${id}`, { method: 'POST' }),
    onSuccess: () => toast.success('Report generated (mock download)'),
  })

  const filtered = reports?.filter((r) => category === 'all' || r.category === category)

  return (
    <div>
      <PageHeader title="Reports" description="Generate and export HR analytics" />
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="mb-4 w-48"><SelectValue placeholder="Category" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {['Workforce', 'Time Off', 'Payroll', 'Analytics'].map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="grid gap-4 md:grid-cols-2">
        {filtered?.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <CardTitle className="text-base">{report.name}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge className="mb-3">{report.category}</Badge>
              <Button size="sm" onClick={() => generateMutation.mutate(report.id)}>
                <Download className="h-4 w-4" /> Generate
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
