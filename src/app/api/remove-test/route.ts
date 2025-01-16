import { NextRequest,NextResponse } from "next/server";
import {prisma} from '@/prismaClient'
export async function GET(req:NextRequest){
    try {
         const {searchParams}=new URL(req.url)
         const caseId=searchParams.get("case_Id") || ""
            await prisma.case.delete({
                where:{
                    caseId
                }
    })
            return NextResponse.json({
                status: "success",
            })
            
        } catch (error) {
            return NextResponse.json({ error: "An internal error occurred" }, { status: 500 });
        }

}