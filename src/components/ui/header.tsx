"use client"
import { Code2, LogIn, LogOut, UserPlus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from './button'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Header(){
  const router=useRouter()
  const [isLoggedIn,setLoggedIn]=useState(false)
  const {data:session}=useSession()
    useEffect(()=>{
if(session?.user)setLoggedIn(true)
    },[session?.user])
  return (

 <header className="px-4 lg:px-6 h-14 flex items-center">
 <Link className="flex items-center justify-center" href="/">
   <Code2 className="h-6 w-6" />
   <span className="ml-2 text-lg font-bold">DevJourney</span>
 </Link>
 <nav className="ml-auto flex gap-4 sm:gap-6">
   <Link className="text-sm font-medium hover:underline underline-offset-4" href="/problems">
     Problems
   </Link>
   <Link className="text-sm font-medium hover:underline underline-offset-4" href="/learn">
     Learn
   </Link>
   <Link className="text-sm font-medium hover:underline underline-offset-4" href="/compete">
     Compete
   </Link>
   <Link className="text-sm font-medium hover:underline underline-offset-4" href="/challenge">
     Challenge
   </Link>
   <Link className="text-sm font-medium hover:underline underline-offset-4" href="/jobs">
     Jobs
   </Link>
   {isLoggedIn && (
     <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard">
       Dashboard
     </Link>
   )}
 </nav>
 {isLoggedIn ? (
   <Button variant="ghost" className="ml-4" onClick={()=>signOut()}>
     <LogOut className="h-4 w-4 mr-2" />
     Logout
   </Button>
 ) : (
   <div className="ml-4 flex gap-2">
     <Button variant="ghost" onClick={()=>router.push("/login")}>
       <LogIn className="h-4 w-4 mr-2" />
       Login
     </Button>
     <Button variant="ghost" onClick={()=>router.push("/register")}>
       <UserPlus className="h-4 w-4 mr-2" />
       Register
     </Button>
   </div>
 )}
</header>


  )
}
