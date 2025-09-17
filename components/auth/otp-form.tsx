"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface OTPFormProps {
  email: string
  onVerify: () => void
}

export function OTPForm({ email, onVerify }: OTPFormProps) {
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)
    setError("")
    try {
      const resp = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      })
      
      if (resp.ok) {
        setIsVerified(true)
        const data = await resp.json()
        
        toast({
          title: 'OTP Verified!',
          description: 'Signup complete. Redirecting to dashboard...',
          variant: "success"
        })
        
        // Short delay before redirecting for better user experience
        setTimeout(() => {
          onVerify()
        }, 1500)
      } else {
        setIsVerifying(false)
        setError('Invalid or expired OTP. Please try again.')
      }
    } catch (err) {
      setIsVerifying(false)
      setError('Something went wrong. Please try again.')
    }
  }

  const handleResend = async () => {
    setIsLoading(true)
    setError("")
    try {
      const resp = await fetch('/api/generate-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      setIsLoading(false)
      if (resp.ok) {
        toast({ title: 'OTP Sent', description: 'A new OTP has been sent to your email.' })
      } else {
        setError('Failed to resend OTP. Please try again later.')
      }
    } catch (err) {
      setIsLoading(false)
      setError('Failed to resend OTP. Please try again later.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <Card className={`p-6 transition-all duration-300 ${isVerified ? 'border-green-500 shadow-lg shadow-green-100' : ''}`}>
        <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
        {isVerified ? (
          <div className="py-4 text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-green-600">OTP Verified!</h3>
            <p className="text-gray-600 mt-2">Signup complete. Redirecting to dashboard...</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-muted-foreground text-sm">Enter the 6-digit OTP sent to <span className="font-semibold">{email}</span></p>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
              className="tracking-widest text-center text-lg font-medium transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-gray-400"
            />
            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          </>
        )}
        {!isVerified && (
          <>
            <Button 
              type="submit" 
              className="w-full mt-6 transition-all duration-200 gradient-primary hover:opacity-90 hover:shadow-md transform hover:-translate-y-0.5 focus:ring-2 focus:ring-primary/20" 
              disabled={isVerifying || isLoading}
            >
              {isVerifying ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner size="sm" className="mr-2 animate-spin" /> Verifying...
                </span>
              ) : (
                "Verify"
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full mt-2 transition-all duration-200 hover:bg-gray-100 hover:border-gray-300 focus:ring-2 focus:ring-primary/20" 
              onClick={handleResend} 
              disabled={isVerifying || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner size="sm" className="mr-2 animate-spin" /> Sending...
                </span>
              ) : (
                "Resend OTP"
              )}
            </Button>
          </>
        )}
      </Card>
    </form>
  )
}
