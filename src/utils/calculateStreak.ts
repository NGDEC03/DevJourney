import  prisma from "@/prismaClient";
import { isSameDay, subDays } from "date-fns";

export const calculateStreak = async (userName: string, submissionDate: Date) => {
    const user = await prisma.user.findUnique({
        where: { userName },
        include: {
            submissions: {
                where: { status: "Accepted" },
                orderBy: { submittedAt: "desc" },
            },
        },
    });

    if (!user || user.submissions.length === 0) {
        return { streak: 1, lastStreakDate: submissionDate };
    }

    const lastSubmissionDate = new Date(user.submissions[0].submittedAt);
    const isToday = isSameDay(lastSubmissionDate, submissionDate);
    const isYesterday = isSameDay(lastSubmissionDate, subDays(submissionDate, 1));

    let newStreak = user.streak;

    if (isToday) {
        return { streak: newStreak, lastStreakDate: lastSubmissionDate }; // No change
    }

    if (isYesterday) {
        newStreak += 1;
    } else {
        newStreak = 1;
    }

    return { streak: newStreak, lastStreakDate: submissionDate };
};

