"use client"

import type React from "react"

import { useState } from "react"
import { OTPForm } from "@/components/auth/otp-form"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
    department: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showOTP, setShowOTP] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      setError("")
      if (formData.password !== formData.confirmPassword) {
        setIsLoading(false)
        setError('Passwords do not match')
        return
      }

      const resp = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          studentId: formData.studentId,
          department: formData.department,
          password: formData.password,
        }),
      })

      if (!resp.ok) {
        setIsLoading(false)
        try {
          const data = await resp.json()
          setError(data?.error || 'Registration failed')
        } catch {
          setError('Registration failed')
        }
        return
      }

      setIsLoading(false)
      setShowOTP(true)
    } catch (err) {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (showOTP) {
    return <OTPForm email={formData.email} onVerify={() => router.push("/student/dashboard")} />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="John"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            required
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            required
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="john.doe@campus.edu"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          required
          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Student ID and Department */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="studentId">Student ID</Label>
          <Input
            id="studentId"
            placeholder="CS2024001"
            value={formData.studentId}
            onChange={(e) => handleInputChange("studentId", e.target.value)}
            required
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select onValueChange={(value) => handleInputChange("department", value)}>
            <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent className="bg-gray-100">
              <SelectItem value="computer-science" className="hover:bg-gray-200">Computer Science</SelectItem>
              <SelectItem value="engineering" className="hover:bg-gray-200">Engineering</SelectItem>
              <SelectItem value="business" className="hover:bg-gray-200">Business</SelectItem>
              <SelectItem value="arts" className="hover:bg-gray-200">Arts & Sciences</SelectItem>
              <SelectItem value="medicine" className="hover:bg-gray-200">Medicine</SelectItem>
              <SelectItem value="law" className="hover:bg-gray-200">Law</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Password Fields */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
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
              <Eye className="h-4 w-4 text-muted-foreground" />
            ) : (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            required
            className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <Eye className="h-4 w-4 text-muted-foreground" />
            ) : (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && <div className="text-red-600 text-sm" role="alert">{error}</div>}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full gradient-primary text-white hover:opacity-90 transition-all duration-200"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <LoadingSpinner size="sm" className="mr-2" /> Creating Account...
          </span>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  )
}
