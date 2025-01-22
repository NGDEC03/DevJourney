import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { Submission } from "@/types/type"
interface submission{
  submissions:Submission[]
}
export default function SubmissionsHistory({ submissions }:submission) {
  return (
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
                <TableCell className="font-medium">{submission.problem?.problemName}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {submission.status === 'Accepted' ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" aria-label="Accepted" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500 mr-2" aria-label="Rejected" />
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
  )
}

