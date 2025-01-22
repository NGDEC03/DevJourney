import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Problem } from "@/types/type"

interface RecentProblemsProps {
  problems: Problem[];
}

export default function RecentProblems({ problems }: RecentProblemsProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Recent Problems</CardTitle>
        <CardDescription>Your recently attempted problems</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {problems.map((problem) => (
            <li key={problem.problemId} className="flex items-center justify-between">
              <div className="flex items-center">
                <Code className="h-4 w-4 mr-2" aria-label="Problem" />
                <span>{problem.problemName}</span>
              </div>
              <div className="flex items-center">
                <span className={`text-xs mr-2 ${
                  problem.difficulty === 'Easy' ? 'text-green-500' :
                  problem.difficulty === 'Medium' ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {problem.difficulty}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <Button className="w-full mt-4" variant="outline">
          <Link href="/problems">View All Problems</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
