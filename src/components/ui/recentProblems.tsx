"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code } from "lucide-react";
import { Problem } from "@/types/type";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
          {problems.slice(0,11).map((problem) => (
            <li key={problem.problemId} className="flex items-center justify-between">
              <div className="flex items-center">
                <Code className="h-4 w-4 mr-2" aria-label="Problem" />
                <span>{problem.problemName}</span>
              </div>
              <span className={`text-xs ${
                problem.difficulty === "Easy"
                  ? "text-green-500"
                  : problem.difficulty === "Medium"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}>
                {problem.difficulty}
              </span>
            </li>
          ))}
        </ul>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full mt-4" variant="outline">
              View All Problems
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[500px] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>All Attempted Problems</DialogTitle>
            </DialogHeader>
            <ul className="space-y-2">
              {problems.map((problem) => (
                <li key={problem.problemId} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Code className="h-4 w-4 mr-2" aria-label="Problem" />
                    <span>{problem.problemName}</span>
                  </div>
                  <span className={`text-xs ${
                    problem.difficulty === "Easy"
                      ? "text-green-500"
                      : problem.difficulty === "Medium"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}>
                    {problem.difficulty}
                  </span>
                </li>
              ))}
            </ul>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
