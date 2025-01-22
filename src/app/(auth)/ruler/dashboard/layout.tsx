"use client"
import {useSession} from 'next-auth/react'
import {Alert,AlertTitle,AlertDescription} from '@/components/ui/alert'

interface User{
    id: string;
    userName: string;
    Name: string;
    Email: string;
    avatar: string;
    isAdmin:boolean;
}

export default function Layout({children}:{children:React.ReactNode}){
const {data:session}=useSession()
const user=session?.user as User
if(!session || !user.isAdmin){
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