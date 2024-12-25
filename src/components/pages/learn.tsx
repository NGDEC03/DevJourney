import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Code, Database, Network } from 'lucide-react'

export default function LearnPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Learning Paths</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="mr-2" />
              Algorithms
            </CardTitle>
            <CardDescription>Master fundamental algorithms</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={30} className="mb-2" />
            <p className="text-sm text-gray-500 mb-4">30% Complete</p>
            <Button className="w-full">Continue Learning</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2" />
              Data Structures
            </CardTitle>
            <CardDescription>Learn essential data structures</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={50} className="mb-2" />
            <p className="text-sm text-gray-500 mb-4">50% Complete</p>
            <Button className="w-full">Continue Learning</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Network className="mr-2" />
              System Design
            </CardTitle>
            <CardDescription>Understand large-scale system design</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={10} className="mb-2" />
            <p className="text-sm text-gray-500 mb-4">10% Complete</p>
            <Button className="w-full">Continue Learning</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


