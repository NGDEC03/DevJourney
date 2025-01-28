import { NextRequest,NextResponse } from "next/server";
import prisma from '@/prismaClient'
export async function GET(req:NextRequest){
    try {
         const {searchParams}=new URL(req.url)
         const caseId=searchParams.get("case_Id") || ""
         await prisma.submission.create({
            data:{
                status:"Accepted",
                language:"JavaScript",
                problem:{
                    connect:{
                        problemId:"67853a1d15827bfa11f500d7"
                    }
                },
                user:{
                    connect:{
                        userName:"phantom458"
                    }
                }
            }
         })
            return NextResponse.json({
                status: "success",
            })
            
        } catch (error) {
            return NextResponse.json({ error: "An internal error occurred" }, { status: 500 });
        }

}