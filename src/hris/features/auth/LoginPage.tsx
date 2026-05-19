import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useAuth } from '@/hris/context/AuthContext'
import { Button } from '@/hris/components/ui/button'
import { Input } from '@/hris/components/ui/input'
import { Label } from '@/hris/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/hris/components/ui/card'
import { Alert, AlertDescription } from '@/hris/components/ui/alert'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/hris'

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'admin@acme.com', password: 'password' },
  })

  if (user) {
    navigate('/hris', { replace: true })
    return null
  }

  const onSubmit = async (data: FormData) => {
    setError('')
    try {
      await login(data.email, data.password)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Acme HRIS</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Demo: admin@acme.com / manager@acme.com / employee@acme.com — password: <code>password</code>
            </p>
          </form>
          <p className="mt-4 text-center text-sm">
            <Link to="/" className="text-primary hover:underline">← Back to React Basics</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
