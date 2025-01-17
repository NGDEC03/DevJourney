'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Rocket, Mail, ArrowRight } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import axios from 'axios'

export default function ComingSoonLearnPage() {
  const [email, setEmail] = useState('')
  const [isValidEmail, setIsValidEmail] = useState(false)

  useEffect(() => {
    setIsValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  }, [email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isValidEmail) {
      try {
        if(localStorage.getItem("email")){
          toast({
            title: "🎉 You're probably already on the Launch Pad! 🚀",
            // description: "Prepare for takeoff! We'll alert you when Learning Paths are ready to explore.",
            duration: 1000,
            variant: "destructive"
          });
          return;
        }
        await axios.post("/api/subscribe",{email:email})
        localStorage.setItem("email",email)
        setEmail('')
        toast({
          title: "🎉 You're on the Launch Pad! 🚀",
          description: "Prepare for takeoff! We'll alert you when Learning Paths are ready to explore.",
          duration: 1000,
        });
      } catch (error) {
        toast({
          title: "Houston, we have a problem! 🛰️",
          description: "Our systems encountered a glitch. Please try again later.",
          variant: "destructive",
        })
        
      }
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2">
            <div className="p-8 flex flex-col justify-center">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-gray-800">Learning Paths</h1>
                <h2 className="text-xl font-semibold mb-4 text-blue-600">Coming Soon</h2>
                <p className="text-gray-600 mb-6">
                  We're crafting an exceptional learning experience for you. Be the first to know when we launch!
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-grow"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                    disabled={!isValidEmail}
                  >
                    Notify Me
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
            <div className="bg-blue-600 p-8 flex items-center justify-center">
              <div>
                <Rocket className="text-white w-48 h-48" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

