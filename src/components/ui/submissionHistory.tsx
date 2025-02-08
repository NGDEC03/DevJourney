"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { Submission } from "@/types/type";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface SubmissionProps {
  submissions: Submission[];
}

export default function SubmissionsHistory({ submissions }: SubmissionProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Submissions</CardTitle>
        <CardDescription>Your last 10 problem submissions</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Recent Submissions Table */}
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
            {submissions.slice(0,11).map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="font-medium">{submission.problem?.problemName}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {submission.status === "Accepted" ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" aria-label="Accepted" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500 mr-2" aria-label="Rejected" />
                    )}
                    {submission.status}
                  </div>
                </TableCell>
                <TableCell>{submission.language}</TableCell>
                <TableCell>{submission.timeTaken}</TableCell>
                <TableCell>{submission.memoryUsage}</TableCell>
                <TableCell>{new Date(submission.submittedAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* View All Submissions - Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full mt-4" variant="outline">
              View All Submissions
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[500px] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>All Submissions</DialogTitle>
            </DialogHeader>
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
                        {submission.status === "Accepted" ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" aria-label="Accepted" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500 mr-2" aria-label="Rejected" />
                        )}
                        {submission.status}
                      </div>
                    </TableCell>
                    <TableCell>{submission.language}</TableCell>
                    <TableCell>{submission.timeTaken}</TableCell>
                    <TableCell>{submission.memoryUsage}</TableCell>
                    <TableCell>{new Date(submission.submittedAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
