import { Link } from 'react-router-dom'
import { PageHeader } from '@/hris/components/shared/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/hris/components/ui/card'

const concepts = [
  { topic: 'Components & Props', file: 'src/hris/components/shared/PageHeader.tsx', demo: '/use-state' },
  { topic: 'useState', file: 'src/hris/features/employees/EmployeesPage.tsx', demo: '/use-state' },
  { topic: 'useEffect', file: 'src/hris/context/AuthContext.tsx', demo: '/use-effect' },
  { topic: 'useContext', file: 'src/hris/context/AuthContext.tsx', demo: null },
  { topic: 'useReducer', file: 'src/hris/features/leave/LeavePage.tsx', demo: null },
  { topic: 'useMemo', file: 'src/hris/features/dashboard/DashboardPage.tsx', demo: '/use-memo' },
  { topic: 'useCallback', file: 'src/hris/features/employees/EmployeeRow.tsx', demo: '/use-callback' },
  { topic: 'useRef', file: 'src/hris/features/documents/DocumentsPage.tsx', demo: null },
  { topic: 'useId', file: 'src/hris/features/auth/LoginPage.tsx', demo: null },
  { topic: 'memo', file: 'src/hris/features/employees/EmployeeRow.tsx', demo: '/use-callback' },
  { topic: 'lazy + Suspense', file: 'src/hris/routes/hrisRoutes.tsx', demo: null },
  { topic: 'Error Boundary', file: 'src/hris/components/shared/ErrorBoundary.tsx', demo: null },
  { topic: 'Portal (Radix)', file: 'src/hris/components/ui/dialog.tsx', demo: null },
  { topic: 'useTransition / useDeferredValue', file: 'src/hris/features/employees/EmployeesPage.tsx', demo: null },
  { topic: 'Custom Hooks', file: 'src/hris/hooks/useDebounce.ts', demo: null },
  { topic: 'Controlled Forms (RHF + Zod)', file: 'src/hris/features/auth/LoginPage.tsx', demo: null },
  { topic: 'TanStack Query', file: 'src/hris/features/dashboard/DashboardPage.tsx', demo: null },
  { topic: 'Nested Routes', file: 'src/hris/routes/hrisRoutes.tsx', demo: null },
  { topic: 'Protected Routes', file: 'src/hris/components/shared/RequireAuth.tsx', demo: null },
  { topic: 'Lists & Keys', file: 'src/hris/features/employees/EmployeesPage.tsx', demo: null },
  { topic: 'Conditional Rendering', file: 'src/hris/features/dashboard/DashboardPage.tsx', demo: null },
  { topic: 'Lifting State', file: 'src/hris/features/reports/ReportsPage.tsx', demo: null },
]

export default function PlaybookPage() {
  return (
    <div>
      <PageHeader
        title="React Playbook"
        description="Every React concept used in this HRIS, with links to source files and isolated demos"
      />
      <div className="grid gap-3 md:grid-cols-2">
        {concepts.map((c) => (
          <Card key={c.topic}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{c.topic}</CardTitle>
              <CardDescription>
                <code className="text-xs">{c.file}</code>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              {c.demo && (
                <Link to={c.demo} className="text-sm text-primary hover:underline">
                  Isolated demo →
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
