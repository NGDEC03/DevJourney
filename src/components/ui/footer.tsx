"use client"
import { useSession } from 'next-auth/react';
import Link  from 'next/link'
import React from 'react'

export default function Footer() {
   const { data: session, status } = useSession();
  
    // Check if the session is loading or not authenticated
    const isLoggedIn = status === "authenticated";
    const isLoading = status === "loading";  // Add loading check
  
    if (isLoading) {
      return (
        <></>
      );
    }
  
  return (

     <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
     <p className="text-xs text-gray-500 dark:text-gray-400">
       © 2025 DevJourney. All rights reserved.
     </p>
     <nav className="sm:ml-auto flex gap-4 sm:gap-6">
       <Link className="text-xs hover:underline underline-offset-4" href="#">
         Terms of Service
       </Link>
       <Link className="text-xs hover:underline underline-offset-4" href="#">
         Privacy
       </Link>
       <Link className="text-xs hover:underline underline-offset-4" href="/about">
         About
       </Link>
       <Link className="text-xs hover:underline underline-offset-4" href="#">
         Contact
       </Link>
     </nav>
   </footer>
  )
}