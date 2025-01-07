'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from 'axios'

import { AlertCircle, CircleArrowOutUpLeftIcon, Link2, LinkIcon} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TagSelector } from '@/components/TagSelector'

import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'
export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const router = useRouter()
  const {toast}=useToast()

  const handleInitialRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password && name) {
      setStep(2)
    } else {
      setError('Please fill in all fields')
    }
  }

  const handleTopicsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try{
const res=await axios.post("/api/register",{Email:email,password,selectedTags,Name:name})
console.log(res.data);

    }
    catch(err){
      toast({
        title: "⚠️ Registration Failed",
        description: err as string,
        variant: "destructive", 
        duration: 2000, 
      });
    }
    toast({
      title: "🎉 Registration Successful!",
      description: "You're all set! 🚀 Login to explore your dashboard.", 
      duration: 2000, 
    });
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
              : 'Select or add your coding interests or skills'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <form onSubmit={handleInitialRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
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
                <TagSelector
                  selectedTags={selectedTags}
                  onTagsChange={setSelectedTags}
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
          <div className="mt-6 text-center text-sm flex justify-center">
            <span className="text-muted-foreground">
              Already have an account?{' '}
            </span>
       
           <Link href='/login' className='ml-2'>
           <CircleArrowOutUpLeftIcon
         ></CircleArrowOutUpLeftIcon>
           </Link>
           
          </div>
        </CardContent>
      </Card>
      
    </div>
  )
}

