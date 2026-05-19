import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/hris/api/client'
import { endpoints } from '@/hris/api/endpoints'
import { queryKeys } from '@/hris/api/queryKeys'
import type { CompanySettings, Role } from '@/hris/types'
import { PageHeader } from '@/hris/components/shared/PageHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/hris/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/hris/components/ui/card'
import { Input } from '@/hris/components/ui/input'
import { Label } from '@/hris/components/ui/label'
import { Button } from '@/hris/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/hris/components/ui/table'

export default function SettingsPage() {
  const queryClient = useQueryClient()

  const { data: settings } = useQuery({
    queryKey: queryKeys.settings,
    queryFn: () => api<CompanySettings>(endpoints.settings),
  })

  const { data: roles } = useQuery({
    queryKey: queryKeys.roles,
    queryFn: () => api<Role[]>(endpoints.roles),
  })

  const updateMutation = useMutation({
    mutationFn: (body: Partial<CompanySettings>) =>
      api(endpoints.settings, { method: 'PATCH', body: JSON.stringify(body) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings })
      toast.success('Settings saved')
    },
  })

  return (
    <div>
      <PageHeader title="Settings" description="Company configuration and roles" />
      <Tabs defaultValue="company">
        <TabsList>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>
        <TabsContent value="company">
          <Card>
            <CardHeader><CardTitle>Company Settings</CardTitle></CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const fd = new FormData(e.currentTarget)
                  updateMutation.mutate({
                    companyName: fd.get('companyName') as string,
                    timezone: fd.get('timezone') as string,
                    leavePolicyDays: Number(fd.get('leavePolicyDays')),
                  })
                }}
                className="max-w-md space-y-4"
              >
                <div><Label>Company Name</Label><Input name="companyName" defaultValue={settings?.companyName} /></div>
                <div><Label>Timezone</Label><Input name="timezone" defaultValue={settings?.timezone} /></div>
                <div><Label>Annual Leave Days</Label><Input name="leavePolicyDays" type="number" defaultValue={settings?.leavePolicyDays} /></div>
                <Button type="submit" disabled={updateMutation.isPending}>Save</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="roles">
          <Card>
            <CardHeader><CardTitle>Roles</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Permissions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles?.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{role.permissions.join(', ')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
