import { prisma } from "@/prismaClient";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
    try {
        const { userName } = await req.json()
        const user = await prisma.user.findUnique({
            where: {
                userName
            },
            include: {
                problems: true,
                submissions: true
            }
        })
        return NextResponse.json(user, { status: 201 })
    }
    catch (err) {
        console.error(err)
        return NextResponse.json({ err: "Some Error Occured!" }, { status: 500 })
    }
}
