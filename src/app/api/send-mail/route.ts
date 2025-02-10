import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendMail } from "@/utils/sendMail";
import dayjs from "dayjs";

const prisma = new PrismaClient();
const curr=new Date()
export const runtime = 'nodejs';


export async function POST(request: Request) {
if(curr.getHours()<20 || curr.getHours()>=21)return NextResponse.json({message:"Not Valid"});
  try {
    const today = dayjs().startOf("day").toDate();

    const users = await prisma.user.findMany({
      where: {
        streak: { gt: 0 }, 
      },
      include: {
        submissions: {
          orderBy: { submittedAt: "desc" },
          take: 1,
        },
      },
    });

    const usersWithBreakingStreak = users.filter((user) => {
      const lastSubmission = user.submissions[0]?.submittedAt;
      return !lastSubmission || dayjs(lastSubmission).isBefore(today) || user.submissions[0]?.status!=="Accepted" ;
    });
    for (const user of usersWithBreakingStreak) {
      await sendMail({
        recipient: user.email,
        subject: "Reminder: Maintain Your Streak!",
        text: `Hello ${user.name},\n\nWe noticed you haven’t submitted a problem today. Keep your streak alive by solving one before the day ends!\n\nBest regards,\nThe DevJourney Team`,
        html: `<h3>Hello ${user.name},</h3>
               <p>We noticed that you haven’t submitted a problem today. To maintain your streak, be sure to complete one before the day ends.</p>
               <p>Keep up the great work!</p>
               <p>Best regards,<br>The DevJourney Team</p>`,
      });
      
    }

    return NextResponse.json({ message: "Reminder emails sent successfully" });
  } catch (error) {
    console.error("Error sending streak reminder emails:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
