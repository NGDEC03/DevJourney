import prisma from "@/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const userName=body.userName
        

        if (!userName) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { userName },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        console.log(user);
        

        await prisma.user.update({
            where: { userName },
            data: { isVerified: true },
        });

        return NextResponse.json({ msg: "Email Verified Successfully" }, { status: 200 });
    } catch (err) {
        console.error("Error verifying email:", err);
        return NextResponse.json({ error: "Something Went Wrong!!" }, { status: 500 });
    }
}
