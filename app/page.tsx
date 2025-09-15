"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ErrorBoundary } from "@/components/ui/error-boundary"

export default function HomePage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <ErrorBoundary>
      <div className="min-h-screen gradient-primary flex items-center justify-center p-4 transition-colors duration-300">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 animate-fade-in">Smart Campus</h1>
            <p className="text-white/80 animate-fade-in-delay">Resource Management System</p>
          </div>

          <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-2xl transition-all duration-300 hover:shadow-3xl animate-slide-up">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl gradient-text">{isLogin ? "Welcome Back" : "Join Smart Campus"}</CardTitle>
              <CardDescription>
                {isLogin ? "Sign in to access your dashboard" : "Create your account to get started"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLogin ? <LoginForm /> : <RegisterForm />}

              <div className="mt-6 text-center">
                <Button
                  variant="ghost"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  )
}
