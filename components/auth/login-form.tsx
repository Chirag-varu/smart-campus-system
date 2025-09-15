"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, User, Lock } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<"student" | "admin">("student")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      setError("")
      const resp = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!resp.ok) {
        setIsLoading(false)
        try {
          const data = await resp.json()
          setError(data?.error || 'Login failed')
        } catch {
          setError('Login failed')
        }
        return
      }
      const data = await resp.json()
      if (typeof window !== 'undefined') {
        localStorage.setItem('userName', `${data.user.firstName || ''} ${data.user.lastName || ''}`.trim())
        localStorage.setItem('userEmail', data.user.email)
      }
      if (userType === 'student') {
        router.push('/student/dashboard')
      } else {
        router.push('/admin/dashboard')
      }
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User Type Selection */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={userType === "student" ? "outline" : "default"}
          onClick={() => setUserType("student")}
          className="flex-1 transition-all duration-200"
        >
          <User className="w-4 h-4 mr-2" />
          Student
        </Button>
        <Button
          type="button"
          variant={userType === "student" ? "default" : "outline"}
          onClick={() => setUserType("admin")}
          className="flex-1 transition-all duration-200"
        >
          <Lock className="w-4 h-4 mr-2" />
          Admin
        </Button>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder={userType === 'student' ? 'Enter student email' : 'Enter admin email'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm" role="alert">{error}</div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full gradient-primary text-white hover:opacity-90 transition-all duration-200"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      {/* Demo credentials (subtle hint) */}
      <div className="text-[11px] text-muted-foreground mt-2 space-y-0.5">
        <div>Demo Admin: admin@campus.test / admin123</div>
        <div>Demo Student: chiragvaru.main@gmail.com / student123</div>
      </div>
    </form>
  )
}
