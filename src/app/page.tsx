"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Loader from '@/lib/loader.gif'
import { Input } from "@/components/ui/input"
import { useSession } from "next-auth/react"
import { Code2, GraduationCap, Users, Github, Loader2 } from 'lucide-react'
import Image from "next/image"
import { use, useEffect } from "react"
import { useRouter } from "next/navigation"


export default function LandingPage() {
  
  const router = useRouter();
  const {data:session,status}=useSession({required:false})
  useEffect(() => {
    router.push("/");
  }, [status, router]);
  const isLoggedIn = status === "authenticated";
  if (status==="loading") {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center">
      <Image className="scale-50" src={Loader} alt="Loading..." />
      <div className="mt-8 text-center">
        <p className="text-2xl md:text-3xl font-bold text-white mb-2 animate-pulse">
          Hang tight, we're powering up!
        </p>
        <p className="text-lg md:text-xl  opacity-80">
          <span className="inline-block animate-bounce ">⚡</span> Supercharging your coding experience <span className="inline-block animate-bounce">⚡</span>
        </p>
        <p className="mt-4 text-lg md:text-base  opacity-70 animate-pulse">
          Taking too long? Hit <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-white rounded-lg shadow-sm">CTRL</kbd> + <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-white rounded-lg shadow-sm">R</kbd>
        </p>
      </div>
    </div>)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full flex justify-center items-center py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none mb-4">
                  Master Coding, Ace Interviews
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-800 md:text-xl">
                  Sharpen your skills, solve challenging problems, and land your dream job in tech.
                </p>
              </div>
              <div className="space-x-4">
                <Link href={"/register"}><Button>Get Started</Button></Link>
                <Link href={"/login"}><Button variant="outline">Resume Journey</Button></Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-300 flex justify-center items-center">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Code2 className="h-10 w-10 mb-2" />
                <h2 className="text-xl font-bold">1000+ Coding Challenges</h2>
                <p className="text-center text-gray-700 ">
                  From easy to hard, covering all major algorithms and data structures.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <GraduationCap className="h-10 w-10 mb-2" />
                <h2 className="text-xl font-bold">Interactive Learning Paths</h2>
                <p className="text-center text-gray-700">
                  Structured courses to guide you from basics to advanced topics.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Users className="h-10 w-10 mb-2" />
                <h2 className="text-xl font-bold">Vibrant Community</h2>
                <p className="text-center text-gray-700">
                  Connect with fellow coders, share solutions, and learn together.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

