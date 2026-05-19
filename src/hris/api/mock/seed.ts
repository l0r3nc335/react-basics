import type {
  Applicant,
  AttendanceRecord,
  BenefitPlan,
  CompanySettings,
  DashboardStats,
  Department,
  Employee,
  Enrollment,
  HRDocument,
  JobPosting,
  LeaveRequest,
  PayrollRun,
  Payslip,
  PerformanceReview,
  ReportDefinition,
  Role,
  User,
} from '@/hris/types'

export const mockUsers: User[] = [
  { id: 'u1', email: 'admin@acme.com', name: 'Alex Admin', role: 'admin', employeeId: 'e1' },
  { id: 'u2', email: 'manager@acme.com', name: 'Morgan Manager', role: 'manager', employeeId: 'e2' },
  { id: 'u3', email: 'employee@acme.com', name: 'Jamie Employee', role: 'employee', employeeId: 'e3' },
]

export const mockDepartments: Department[] = [
  { id: 'd1', name: 'Engineering', code: 'ENG', managerId: 'e2', headcount: 12, budget: 1200000 },
  { id: 'd2', name: 'Human Resources', code: 'HR', managerId: 'e1', headcount: 4, budget: 400000 },
  { id: 'd3', name: 'Sales', code: 'SAL', managerId: 'e5', headcount: 8, budget: 800000 },
  { id: 'd4', name: 'Marketing', code: 'MKT', managerId: 'e8', headcount: 6, budget: 600000 },
  { id: 'd5', name: 'Finance', code: 'FIN', managerId: 'e10', headcount: 5, budget: 500000 },
]

const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Blake', 'Drew', 'Emery', 'Finley', 'Harper', 'Jamie', 'Kendall', 'Logan', 'Noah', 'Parker', 'Reese', 'Sage']
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris']
const titles = ['Software Engineer', 'Senior Engineer', 'Product Manager', 'HR Specialist', 'Sales Rep', 'Marketing Lead', 'Accountant', 'Designer', 'Data Analyst', 'Support Specialist']

export const mockEmployees: Employee[] = Array.from({ length: 30 }, (_, i) => {
  const id = `e${i + 1}`
  const dept = mockDepartments[i % mockDepartments.length]
  return {
    id,
    firstName: firstNames[i % firstNames.length],
    lastName: lastNames[i % lastNames.length],
    email: `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[i % lastNames.length].toLowerCase()}@acme.com`,
    phone: `+1-555-${String(1000 + i).slice(-4)}`,
    jobTitle: titles[i % titles.length],
    departmentId: dept.id,
    managerId: i > 2 ? 'e2' : undefined,
    status: i === 5 ? 'on_leave' : i === 28 ? 'terminated' : 'active',
    hireDate: `202${(i % 4) + 1}-${String((i % 12) + 1).padStart(2, '0')}-15`,
    salary: 60000 + i * 2500,
    avatarUrl: undefined,
  }
})

export const mockLeaveRequests: LeaveRequest[] = [
  { id: 'l1', employeeId: 'e3', type: 'vacation', startDate: '2026-06-01', endDate: '2026-06-05', days: 5, status: 'pending', reason: 'Family trip', createdAt: '2026-05-10T10:00:00Z' },
  { id: 'l2', employeeId: 'e5', type: 'sick', startDate: '2026-05-12', endDate: '2026-05-13', days: 2, status: 'approved', reason: 'Medical', createdAt: '2026-05-11T08:00:00Z' },
  { id: 'l3', employeeId: 'e7', type: 'personal', startDate: '2026-05-20', endDate: '2026-05-20', days: 1, status: 'pending', reason: 'Personal errand', createdAt: '2026-05-12T14:00:00Z' },
  { id: 'l4', employeeId: 'e9', type: 'vacation', startDate: '2026-07-01', endDate: '2026-07-10', days: 10, status: 'approved', reason: 'Summer vacation', createdAt: '2026-05-01T09:00:00Z' },
  { id: 'l5', employeeId: 'e11', type: 'bereavement', startDate: '2026-05-15', endDate: '2026-05-17', days: 3, status: 'approved', reason: 'Family loss', createdAt: '2026-05-14T11:00:00Z' },
]

