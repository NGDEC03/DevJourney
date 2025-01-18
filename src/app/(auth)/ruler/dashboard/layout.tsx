"use client"
import {useSession} from 'next-auth/react'
import {Alert,AlertTitle,AlertDescription} from '@/components/ui/alert'
export default function Layout({children}:{children:React.ReactNode}){
const {data:session}=useSession()
if(!session?.user?.isAdmin){
    return (
        <Alert>
      {/* <AlertCircle className="h-4 w-4" /> */}
      <AlertTitle>Not Permitted</AlertTitle>
      <AlertDescription>You do not have permission to access this page.</AlertDescription>
    </Alert>
    )
}

    return (
        <div>
            {children}
        </div>
    )
}