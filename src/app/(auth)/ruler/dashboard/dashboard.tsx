'use client'

import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from '@/components/ui/use-toast'
import { TagSelector } from '@/components/TagSelector'
import axios from 'axios'

interface ProblemFormData {
  problemName: string;
  problemD: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number;
  memoryLimit: number;
  tags: string[];
}

interface TestCaseFormData {
  problemId: number;
  input: string;
  output: string;
  explanation?: string;
}

// Mock data for users (replace with actual API call in production)
const mockUsers = [
  { userName: "user1", email: "user1@example.com", problemsSolved: 10, rank: 1 },
  { userName: "user2", email: "user2@example.com", problemsSolved: 8, rank: 2 },
  { userName: "user3", email: "user3@example.com", problemsSolved: 5, rank: 3 },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("add-problem")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>("Easy")
  const { toast } = useToast()

  const { register: registerProblem, handleSubmit: handleSubmitProblem, formState: { errors: problemErrors } } = useForm<ProblemFormData>()

  const { register: registerTestCase, handleSubmit: handleSubmitTestCase, formState: { errors: testCaseErrors } } = useForm<TestCaseFormData>()

  const onSubmitProblem: SubmitHandler<ProblemFormData> = async (data) => {
    try {
      data.difficulty = difficulty
      data.tags = selectedTags
      const response = await axios.post(`/api/add-problem`, {
        problemD: data.problemD,
        problemName: data.problemName,
        memoryLimit: data.memoryLimit,
        timeLimit: data.timeLimit,
        difficulty: data.difficulty,
        tags: data.tags,
      })
      toast({
        title: 'Success',
        description: 'Problem added successfully!',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: '⚠️ Unexpected Error',
        description: 'Failed to add problem. Please try again.',
        variant: 'destructive',
      });
    }
  }

  const onSubmitTestCase: SubmitHandler<TestCaseFormData> = async (data) => {
    try {
      // Replace with actual API call
      // console.log("Submitting test case:", data)
      const response = await axios.post(`/api/add-test/`, {
        input: data.input,
        output: data.output,
        explaination: data.explanation,
        problemId: data.problemId,
      })
      toast({
        title: 'Success',
        description: 'Test case added successfully!',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: '⚠️ Unexpected Error',
        description: 'Failed to add test case. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="add-problem">Add Problem</TabsTrigger>
          <TabsTrigger value="add-testcase">Add Test Case</TabsTrigger>
          <TabsTrigger value="manage-users">Manage Users</TabsTrigger>
        </TabsList>
        <TabsContent value="add-problem">
          <Card>
            <CardHeader>
              <CardTitle>Add New Problem</CardTitle>
              <CardDescription>Create a new coding problem for users to solve.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitProblem(onSubmitProblem)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="problemName">Problem Name</Label>
                  <Input id="problemName" {...registerProblem("problemName", { required: "Problem name is required" })} />
                  {problemErrors.problemName && <p className="text-red-500">{problemErrors.problemName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="problemD">Problem Description</Label>
                  <Textarea id="problemD" {...registerProblem("problemD", { required: "Problem description is required" })} />
                  {problemErrors.problemD && <p className="text-red-500">{problemErrors.problemD.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select onValueChange={(value: 'Easy' | 'Medium' | 'Hard') => setDifficulty(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  {problemErrors.difficulty && <p className="text-red-500">{problemErrors.difficulty.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeLimit">Time Limit (seconds)</Label>
                  <Input id="timeLimit" type="number" {...registerProblem("timeLimit", { required: "Time limit is required", min: { value: 1, message: "Time limit must be at least 1 second" } })} />
                  {problemErrors.timeLimit && <p className="text-red-500">{problemErrors.timeLimit.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memoryLimit">Memory Limit (MB)</Label>
                  <Input id="memoryLimit" type="number" {...registerProblem("memoryLimit", { required: "Memory limit is required", min: { value: 1, message: "Memory limit must be at least 1 MB" } })} />
                  {problemErrors.memoryLimit && <p className="text-red-500">{problemErrors.memoryLimit.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <TagSelector selectedTags={selectedTags} onTagsChange={setSelectedTags} />
                  {problemErrors.tags && <p className="text-red-500">{problemErrors.tags.message}</p>}
                </div>
                <Button type="submit">Add Problem</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="add-testcase">
          <Card>
            <CardHeader>
              <CardTitle>Add Test Case</CardTitle>
              <CardDescription>Add a new test case for an existing problem.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTestCase(onSubmitTestCase)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="problemId">Problem ID</Label>
                  <Input id="problemId" type="text" {...registerTestCase("problemId", { required: "Problem ID is required", min: { value: 1, message: "Problem ID must be at least 1" } })} />
                  {testCaseErrors.problemId && <p className="text-red-500">{testCaseErrors.problemId.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="input">Input</Label>
                  <Textarea id="input" {...registerTestCase("input", { required: "Input is required" })} />
                  {testCaseErrors.input && <p className="text-red-500">{testCaseErrors.input.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="output">Output</Label>
                  <Textarea id="output" {...registerTestCase("output", { required: "Output is required" })} />
                  {testCaseErrors.output && <p className="text-red-500">{testCaseErrors.output.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="explanation">Explanation (optional)</Label>
                  <Textarea id="explanation" {...registerTestCase("explanation")} />
                </div>
                <Button type="submit">Add Test Case</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="manage-users">
          <Card>
            <CardHeader>
              <CardTitle>Manage Users</CardTitle>
              <CardDescription>View and manage user accounts.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>A list of all users</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Problems Solved</TableHead>
                    <TableHead>Rank</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.userName}>
                      <TableCell>{user.userName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.problemsSolved}</TableCell>
                      <TableCell>{user.rank}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => console.log("Edit user:", user.userName)}>Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

