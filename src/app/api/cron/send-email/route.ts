import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { sendMail } from "@/utils/sendMail"

const prisma = new PrismaClient()

export const runtime = "edge"

export async function POST(request: Request) {
  // Ensure this route can only be called by Vercel Cron Job
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Fetch users from the database
    const users = await prisma.user.findMany()

    // Send email to each user
    for (const user of users) {
      await sendMail({
        recipient: user.email,
        subject: "Your Daily Update",
        text: `Hello ${user.name}, here's your daily update!`,
        html: `<h1>Hello ${user.name}</h1><p>Here's your daily update!</p>`,
      })
    }

    return NextResponse.json({ message: "Emails sent successfully" })
  } catch (error) {
    console.error("Error sending emails:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

