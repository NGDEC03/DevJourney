"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Editor from "@monaco-editor/react"
import axios from "axios"
import { CheckCircle, Clock, BarChart2, Code2, Code, LoaderCircle, Check, X } from "lucide-react"
import { languageOptions } from "@/utils/languageOptions"
import { useSession } from "next-auth/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { InputOutputFormat } from "@/components/ui/InputOutputFormat"

interface Problem {
  problemId: string
  problemName: string
  problemDescription: string
  difficulty: "Easy" | "Medium" | "Hard"
  attemptCount: number
  successCount: number
  memoryLimit: number
  timeLimit: number
  tags: string[]
  createdAt: string
  userName?: string
  constraint: string[]
  testCases: TestCase[]
  examples?: TestCase[]
}

interface User {
  id: string
  userName: string
  Name: string
  Email: string
  avatar: string
  isAdmin: boolean
}

interface TestCase {
  caseId: string
  input: string
  output: string
  explanation: string
  timeLimit: number
  memoryLimit: number
  problemId: string
}

interface problemID {
  id: string
}

async function fetchProblem(id: string) {
  const problemData = await axios.get(`/api/get-problem?problem_Id=${id}`)
  return problemData.data
}

export default function ProblemPage({ params }: { params: { id: problemID } }) {
  const id = params.id

  const { data: session } = useSession()
  const [selectedTestResult, setSelectedTestResult] = useState<any>(null)
  const [isTestResultDialogOpen, setIsTestResultDialogOpen] = useState(false)

  const user = session?.user as User
  const [problemData, setProblemData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("java")
  const [tested, setTested] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [testing, setTesting] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [passed, setPassed] = useState(0)
  const [failed, setFailed] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleClick = (result: any, testCase) => {
    
    
    if (result.status.includes("Error") || result.compile_output) {
      setErrorMessage(result.stderr || result.compile_output||  result.error || "Unknown error occurred")
      setIsErrorDialogOpen(true)
    } else {

      
      setSelectedTestResult({ ...result, testCase })
      setIsTestResultDialogOpen(true)
    }
  }
  const [currentTestIndex, setCurrentTestIndex] = useState(0)
  const [processingResults, setProcessingResults] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {

        const data = (await fetchProblem(id.id)) as Problem
        const examples = []
        data.testCases.forEach((test) => {
          if (test.explanation) {
            examples.push(test)
          }
        })
        data.examples = examples.slice(0, 3)
        setProblemData(data)
      } catch (error) {
        console.error("Error fetching problem data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="w-2/3 h-8 bg-gray-300 rounded animate-pulse"></div>
                  <div className="w-16 h-6 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse"></div>
                </div>
                <div className="flex items-center space-x-6 mt-4">
                  <div className="w-24 h-5 bg-gray-300 rounded animate-pulse"></div>
                  <div className="w-24 h-5 bg-gray-300 rounded animate-pulse"></div>
                  <div className="w-24 h-5 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="h-[400px] bg-gray-200 animate-pulse"></Card>
            <div className="flex space-x-4">
              <div className="w-24 h-10 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-24 h-10 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async () => {
    if (code === "") {
      alert("At least write something in the editor !!!!")
      return
    }

    setSubmitting(true)
    setPassed(0)
    setFailed(0)
    setSubmitted(false)
    setProcessingResults([])
    setCurrentTestIndex(0)

    try {
      const response = await axios.post(`/api/submit`, {
        problemId: id.id,
        language: language,
        code: code,
        userName: user.userName,
        test: -1,
      })

      const results = response.data.results
      const warning = response.data.warning
      
      if (warning) {
        alert(warning) 
      }

      let tempPassed = 0
      let tempFailed = 0
      const processedResults = []

      const processResults = async () => {
        for (let i = 0; i < results.length; i++) {
          setCurrentTestIndex(i + 1)
          const result = results[i]

          if (result.status === "Accepted") {
            tempPassed++
            setPassed(tempPassed)
          } else {
            tempFailed++
            setFailed(tempFailed)
          }

          processedResults.push(result)
          setProcessingResults([...processedResults])

          await new Promise((resolve) => setTimeout(resolve, 500))
        }

        setSubmitting(false)
        setSubmitted(true)
      }

      processResults()
    } catch (error) {
      setSubmitting(false)
      console.error(error)
    }
  }

  const handleTest = async () => {
    if (code === "") {
      alert("At least write something in the editor !!!!")
      return
    }
    setTesting(true)
    setTested(true)
    try {
      const response = await axios.post(`/api/submit`, {
        problemId: id.id,
        language: language,
        code: code,
        userName: user.userName,
        test: 3,
      })

      const res = response.data.results
      let temp = []
      let index = 0
      const intervalId = setInterval(() => {
        temp = [...temp, res[index]]
        setResults(temp)
        index++
        if (index === res.length) {
          clear()
        }
      }, 500)

      function clear() {
        clearInterval(intervalId)
        setTesting(false)
      }
    } catch (error) {
      setTesting(false)
      console.error(error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl font-bold">{problemData.problemName}</CardTitle>
                </div>
                <Badge
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    problemData.difficulty === "Easy"
                      ? "bg-green-100 text-green-800"
                      : problemData.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {problemData.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="list-disc list-inside">
                {problemData.problemDescription.split("\n").map((line, index) => (
                  <p className="mb-2" key={index}>
                    {line}
                  </p>
                ))}
              </div>
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  <span className="text-sm font-medium">
                    {((problemData.successCount / problemData.attemptCount) * 100).toFixed(1) !== "NaN"
                      ? ((problemData.successCount / problemData.attemptCount) * 100).toFixed(1)
                      : "0"}
                    % Success
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                  <span className="text-sm font-medium">15 min</span>
                </div>
                <div className="flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2 text-blue-500" />
                  <span className="text-sm font-medium">{problemData.attemptCount} Attempts</span>
                </div>
              </div>
              <Separator className="my-6" />
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Examples</h3>
                {problemData.examples.map((example: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold mb-2">Example {index + 1}:</p>
                    <p className="whitespace-pre-wrap">
                      <strong>Input:</strong> <br /> {example.input}
                    </p>
                    <p className="whitespace-pre-wrap">
                      <strong>Output:</strong> <br />
                      {example.output.split("\n").map((line, index) => (
                        <React.Fragment key={index}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </p>
                    <p className="whitespace-pre-wrap">
                      <strong>Explanation:</strong> {example.explanation}
                    </p>
                  </div>
                ))}
              </div>
              <Separator className="my-6" />
              <InputOutputFormat inputFormat={problemData?.inputFormat} outputFormat={problemData?.outputFormat} />
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2">
            {problemData.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold">Code Editor</CardTitle>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Editor
                height="60vh"
                language={language}
                value={code}
                onChange={(value) => setCode(value || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  readOnly: false,
                  automaticLayout: true,
                }}
              />
              <p className="pt-3 text-center text-sm">{!session && "You must be logged in to submit"}</p>
              <div className="flex justify-end">
                <Button
                  onClick={handleTest}
                  className="w-7/12 mt-3 mr-3 bg-blue-600 hover:bg-blue-700"
                  title={!session ? "You must be logged in to submit" : "logged in"}
                  disabled={!session || code === ""}
                >
                  {testing ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <>
                      {" "}
                      <Code className="mr-2 h-4 w-4" /> Run Sample Tests{" "}
                    </>
                  )}
                </Button>

                <Dialog>
                  <DialogTrigger className="w-5/12" asChild>
                    <Button
                      onClick={handleSubmit}
                      className="mt-3 bg-green-600 hover:bg-green-700"
                      title={!session ? "You must be logged in to submit" : "logged in"}
                      disabled={!session || code === ""}
                    >
                      {submitting ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        <>
                          {" "}
                          <Code2 className="mr-2 h-4 w-4" /> Submit Solution{" "}
                        </>
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">Submission Results</DialogTitle>
                    </DialogHeader>
                    {submitted ? (
                      <div className="space-y-4 p-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Test Cases Passed:</span>
                          <Badge className="bg-green-600">{passed}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Test Cases Failed:</span>
                          <Badge className="bg-red-500">{failed}</Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-2 mt-4">
                          {processingResults.map((result, idx) => (
                            <Badge
                              key={idx}
                              className={`${result.status === "Accepted" ? "bg-green-600" : "bg-red-500"} flex items-center justify-center h-8`}
                            >
                              {idx + 1}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 p-2">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="relative">
                            <LoaderCircle className="animate-spin h-16 w-16 text-green-600" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-sm font-bold">{currentTestIndex}</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-lg">Processing Test Case {currentTestIndex}</p>
                            <p className="text-sm text-gray-500">Hang tight, we're checking your solution...</p>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-green-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                              style={{
                                width: `${problemData?.testCases?.length ? (currentTestIndex / problemData.testCases.length) * 100 : 0}%`,
                              }}
                            ></div>
                          </div>

                          <div className="grid grid-cols-4 gap-2 w-full mt-2">
                            {processingResults.map((result, idx) => (
                              <Badge
                                key={idx}
                                className={`${result.status === "Accepted" ? "bg-green-600" : "bg-red-500"} flex items-center justify-center h-8 animate-pulse`}
                              >
                                {idx + 1}
                              </Badge>
                            ))}
                            {currentTestIndex > 0 && currentTestIndex <= processingResults.length + 1 && (
                              <Badge className="bg-yellow-500 flex items-center justify-center h-8 animate-bounce">
                                {currentTestIndex}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {tested && results && (
            <Card className="overflow-hidden border border-gray-200 rounded-lg shadow-lg">
              <div className="p-4">
                <h3 className="text-2xl font-bold text-black"> Test Results</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">No.</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Status</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Time</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Memory</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, idx) => (
                      <tr
                        key={idx}
                        className="border-t border-gray-200"
                        onClick={() => handleClick(result, problemData.testCases[idx])}
                      >
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{idx + 1}</td>
                        <td className="px-4 py-2">
                          {result.status === "Accepted" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Check className="w-4 h-4 mr-1" />
                              Accepted
                            </span>
                          ) : result.status === "Error" || result.compile_output ? (
                            <span 
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 cursor-pointer hover:bg-red-200"
                              onClick={() => handleClick(result, problemData.testCases[idx])}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Error
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <X className="w-4 h-4 mr-1" />
                              Failed
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500">{result.timeTaken} ms</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{result.memoryUsage} KB</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
          <Dialog open={isTestResultDialogOpen} onOpenChange={setIsTestResultDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Test Case Details</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                {
                selectedTestResult ? (
                  <div className="space-y-4 mt-4">
                    <div>
                      <h3 className="font-semibold text-lg">Input</h3>
                      <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
                        {selectedTestResult.testCase.input ?? ""}
                      </pre>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Expected Output</h3>
                      <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
                        {selectedTestResult.testCase?.output ?? ""}
                      </pre>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Your Output</h3>
                      <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
                        {selectedTestResult.stdout || "No output"}
                      </pre>
                    </div>
                    {/* {selectedTestResult.stderr && (
                      <div>
                        <h3 className="font-semibold text-lg text-red-600">Error Message</h3>
                        <pre className="bg-red-50 p-3 rounded-md overflow-x-auto text-red-600">
                          {selectedTestResult.stderr}
                        </pre>
                      </div>
                    )} */}
                    <div>
                      <h3 className="font-semibold">Status</h3>
                      <Badge
                        className={`${
                          selectedTestResult.status === "Accepted" 
                            ? "bg-green-800" 
                            : selectedTestResult.status.includes("Error")
                            ? "bg-red-600"
                            : "bg-red-400"
                        }`}
                      >
                        {selectedTestResult.status}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold">Performance</h3>
                      <p>Time: {selectedTestResult.timeTaken ?? "N/A"} ms</p>
                      <p>Memory: {selectedTestResult.memoryUsage ?? "N/A"} KB</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500">No test case selected.</div>
                )}
              </DialogDescription>
            </DialogContent>
          </Dialog>
          <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-red-600">Error Details</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <div className="space-y-4 mt-4">
                  <div>
                    <h3 className="font-semibold text-lg">Error Message</h3>
                    <pre className="bg-red-50 p-3 rounded-md overflow-x-auto text-red-600">
                      {errorMessage}
                    </pre>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Input</h3>
                    <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
                      {selectedTestResult?.testCase?.input ?? ""}
                    </pre>
                  </div>
                </div>
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
