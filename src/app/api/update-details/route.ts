import prisma from "@/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
try{const body=await req.json()
const {userName,Email,Name,password,cName}=body
const user=await prisma.user.update({
    where:{
        userName
    },
    data:{
        userName,
        Email,
        Name,
        password,
        cName
    }
})
return NextResponse.json({user})}
catch(err){
    return NextResponse.json({err})
}
}