import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/hris/context/AuthContext'
import { queryClient } from '@/hris/lib/queryClient'
import { HRISRoutes } from '@/hris/routes/hrisRoutes'
import '@/hris/styles/hris.css'

export default function HRISRootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div id="hris-root" className="hris-app">
          <HRISRoutes />
          <Toaster position="top-right" richColors />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  )
}
