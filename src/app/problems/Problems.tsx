'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import axios, { all } from 'axios'
import { useEffect, useState } from "react"
import { SkeletonLoader } from "@/components/ui/skeletonLoader"

export default function ProblemsPage() {
  const [problems, setProblems] = useState<any>(null);
  const [allProblems, setAllProblems] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  async function fetchProblems() {
    try {
      const response = await axios.get("/api/get-problems");
      setProblems(response.data.problems);
      setAllProblems(response.data.problems);
    } catch (error) {
      console.error("Failed to fetch problems:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProblems();
  }, [])

  function filter_diff(diff: string) {
    if(diff === 'All') {
      setProblems(allProblems);
    }
    else {
      setProblems(allProblems.filter((problem: any) => { return problem.difficulty === diff }));
    }
  }

  function handleChange(e: any) {
    // console.log(e.target.value);
    setProblems(allProblems.filter((problem: any) => { return (problem.problemName.toLowerCase()).includes(e.target.value.toLowerCase()) }));
  }

  if(loading) {
    return (
      <SkeletonLoader/>
    )
  }
  // console.log(problems)
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Coding Problems</h1>
      <div className="flex justify-between items-center mb-6">
        <Input className="w-64" placeholder="Search problems..." onInput={handleChange}/>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => filter_diff('All')}>All</Button>
          <Button variant="outline" onClick={() => filter_diff('Easy')}>Easy</Button>
          <Button variant="outline" onClick={() => filter_diff('Medium')}>Medium</Button>
          <Button variant="outline" onClick={() => filter_diff('Hard')}>Hard</Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Problem</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Acceptance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problems.map((problem: any) => (
            <TableRow key={problem.problemId}>
              <TableCell>
                <Link href={`/problems/${problem.problemId}`} className="text-blue-600 hover:underline">
                  {problem.problemName}
                </Link>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={problem.difficulty === "Easy" ? "bg-green-100 text-green-800" : problem.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
                  {problem.difficulty}
                </Badge>
              </TableCell>
              <TableCell>{((problem.successCount/problem.attemptCount * 100)?(problem.successCount/problem.attemptCount * 100):0).toFixed(2)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

