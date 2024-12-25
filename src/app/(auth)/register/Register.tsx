'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const [topics, setTopics] = useState('')
  const router = useRouter()

  const handleInitialRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      console.log('Initial registration with:', email, password)
      setStep(2)
    } else {
      setError('Please fill in all fields')
    }
  }

  const handleTopicsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Topics submitted:', topics)
    router.push('/login')
  }

  const handleSkip = () => {
    console.log('Topics skipped')
    router.push('/login')
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{step === 1 ? 'Register' : 'Your Coding Interests'}</CardTitle>
          <CardDescription>
            {step === 1 
              ? 'Create a new account to get started' 
              : 'Tell us about your coding interests or skills'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <form onSubmit={handleInitialRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              <Button type="submit" className="w-full">Next</Button>
            </form>
          ) : (
            <form onSubmit={handleTopicsSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topics">
                  What topics are you fluent in or willing to learn?
                </Label>
                <Textarea
                  id="topics"
                  placeholder="E.g., Python, JavaScript, Machine Learning, Web Development..."
                  value={topics}
                  onChange={(e) => setTopics(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleSkip}>
                  Skip for now
                </Button>
                <Button type="submit">Complete Registration</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

