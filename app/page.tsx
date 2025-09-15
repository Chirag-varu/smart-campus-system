"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { motion, AnimatePresence } from "framer-motion"

export default function HomePage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex items-center justify-center bg-app dark:bg-app-dark p-6 relative overflow-hidden">
        {/* Floating background circles */}
        <div className="absolute inset-0 -z-10" />

        {/* Auth Card */}
        <div className="w-full max-w-md md:max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-[var(--sc-text-white)]">Smart Campus</h1>
            <p className="text-gray-600 dark:text-[var(--sc-muted-text)] mt-2 text-base md:text-lg">Resource Management System</p>
          </div>

          <Card className="rounded-2xl shadow-xl backdrop-blur-lg bg-[var(--sc-white)]/95 dark:bg-[var(--sc-accent-gray)]/95 border border-default">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-[var(--sc-text-white)]">
                {isLogin ? "Welcome Back 👋" : "Join Smart Campus 🚀"}
              </CardTitle>
              <CardDescription className="mt-1 text-gray-600 dark:text-[var(--sc-muted-text)]">
                {isLogin ? "Sign in to access your dashboard" : "Create your account to get started"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? "login" : "register"}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {isLogin ? <LoginForm /> : <RegisterForm />}
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 text-center">
                <Button
                  variant="link"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-gray-900 dark:text-[var(--sc-text-white)] hover:underline"
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  )
}
