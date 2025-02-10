"use client"

import { useState, useEffect } from "react"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import Confetti from "react-confetti"
import { useSearchParams } from "next/navigation"
import { useWindowSize } from "react-use"
import { Card, CardContent } from "@/components/ui/card"
import prisma from "@/prismaClient"
import axios from "axios"

export default function VerifyEmail() {
    const params=useSearchParams()
  const [isVerifying, setIsVerifying] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const { width, height } = useWindowSize()

  useEffect(() => {
    const verifyEmail=async ()=>{
        const userName=params.get("user")
        console.log(userName);
        
        try{
          const res=await axios.post("/api/verify-email",{userName:userName})
          console.log(res.data);
          
          setIsVerified(true)
        }
        catch(err){
          console.error("Something Went Wrong!")
        }
        finally{
          setIsVerifying(false)
        }
    }
    verifyEmail()
  }, [params])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[400px] shadow-lg">
        <CardContent className="pt-6">
          {isVerifying ? <VerifyingMessage /> : isVerified ? <VerifiedMessage /> : <ErrorMessage />}
        </CardContent>
      </Card>
      {isVerified && <Confetti width={width} height={height} recycle={false} />}
    </div>
  )
}

export function VerifyingMessage() {
  return (
    <div className="space-y-4 text-center">
      <Loader2 className="animate-spin text-primary w-16 h-16 mx-auto" />
      <h1 className="text-4xl font-bold text-foreground">Verifying Your Email</h1>
      <p className="text-xl text-muted-foreground">Hold tight, we're working our magic! 🪄✨</p>
    </div>
  )
}

function VerifiedMessage() {
  return (
    <div className="space-y-4 text-center">
      <CheckCircle className="text-primary w-16 h-16 mx-auto animate-bounce" />
      <h1 className="text-4xl font-bold text-foreground">Email Verified!</h1>
      <p className="text-xl text-muted-foreground">Woohoo! You're officially part of DevJourney! 🎉</p>
    </div>
  )
}

function ErrorMessage() {
  return (
    <div className="space-y-4 text-center">
      <XCircle className="text-destructive w-16 h-16 mx-auto" />
      <h1 className="text-4xl font-bold text-foreground">Oops! Something went wrong</h1>
      <p className="text-xl text-muted-foreground">Don't worry, even computers have bad days. Try again later! 🤖</p>
    </div>
  )
}