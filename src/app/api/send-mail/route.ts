import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendMail } from "@/utils/sendMail";
import dayjs from "dayjs";

const prisma = new PrismaClient();

export const runtime = "edge";

export async function POST(request: Request) {
  // Ensure this route can only be called by Vercel Cron Job
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = dayjs().startOf("day").toDate();

    // Fetch users who have a non-zero streak
    const users = await prisma.user.findMany({
      where: {
        streak: { gt: 0 }, // Only users with an active streak
      },
      include: {
        submissions: {
          orderBy: { submittedAt: "desc" },
          take: 1, // Get the latest submission
        },
      },
    });

    // Filter users whose last submission was before today
    const usersWithBreakingStreak = users.filter((user) => {
      const lastSubmission = user.submissions[0]?.submittedAt;
      return !lastSubmission || dayjs(lastSubmission).isBefore(today);
    });

    // Send email reminders
    for (const user of usersWithBreakingStreak) {
      await sendMail({
        recipient: user.email,
        subject: "Your Streak is About to Break!",
        text: `Hello ${user.name}, don't forget to submit a problem today to maintain your streak!`,
        html: `<h1>Hello ${user.name}</h1><p>Your streak is about to break! Solve a problem today to keep it going.</p>`,
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
