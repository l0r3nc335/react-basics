import { lazy, Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { Skeleton } from '@/hris/components/ui/skeleton'
import { RequireAuth } from '@/hris/components/shared/RequireAuth'
import HRISAppLayout from '@/hris/layouts/HRISAppLayout'

const LoginPage = lazy(() => import('@/hris/features/auth/LoginPage'))
const DashboardPage = lazy(() => import('@/hris/features/dashboard/DashboardPage'))
const EmployeesPage = lazy(() => import('@/hris/features/employees/EmployeesPage'))
const EmployeeDetailPage = lazy(() => import('@/hris/features/employees/EmployeeDetailPage'))
const DepartmentsPage = lazy(() => import('@/hris/features/departments/DepartmentsPage'))
const LeavePage = lazy(() => import('@/hris/features/leave/LeavePage'))
const PayrollPage = lazy(() => import('@/hris/features/payroll/PayrollPage'))
const PerformancePage = lazy(() => import('@/hris/features/performance/PerformancePage'))
const RecruitmentPage = lazy(() => import('@/hris/features/recruitment/RecruitmentPage'))
const AttendancePage = lazy(() => import('@/hris/features/attendance/AttendancePage'))
const BenefitsPage = lazy(() => import('@/hris/features/benefits/BenefitsPage'))
const DocumentsPage = lazy(() => import('@/hris/features/documents/DocumentsPage'))
const ReportsPage = lazy(() => import('@/hris/features/reports/ReportsPage'))
const SettingsPage = lazy(() => import('@/hris/features/settings/SettingsPage'))
const PlaybookPage = lazy(() => import('@/hris/pages/PlaybookPage'))

function PageLoader() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

function SuspenseWrap({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

export function HRISRoutes() {
  return (
    <Routes>
      <Route path="login" element={<SuspenseWrap><LoginPage /></SuspenseWrap>} />
      <Route
        element={
          <RequireAuth>
            <HRISAppLayout />
          </RequireAuth>
        }
      >
        <Route index element={<SuspenseWrap><DashboardPage /></SuspenseWrap>} />
        <Route path="employees" element={<SuspenseWrap><EmployeesPage /></SuspenseWrap>} />
        <Route path="employees/:id" element={<SuspenseWrap><EmployeeDetailPage /></SuspenseWrap>} />
        <Route path="departments" element={<SuspenseWrap><DepartmentsPage /></SuspenseWrap>} />
        <Route path="leave" element={<SuspenseWrap><LeavePage /></SuspenseWrap>} />
        <Route path="payroll" element={<SuspenseWrap><PayrollPage /></SuspenseWrap>} />
        <Route path="performance" element={<SuspenseWrap><PerformancePage /></SuspenseWrap>} />
        <Route path="recruitment" element={<SuspenseWrap><RecruitmentPage /></SuspenseWrap>} />
        <Route path="attendance" element={<SuspenseWrap><AttendancePage /></SuspenseWrap>} />
        <Route path="benefits" element={<SuspenseWrap><BenefitsPage /></SuspenseWrap>} />
        <Route path="documents" element={<SuspenseWrap><DocumentsPage /></SuspenseWrap>} />
        <Route path="reports" element={<SuspenseWrap><ReportsPage /></SuspenseWrap>} />
        <Route path="settings" element={<SuspenseWrap><SettingsPage /></SuspenseWrap>} />
        <Route path="playbook" element={<SuspenseWrap><PlaybookPage /></SuspenseWrap>} />
      </Route>
      <Route path="*" element={<Navigate to="/hris" replace />} />
    </Routes>
  )
}
