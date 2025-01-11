'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart, Code, Trophy, BookOpen, CheckCircle, Clock, PieChartIcon, XCircle } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useSession } from 'next-auth/react'
import axios from 'axios'

export default function DashboardPage() {
  const { data: session } = useSession()
  const [userStats, setUserStats] = useState(null)
  const [recentProblems, setRecentProblems] = useState([])
  const [problemDistribution, setProblemDistribution] = useState([])
  const [submissions, setSubmissions] = useState([])

  useEffect(() => {
    if (session?.user?.userName) {
      const fetchDashboardData = async () => {
        try {
          const statsResponse = await axios.get(`/api/user-stats?userName=${session.user.userName}`)
          const stats = statsResponse.data
          setUserStats(stats)

          const problemsResponse = await axios.get(`/api/recent-problems?userName=${session.user.userName}`)
          const problems = problemsResponse.data
          setRecentProblems(problems)

          const distributionResponse = await axios.get(`/api/problem-distribution?userName=${session.user.userName}`)
          const distribution = distributionResponse.data
          setProblemDistribution(distribution)

          const submissionsResponse = await axios.get(`/api/recent-submissions?userName=${session.user.userName}`)
          const recentSubmissions = submissionsResponse.data
          setSubmissions(recentSubmissions)
        } catch (error) {
          console.error('Error fetching dashboard data:', error)
        }
      }

      fetchDashboardData()
      console.log(userStats);
      
    }
  }, [session])

  if (!userStats) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome back, {session?.user?.Name || "Coder"}!</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Problems Solved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalSolved}</div>
            <p className="text-xs text-muted-foreground">+{userStats.solvedLastWeek} from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.streak} days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ranking</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.ranking}</div>
            <p className="text-xs text-muted-foreground">Top {userStats.rankingPercentile}% worldwide</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Progress</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(userStats.learningProgress * 100)}%</div>
            <Progress value={userStats.learningProgress * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Problems</CardTitle>
            <CardDescription>Your recently attempted problems</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recentProblems.map((problem) => (
                <li key={problem.problemId} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Code className="h-4 w-4 mr-2" />
                    <span>{problem.problemName}</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-xs mr-2 ${problem.difficulty === 'Easy' ? 'text-green-500' :
                        problem.difficulty === 'Medium' ? 'text-yellow-500' : 'text-red-500'
                      }`}>
                      {problem.difficulty}
                    </span>
                    {problem.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>
                </li>
              ))}
            </ul>
            <Button className="w-full mt-4" variant="outline">
              <Link href="/problems">View All Problems</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChartIcon className="h-4 w-4 mr-2" />
              Problem Distribution
            </CardTitle>
            <CardDescription>Breakdown of solved problems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={problemDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {problemDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1 text-center">
              {problemDistribution.map((entry) => (
                <div key={entry.name}>
                  <div className="text-sm font-medium">{entry.name}</div>
                  <div className="text-2xl font-bold" style={{ color: entry.color }}>{entry.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      

      <Card>
        <CardHeader>
          <CardTitle>Submissions History</CardTitle>
          <CardDescription>Your recent problem submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Problem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Runtime</TableHead>
                <TableHead>Memory</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.problem.problemName}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {submission.status === 'Accepted' ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      {submission.status}
                    </div>
                  </TableCell>
                  <TableCell>{submission.language}</TableCell>
                  <TableCell>{submission.runtime}</TableCell>
                  <TableCell>{submission.memory}</TableCell>
                  <TableCell>{new Date(submission.submittedAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button className="w-full mt-4" variant="outline">
            <Link href="/submissions">View All Submissions</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

