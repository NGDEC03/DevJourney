'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart, Code, Trophy, BookOpen, CheckCircle, Clock, PieChartIcon, XCircle } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useSession } from 'next-auth/react'

export default function DashboardPage() {
  const {data:session}=useSession()
  const [recentProblems] = useState([
    { id: 1, name: 'Two Sum', difficulty: 'Easy', completed: true },
    { id: 2, name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', completed: false },
    { id: 3, name: 'Median of Two Sorted Arrays', difficulty: 'Hard', completed: false },
  ])

  const [upcomingContests] = useState([
    { id: 1, name: 'Weekly Contest 342', date: '2023-07-15 14:00 UTC' },
    { id: 2, name: 'Biweekly Contest 105', date: '2023-07-22 14:00 UTC' },
  ])

  const [problemDistribution] = useState([
    { name: 'Easy', value: 120, color: '#4ade80' },
    { name: 'Medium', value: 80, color: '#fbbf24' },
    { name: 'Hard', value: 47, color: '#f87171' },
  ])

  const [submissions] = useState([
    { id: 1, problem: 'Two Sum', status: 'Accepted', language: 'JavaScript', runtime: '76 ms', memory: '42.1 MB', submitted: '2023-07-10' },
    { id: 2, problem: 'Reverse Integer', status: 'Wrong Answer', language: 'Python', runtime: '32 ms', memory: '14.2 MB', submitted: '2023-07-09' },
    { id: 3, problem: 'Palindrome Number', status: 'Accepted', language: 'Java', runtime: '11 ms', memory: '41.6 MB', submitted: '2023-07-08' },
    { id: 4, problem: 'Roman to Integer', status: 'Time Limit Exceeded', language: 'C++', runtime: 'N/A', memory: 'N/A', submitted: '2023-07-07' },
    { id: 5, problem: 'Longest Common Prefix', status: 'Accepted', language: 'JavaScript', runtime: '68 ms', memory: '40.8 MB', submitted: '2023-07-06' },
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome back, {session?.user?.userName?session.user.userName:"Coder!"}</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Problems Solved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"></div>
            <p className="text-xs text-muted-foreground">+23 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15 days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ranking</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,267</div>
            <p className="text-xs text-muted-foreground">Top 10% worldwide</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Progress</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72%</div>
            <Progress value={72} className="mt-2" />
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
                <li key={problem.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Code className="h-4 w-4 mr-2" />
                    <span>{problem.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-xs mr-2 ${
                      problem.difficulty === 'Easy' ? 'text-green-500' :
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
          <CardTitle>Upcoming Contests</CardTitle>
          <CardDescription>Participate and improve your skills</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {upcomingContests.map((contest) => (
              <li key={contest.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Trophy className="h-4 w-4 mr-2" />
                  <span>{contest.name}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-xs">{contest.date}</span>
                </div>
              </li>
            ))}
          </ul>
          <Button className="w-full mt-4" variant="outline">
            <Link href="/compete">View All Contests</Link>
          </Button>
        </CardContent>
      </Card>

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
                  <TableCell className="font-medium">{submission.problem}</TableCell>
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
                  <TableCell>{submission.submitted}</TableCell>
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

