import prisma from "@/prismaClient";
import { NextRequest } from "next/server";
import { isSameDay, subDays } from "date-fns";

export async function GET(req: NextRequest) {
    const users = await prisma.user.findMany({
        where: { streak: { gte: 0 } },
        include: {
            submissions: {
                orderBy: { submittedAt: "desc" }, 
                take: 1 
            }
        }
    });

    const yesterday = subDays(new Date(), 1);

    const usersToReset = users.filter(user =>
        user.submissions.length === 0 || user.submissions[0]?.status!=="Accepted" ||  
        !isSameDay(user.submissions[0]?.submittedAt, yesterday) 
    );

    await Promise.all(usersToReset.map(user =>
        prisma.user.update({
            where: { userName: user.userName },
            data: { streak: 0 }
        })
    ));

    return new Response(JSON.stringify({ message: "Streaks reset successfully" }), { status: 200 });
}
