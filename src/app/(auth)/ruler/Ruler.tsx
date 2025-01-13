'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { signIn } from 'next-auth/react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle,CircleArrowOutUpLeftIcon,PersonStanding } from 'lucide-react'
import Link from 'next/link'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from '@/components/ui/use-toast'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    const {toast}=useToast()
    e.preventDefault()

      const res = await signIn("user-login", {
            username,
            password,
            redirect: false, 
            callbackUrl: "/ruler/dashboard", 
          });
      
          if (res?.error) {
            toast({
              title: "⚠️ Login Failed",
              description: res.error as string,
              variant: "destructive", 
              duration: 2000, 
            });
          } else {
            toast({
              title: "🎉 Login Successful!",
              description: "You're all set! 🚀 Login to explore your dashboard.", 
              duration: 1000, 
            });
            router.push( "/ruler/dashboard"); 
          }
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login - Admin</CardTitle>
          <CardDescription>Welcome back! Please login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full">Login</Button>
          </form>
          
        </CardContent>
      </Card>
    </div>
  )
}