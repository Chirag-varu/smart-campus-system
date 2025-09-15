"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface OTPFormProps {
  email: string
  onVerify: () => void
}

export function OTPForm({ email, onVerify }: OTPFormProps) {
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  // For demo: OTP is always '123456'
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setTimeout(() => {
      setIsLoading(false)
      if (otp === "123456") {
        toast({ title: "OTP Verified!", description: "Signup complete." })
        onVerify()
      } else {
        setError("Invalid OTP. Please try again.")
      }
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
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
          className="tracking-widest text-center text-lg"
        />
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        <Button type="submit" className="w-full mt-6" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify"}
        </Button>
      </Card>
    </form>
  )
}