export const mockPayrollRuns: PayrollRun[] = [
  { id: 'pr1', period: 'May 2026', status: 'paid', totalAmount: 245000, employeeCount: 28, processedAt: '2026-05-01T00:00:00Z' },
  { id: 'pr2', period: 'April 2026', status: 'paid', totalAmount: 242000, employeeCount: 27, processedAt: '2026-04-01T00:00:00Z' },
  { id: 'pr3', period: 'June 2026', status: 'draft', totalAmount: 248000, employeeCount: 28 },
]

export const mockPayslips: Payslip[] = mockEmployees.slice(0, 10).map((emp, i) => ({
  id: `ps${i + 1}`,
  payrollRunId: 'pr1',
  employeeId: emp.id,
  grossPay: emp.salary / 12,
  deductions: emp.salary / 12 * 0.22,
  netPay: (emp.salary / 12) * 0.78,
  period: 'May 2026',
}))

export const mockPerformanceReviews: PerformanceReview[] = mockEmployees.slice(0, 8).map((emp, i) => ({
  id: `rv${i + 1}`,
  employeeId: emp.id,
  reviewerId: 'e2',
  period: 'Q1 2026',
  rating: 3 + (i % 3),
  status: i % 3 === 0 ? 'completed' : i % 3 === 1 ? 'in_progress' : 'draft',
  summary: `Performance review for ${emp.firstName} ${emp.lastName}`,
  goals: [
    { id: `g${i}a`, title: 'Complete project milestones', progress: 60 + i * 5, dueDate: '2026-06-30' },
    { id: `g${i}b`, title: 'Improve team collaboration', progress: 40 + i * 3, dueDate: '2026-09-30' },
  ],
}))

export const mockJobPostings: JobPosting[] = [
  { id: 'j1', title: 'Senior React Developer', departmentId: 'd1', location: 'Remote', type: 'full_time', status: 'open', applicants: 24 },
  { id: 'j2', title: 'HR Coordinator', departmentId: 'd2', location: 'New York', type: 'full_time', status: 'open', applicants: 12 },
  { id: 'j3', title: 'Sales Executive', departmentId: 'd3', location: 'Chicago', type: 'full_time', status: 'open', applicants: 18 },
  { id: 'j4', title: 'Marketing Intern', departmentId: 'd4', location: 'Remote', type: 'part_time', status: 'closed', applicants: 45 },
]

export const mockApplicants: Applicant[] = [
  { id: 'a1', jobId: 'j1', name: 'Chris Candidate', email: 'chris@email.com', stage: 'interview', appliedAt: '2026-05-01T00:00:00Z' },
  { id: 'a2', jobId: 'j1', name: 'Dana Developer', email: 'dana@email.com', stage: 'screening', appliedAt: '2026-05-05T00:00:00Z' },
  { id: 'a3', jobId: 'j2', name: 'Pat People', email: 'pat@email.com', stage: 'applied', appliedAt: '2026-05-10T00:00:00Z' },
]

export const mockAttendance: AttendanceRecord[] = mockEmployees.slice(0, 15).flatMap((emp, ei) =>
  Array.from({ length: 5 }, (_, di) => ({
    id: `att-${emp.id}-${di}`,
    employeeId: emp.id,
    date: `2026-05-${String(12 + di).padStart(2, '0')}`,
    clockIn: '09:00',
    clockOut: di === 4 && ei % 3 === 0 ? undefined : '17:30',
    hours: di === 4 && ei % 3 === 0 ? 0 : 8.5,
    status: (di === 4 && ei % 3 === 0 ? 'absent' : ei % 4 === 0 ? 'remote' : 'present') as AttendanceRecord['status'],
  })),
)

export const mockBenefitPlans: BenefitPlan[] = [
  { id: 'bp1', name: 'Premium Health', type: 'health', provider: 'BlueCross', monthlyCost: 450, description: 'Comprehensive health coverage' },
  { id: 'bp2', name: 'Dental Plus', type: 'dental', provider: 'DentalCare', monthlyCost: 35, description: 'Full dental coverage' },
  { id: 'bp3', name: 'Vision Basic', type: 'vision', provider: 'EyeCare', monthlyCost: 15, description: 'Annual eye exams and lenses' },
  { id: 'bp4', name: '401k Match', type: '401k', provider: 'Fidelity', monthlyCost: 0, description: 'Company matches up to 6%' },
]

