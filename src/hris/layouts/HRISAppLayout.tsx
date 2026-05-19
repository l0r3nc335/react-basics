import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  DollarSign,
  Target,
  Briefcase,
  Clock,
  Heart,
  FileText,
  BarChart3,
  Settings,
  BookOpen,
  LogOut,
  Menu,
  ChevronLeft,
} from 'lucide-react'
import { useAuth } from '@/hris/context/AuthContext'
import { Button } from '@/hris/components/ui/button'
import { ScrollArea } from '@/hris/components/ui/scroll-area'
import { Separator } from '@/hris/components/ui/separator'
import { ErrorBoundary } from '@/hris/components/shared/ErrorBoundary'
import { cn } from '@/hris/lib/utils'
import type { UserRole } from '@/hris/types'

interface NavItem {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  roles?: UserRole[]
}

const navItems: (NavItem & { end?: boolean })[] = [
  { to: '/hris', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/hris/employees', label: 'Employees', icon: Users },
  { to: '/hris/departments', label: 'Departments', icon: Building2 },
  { to: '/hris/leave', label: 'Leave', icon: Calendar },
  { to: '/hris/payroll', label: 'Payroll', icon: DollarSign },
  { to: '/hris/performance', label: 'Performance', icon: Target },
  { to: '/hris/recruitment', label: 'Recruitment', icon: Briefcase },
  { to: '/hris/attendance', label: 'Attendance', icon: Clock },
  { to: '/hris/benefits', label: 'Benefits', icon: Heart },
  { to: '/hris/documents', label: 'Documents', icon: FileText },
  { to: '/hris/reports', label: 'Reports', icon: BarChart3, roles: ['admin', 'manager'] },
  { to: '/hris/settings', label: 'Settings', icon: Settings, roles: ['admin'] },
  { to: '/hris/playbook', label: 'React Playbook', icon: BookOpen },
]

export default function HRISAppLayout() {
  const { user, logout, hasRole } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const visibleNav = navItems.filter((item) => !item.roles || item.roles.some((r) => hasRole(r)))

  const handleLogout = () => {
    logout()
    navigate('/hris/login')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          'hidden flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300 md:flex',
          collapsed ? 'w-16' : 'w-64',
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          {!collapsed && <span className="text-lg font-bold">Acme HRIS</span>}
          <Button
            variant="ghost"
            size="icon"
            className={cn('ml-auto', collapsed && 'mx-auto ml-0')}
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
          </Button>
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="flex flex-col gap-1 px-2">
            {visibleNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent',
                    isActive && 'bg-sidebar-accent font-medium',
                  )
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </nav>
        </ScrollArea>
        <Separator />
        <div className="p-4">
          {!collapsed && user && (
            <p className="mb-2 truncate text-xs text-muted-foreground">{user.name}</p>
          )}
          <Button variant="ghost" size={collapsed ? 'icon' : 'default'} className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-sidebar p-4 shadow-lg">
            <p className="mb-4 text-lg font-bold">Acme HRIS</p>
            <nav className="flex flex-col gap-1">
              {visibleNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent"
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b px-4 md:px-6">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← React Basics
          </Link>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
