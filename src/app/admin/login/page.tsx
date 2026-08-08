import type { Metadata } from 'next'
import { LoginForm } from '@/components/admin/LoginForm'

export const metadata: Metadata = {
  title: 'Admin Sign In | Soulstys Meridian Wellness',
  robots: { index: false, follow: false },
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-velvet-gradient flex items-center justify-center px-6 py-16">
      <LoginForm />
    </div>
  )
}
