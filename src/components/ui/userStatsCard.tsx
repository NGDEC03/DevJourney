import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { UserStats } from "@/types/type";
import { CheckCircle, BarChart, Trophy, BookOpen } from 'lucide-react'
interface UserStat{
  userStats:UserStats,
  problems:any
}

export default function UserStatsCards({ userStats,problems }:UserStat) {
    console.log(userStats);
    
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Problems Solved</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" aria-label="Total Problems Solved" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userStats.totalSolved}</div>
          <p className="text-xs text-muted-foreground">+{userStats.solvedLastWeek} from last week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" aria-label="Current Streak" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userStats.streak} days</div>
          <p className="text-xs text-muted-foreground">Keep it up!</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ranking</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" aria-label="Ranking" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userStats.ranking || "N/A"}</div>
          <p className="text-xs text-muted-foreground">
            {userStats.ranking ? `Top ${userStats.rankingPercentile}%` : ""}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Learning Progress</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" aria-label="Learning Progress" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round((userStats.totalSolved/problems.length) * 100)}%</div>
          <Progress value={Math.round((userStats.totalSolved/problems.length) * 100)} className="mt-2" />
        </CardContent>
      </Card>
    </div>
  )
}

