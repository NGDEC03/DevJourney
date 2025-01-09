import { prisma } from "@/prismaClient";
import { generateHashedPassword } from "@/utils/generateHash";
import { NextRequest,NextResponse } from "next/server";
interface RequestProp{
    userName:string,
    Email:string,
    Name:string,
    password:string,
    cName:string,
    avatar:string
}
export async function POST(req:NextRequest){
    const {userName,Email,Name,password,cName,avatar}=await req.json() as RequestProp
    const Hpassword=await generateHashedPassword(password)
    const updatedUser=await prisma.user.update({
        where:{
            userName
        },
        data:{
            Email,
            Name,
            password:Hpassword,
            cName,
            avatar
        }
    })
    
    return NextResponse.json(updatedUser)
}