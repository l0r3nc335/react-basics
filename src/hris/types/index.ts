export type UserRole = 'admin' | 'manager' | 'employee'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  employeeId?: string
  avatarUrl?: string
}

export type EmployeeStatus = 'active' | 'on_leave' | 'terminated'

export interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  jobTitle: string
  departmentId: string
  managerId?: string
  status: EmployeeStatus
  hireDate: string
  salary: number
  avatarUrl?: string
}

export interface Department {
  id: string
  name: string
  code: string
  managerId?: string
  headcount: number
  budget: number
}

export type LeaveStatus = 'pending' | 'approved' | 'denied' | 'cancelled'
export type LeaveType = 'vacation' | 'sick' | 'personal' | 'bereavement'

export interface LeaveRequest {
  id: string
  employeeId: string
  type: LeaveType
  startDate: string
  endDate: string
  days: number
  status: LeaveStatus
  reason: string
  createdAt: string
}

export interface PayrollRun {
  id: string
  period: string
  status: 'draft' | 'processed' | 'paid'
  totalAmount: number
  employeeCount: number
  processedAt?: string
}

export interface Payslip {
  id: string
  payrollRunId: string
  employeeId: string
  grossPay: number
  deductions: number
  netPay: number
  period: string
}

export type ReviewStatus = 'draft' | 'in_progress' | 'completed'

export interface PerformanceReview {
  id: string
  employeeId: string
  reviewerId: string
  period: string
  rating: number
  status: ReviewStatus
  summary: string
  goals: Goal[]
}

export interface Goal {
  id: string
  title: string
  progress: number
  dueDate: string
}

export type ApplicantStage =
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected'

export interface JobPosting {
  id: string
  title: string
  departmentId: string
  location: string
  type: 'full_time' | 'part_time' | 'contract'
  status: 'open' | 'closed'
  applicants: number
}

export interface Applicant {
  id: string
  jobId: string
  name: string
  email: string
  stage: ApplicantStage
  appliedAt: string
}

export interface AttendanceRecord {
  id: string
  employeeId: string
  date: string
  clockIn: string
  clockOut?: string
  hours: number
  status: 'present' | 'absent' | 'late' | 'remote'
}

export interface BenefitPlan {
  id: string
  name: string
  type: 'health' | 'dental' | 'vision' | '401k' | 'life'
  provider: string
  monthlyCost: number
  description: string
}

export interface Enrollment {
  id: string
  employeeId: string
  planId: string
  enrolledAt: string
  status: 'active' | 'pending' | 'cancelled'
}

export interface HRDocument {
  id: string
  name: string
  category: string
  employeeId?: string
  uploadedAt: string
  size: string
  url: string
}

export interface ReportDefinition {
  id: string
  name: string
  description: string
  category: string
}

export interface CompanySettings {
  id: string
  companyName: string
  timezone: string
  fiscalYearStart: string
  leavePolicyDays: number
}

export interface Role {
  id: string
  name: string
  permissions: string[]
}

export interface DashboardStats {
  totalEmployees: number
  activeEmployees: number
  onLeave: number
  openPositions: number
  pendingLeaveRequests: number
  payrollThisMonth: number
  headcountByDepartment: { name: string; count: number }[]
  hiringTrend: { month: string; hires: number }[]
  recentActivity: ActivityItem[]
}

export interface ActivityItem {
  id: string
  type: string
  message: string
  timestamp: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
