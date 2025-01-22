import { prisma } from "@/prismaClient";
import { generateHashedPassword } from "@/utils/generateHash";
import { NextRequest,NextResponse } from "next/server";
interface RequestProp{
    userName:string,
    email:string,
    Name:string,
    password:string,
    cName:string,
    avatar:string
}
export async function POST(req:NextRequest){
    const {userName,email,Name,password,cName,avatar}=await req.json() as RequestProp
    const Hpassword=await generateHashedPassword(password)
    const updatedUser=await prisma.user.update({
        where:{
            userName
        },
        data:{
            email,
            name:Name,
            password:Hpassword,
            companyName:cName,
            avatar
        }
    })
    
    return NextResponse.json(updatedUser)
}