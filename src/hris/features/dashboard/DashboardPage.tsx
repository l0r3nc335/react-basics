import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Users, UserCheck, Calendar, Briefcase } from 'lucide-react'
import { api } from '@/hris/api/client'
import { endpoints } from '@/hris/api/endpoints'
import { queryKeys } from '@/hris/api/queryKeys'
import type { DashboardStats } from '@/hris/types'
import { PageHeader } from '@/hris/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/hris/components/ui/card'
import { Skeleton } from '@/hris/components/ui/skeleton'

function StatCard({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: () => api<DashboardStats>(endpoints.dashboard),
  })

  const chartData = useMemo(
    () => data?.headcountByDepartment ?? [],
    [data?.headcountByDepartment],
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Dashboard" description="Workforce overview and key metrics" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Employees" value={data?.totalEmployees ?? 0} icon={Users} />
        <StatCard title="Active" value={data?.activeEmployees ?? 0} icon={UserCheck} />
        <StatCard title="Pending Leave" value={data?.pendingLeaveRequests ?? 0} icon={Calendar} />
        <StatCard title="Open Positions" value={data?.openPositions ?? 0} icon={Briefcase} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Headcount by Department</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Hiring Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data?.hiringTrend ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="hires" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {data?.recentActivity.map((item) => (
              <li key={item.id} className="flex justify-between border-b pb-2 text-sm last:border-0">
                <span>{item.message}</span>
                <span className="text-muted-foreground">{new Date(item.timestamp).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