export const mockEnrollments: Enrollment[] = mockEmployees.slice(0, 12).map((emp, i) => ({
  id: `en${i + 1}`,
  employeeId: emp.id,
  planId: mockBenefitPlans[i % mockBenefitPlans.length].id,
  enrolledAt: '2026-01-01T00:00:00Z',
  status: 'active' as const,
}))

export const mockDocuments: HRDocument[] = [
  { id: 'doc1', name: 'Employee Handbook 2026', category: 'Policy', uploadedAt: '2026-01-15T00:00:00Z', size: '2.4 MB', url: '#' },
  { id: 'doc2', name: 'W-4 Form', category: 'Tax', employeeId: 'e3', uploadedAt: '2026-02-01T00:00:00Z', size: '156 KB', url: '#' },
  { id: 'doc3', name: 'Offer Letter', category: 'Employment', employeeId: 'e5', uploadedAt: '2025-03-10T00:00:00Z', size: '89 KB', url: '#' },
  { id: 'doc4', name: 'Benefits Summary', category: 'Benefits', uploadedAt: '2026-01-01T00:00:00Z', size: '512 KB', url: '#' },
]

export const mockReports: ReportDefinition[] = [
  { id: 'r1', name: 'Headcount Report', description: 'Employee count by department and status', category: 'Workforce' },
  { id: 'r2', name: 'Leave Balance', description: 'Remaining leave days per employee', category: 'Time Off' },
  { id: 'r3', name: 'Payroll Summary', description: 'Monthly payroll totals and breakdown', category: 'Payroll' },
  { id: 'r4', name: 'Turnover Analysis', description: 'Hires and terminations over time', category: 'Analytics' },
]

export const mockSettings: CompanySettings = {
  id: 's1',
  companyName: 'Acme Corporation',
  timezone: 'America/New_York',
  fiscalYearStart: '01-01',
  leavePolicyDays: 20,
}

export const mockRoles: Role[] = [
  { id: 'role1', name: 'Admin', permissions: ['*'] },
  { id: 'role2', name: 'Manager', permissions: ['employees:read', 'leave:approve', 'reports:read'] },
  { id: 'role3', name: 'Employee', permissions: ['profile:read', 'leave:create', 'documents:read'] },
]

export function buildDashboardStats(): DashboardStats {
  const active = mockEmployees.filter((e) => e.status === 'active').length
  return {
    totalEmployees: mockEmployees.length,
    activeEmployees: active,
    onLeave: mockEmployees.filter((e) => e.status === 'on_leave').length,
    openPositions: mockJobPostings.filter((j) => j.status === 'open').length,
    pendingLeaveRequests: mockLeaveRequests.filter((l) => l.status === 'pending').length,
    payrollThisMonth: mockPayrollRuns[0]?.totalAmount ?? 0,
    headcountByDepartment: mockDepartments.map((d) => ({
      name: d.name,
      count: mockEmployees.filter((e) => e.departmentId === d.id && e.status === 'active').length,
    })),
    hiringTrend: [
      { month: 'Jan', hires: 2 },
      { month: 'Feb', hires: 1 },
      { month: 'Mar', hires: 3 },
      { month: 'Apr', hires: 2 },
      { month: 'May', hires: 4 },
    ],
    recentActivity: [
      { id: 'act1', type: 'leave', message: 'Jamie Employee submitted a leave request', timestamp: '2026-05-12T10:00:00Z' },
      { id: 'act2', type: 'hire', message: 'New hire onboarded in Engineering', timestamp: '2026-05-11T15:30:00Z' },
      { id: 'act3', type: 'payroll', message: 'May payroll processed successfully', timestamp: '2026-05-01T08:00:00Z' },
      { id: 'act4', type: 'review', message: 'Q1 performance reviews completed', timestamp: '2026-04-28T12:00:00Z' },
    ],
  }
}
