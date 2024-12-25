'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from 'lucide-react'
import Editor from '@monaco-editor/react'
// import HtmlPreview from '@/components/HtmlPreview'

// Simulated user data (in a real app, this would come from your API)
const users = [
  { id: 1, name: 'Alice', avatar: '/placeholder.svg?height=40&width=40' },
  { id: 2, name: 'Bob', avatar: '/placeholder.svg?height=40&width=40' },
  { id: 3, name: 'Charlie', avatar: '/placeholder.svg?height=40&width=40' },
  { id: 4, name: 'David', avatar: '/placeholder.svg?height=40&width=40' },
  { id: 5, name: 'Eve', avatar: '/placeholder.svg?height=40&width=40' },
]

export default function ChallengePage() {
  const [stage, setStage] = useState<'initial' | 'matching' | 'coding'>('initial')
  const [matchedUser, setMatchedUser] = useState<typeof users[0] | null>(null)
  const [time, setTime] = useState<number | null>(null)
  const [code, setCode] = useState("// Your code here")
  const [currentUserIndex, setCurrentUserIndex] = useState(0)
  const animationRef = useRef<number | null>(null)

  const handleSubmit = () => {
    console.log("Submitting code:", code)
    // Here you would typically send the code to your backend for evaluation
  }


  const startRound = () => {
    setStage('matching')
    animateMatching()
  }

  const animateMatching = () => {
    let startTime: number | null = null
    const duration = 5000 // 5 seconds for the entire animation

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime

      if (elapsed < duration) {
        setCurrentUserIndex((prevIndex) => (prevIndex + 1) % users.length)
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Animation complete, set matched user and move to coding stage
        const randomUser = users[Math.floor(Math.random() * users.length)]
        setMatchedUser(randomUser)
        setTime(1800) // 30 minutes in seconds
        setStage('coding')
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (stage === 'coding' && time !== null && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => (prevTime !== null ? prevTime - 1 : null))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [stage, time])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Coding Challenge</h1>
      {stage === 'initial' && (
        <Button onClick={startRound} className="mb-4">Start Round</Button>
      )}
      {stage === 'matching' && (
        <div className="flex flex-col items-center">
          <h2 className="text-xl mb-4">Finding a match...</h2>
          <div className="relative h-40 w-40 overflow-hidden bg-gray-100 rounded-full">
            <div className="absolute inset-x-0 bottom-0 flex justify-center pb-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={users[currentUserIndex].avatar} alt={users[currentUserIndex].name} />
                <AvatarFallback>{users[currentUserIndex].name[0]}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      )}
      {stage === 'coding' && matchedUser && time !== null && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Avatar className="mr-2 w-12 h-12">
                <AvatarImage src={matchedUser.avatar} alt={matchedUser.name} />
                <AvatarFallback>{matchedUser.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-lg">Matched with: {matchedUser.name}</span>
            </div>
            <div className="text-xl font-mono">{formatTime(time)}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Code Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <Editor
                height="60vh"
                defaultLanguage="javascript"
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  readOnly: false
                }}
              />
              <Button onClick={handleSubmit} className="w-full mt-4">Submit Solution</Button>
            </CardContent>
          </Card>
        </div>            <div>
              <h3 className="text-lg font-semibold mb-2">Preview</h3>
       
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

