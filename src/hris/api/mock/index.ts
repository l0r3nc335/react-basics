import type { PaginatedResponse } from '@/hris/types'
import {
  buildDashboardStats,
  mockApplicants,
  mockAttendance,
  mockBenefitPlans,
  mockDepartments,
  mockDocuments,
  mockEmployees,
  mockEnrollments,
  mockJobPostings,
  mockLeaveRequests,
  mockPayrollRuns,
  mockPayslips,
  mockPerformanceReviews,
  mockReports,
  mockRoles,
  mockSettings,
  mockUsers,
} from './seed'

// Mutable in-memory store for mock mutations
let employees = [...mockEmployees]
let departments = [...mockDepartments]
let leaveRequests = [...mockLeaveRequests]
let documents = [...mockDocuments]
let jobPostings = [...mockJobPostings]
let applicants = [...mockApplicants]
let enrollments = [...mockEnrollments]

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms + Math.random() * 200))

function parsePath(path: string): { resource: string; id?: string; sub?: string } {
  const clean = path.replace(/^\//, '').split('?')[0]
  const parts = clean.split('/')
  return { resource: parts[0] ?? '', id: parts[1], sub: parts[2] }
}

function paginate<T>(items: T[], searchParams?: URLSearchParams): PaginatedResponse<T> {
  const page = Number(searchParams?.get('page') ?? 1)
  const pageSize = Number(searchParams?.get('pageSize') ?? 20)
  const start = (page - 1) * pageSize
  return { data: items.slice(start, start + pageSize), total: items.length, page, pageSize }
}

export async function mockResolver<T>(path: string, init?: RequestInit): Promise<T> {
  await delay()
  const method = (init?.method ?? 'GET').toUpperCase()
  const [pathname, query] = path.split('?')
  const params = new URLSearchParams(query)
  const { resource, id } = parsePath(pathname)

  // Auth
  if (pathname === '/auth/login' && method === 'POST') {
    const body = JSON.parse(init?.body as string) as { email: string; password: string }
    const user = mockUsers.find((u) => u.email === body.email)
    if (!user || body.password !== 'password') {
      throw new Error('Invalid credentials')
    }
    return { user, token: `mock-token-${user.id}` } as T
  }

  if (pathname === '/auth/me') {
    return mockUsers[0] as T
  }

  // Dashboard
  if (pathname === '/dashboard/stats') {
    return buildDashboardStats() as T
  }

  // Employees
  if (resource === 'employees') {
    if (method === 'GET' && !id) {
      let filtered = [...employees]
      const search = params.get('search')
      const dept = params.get('departmentId')
      const status = params.get('status')
      if (search) {
        const q = search.toLowerCase()
        filtered = filtered.filter(
          (e) =>
            e.firstName.toLowerCase().includes(q) ||
            e.lastName.toLowerCase().includes(q) ||
            e.email.toLowerCase().includes(q),
        )
      }
      if (dept) filtered = filtered.filter((e) => e.departmentId === dept)
      if (status) filtered = filtered.filter((e) => e.status === status)
      return paginate(filtered, params) as T
    }
    if (method === 'GET' && id) {
      const emp = employees.find((e) => e.id === id)
      if (!emp) throw new Error('Employee not found')
      return emp as T
    }
    if (method === 'POST') {
      const body = JSON.parse(init?.body as string)
      const newEmp = { ...body, id: `e${employees.length + 1}` }
      employees = [...employees, newEmp]
      return newEmp as T
    }
    if (method === 'PATCH' && id) {
      const body = JSON.parse(init?.body as string)
      employees = employees.map((e) => (e.id === id ? { ...e, ...body } : e))
      return employees.find((e) => e.id === id) as T
    }
    if (method === 'DELETE' && id) {
      employees = employees.filter((e) => e.id !== id)
      return { success: true } as T
    }
  }

  // Departments
  if (resource === 'departments') {
    if (method === 'GET' && !id) return departments as T
    if (method === 'GET' && id) {
      const dept = departments.find((d) => d.id === id)
      if (!dept) throw new Error('Department not found')
      return dept as T
    }
    if (method === 'PATCH' && id) {
      const body = JSON.parse(init?.body as string)
      departments = departments.map((d) => (d.id === id ? { ...d, ...body } : d))
      return departments.find((d) => d.id === id) as T
    }
  }

  // Leave
  if (resource === 'leave') {
    if (method === 'GET' && !id) return leaveRequests as T
    if (method === 'POST') {
      const body = JSON.parse(init?.body as string)
      const req = { ...body, id: `l${leaveRequests.length + 1}`, status: 'pending', createdAt: new Date().toISOString() }
      leaveRequests = [...leaveRequests, req]
      return req as T
    }
    if (method === 'PATCH' && id) {
      const body = JSON.parse(init?.body as string)
      leaveRequests = leaveRequests.map((l) => (l.id === id ? { ...l, ...body } : l))
      return leaveRequests.find((l) => l.id === id) as T
    }
  }

  // Payroll
  if (pathname === '/payroll/runs') return mockPayrollRuns as T
  if (pathname === '/payroll/payslips') return mockPayslips as T

  // Recruitment
  if (pathname === '/recruitment/jobs' && method === 'GET') return jobPostings as T
  if (pathname === '/recruitment/jobs' && method === 'POST') {
    const body = JSON.parse(init?.body as string)
    const job = { ...body, id: `j${jobPostings.length + 1}`, applicants: 0 }
    jobPostings = [...jobPostings, job]
    return job as T
  }
  if (pathname.startsWith('/recruitment/jobs/') && method === 'GET') {
    const jobId = pathname.split('/').pop()
    return jobPostings.find((j) => j.id === jobId) as T
  }
  if (pathname === '/recruitment/applicants' && method === 'GET') return applicants as T
  if (pathname.startsWith('/recruitment/applicants/') && method === 'PATCH') {
    const appId = pathname.split('/').pop()
    const body = JSON.parse(init?.body as string)
    applicants = applicants.map((a) => (a.id === appId ? { ...a, ...body } : a))
    return applicants.find((a) => a.id === appId) as T
  }

  // Performance
  if (resource === 'performance' && method === 'GET') return mockPerformanceReviews as T
  if (pathname.startsWith('/performance/') && method === 'PATCH') {
    const reviewId = pathname.split('/').pop()
    const body = JSON.parse(init?.body as string)
    return { id: reviewId, ...body } as T
  }

  // Attendance
  if (resource === 'attendance') return mockAttendance as T

  // Benefits
  if (pathname === '/benefits/plans') return mockBenefitPlans as T
  if (pathname === '/benefits/enrollments') {
    if (method === 'POST') {
      const body = JSON.parse(init?.body as string)
      const en = { ...body, id: `en${enrollments.length + 1}`, enrolledAt: new Date().toISOString(), status: 'active' }
      enrollments = [...enrollments, en]
      return en as T
    }
    return enrollments as T
  }

  // Documents
  if (resource === 'documents') {
    if (method === 'GET') return documents as T
    if (method === 'POST') {
      const body = JSON.parse(init?.body as string)
      const doc = { ...body, id: `doc${documents.length + 1}`, uploadedAt: new Date().toISOString() }
      documents = [...documents, doc]
      return doc as T
    }
  }

  // Reports
  if (resource === 'reports') {
    if (method === 'POST') {
      return { id: params.get('id'), status: 'generated', url: '#', generatedAt: new Date().toISOString() } as T
    }
    return mockReports as T
  }

  // Settings
  if (pathname === '/settings') {
    if (method === 'PATCH') {
      const body = JSON.parse(init?.body as string)
      return { ...mockSettings, ...body } as T
    }
    return mockSettings as T
  }
  if (pathname === '/settings/roles') return mockRoles as T

  throw new Error(`Mock route not found: ${method} ${path}`)
}
