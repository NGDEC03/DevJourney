import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy, Clock, Users } from 'lucide-react'

export default function CompetePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Competitions</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="mr-2" />
              Weekly Contest
            </CardTitle>
            <CardDescription>Every Sunday at 8:00 AM UTC</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Register</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2" />
              Biweekly Contest
            </CardTitle>
            <CardDescription>Every other Saturday at 2:30 PM UTC</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Register</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2" />
              Team Contest
            </CardTitle>
            <CardDescription>Monthly team-based competition</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Form Team</Button>
          </CardContent>
        </Card>
      </div>
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>codemaster123</TableCell>
            <TableCell>9850</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>2</TableCell>
            <TableCell>algorithmwhiz</TableCell>
            <TableCell>9720</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>3</TableCell>
            <TableCell>pythonista42</TableCell>
            <TableCell>9680</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

