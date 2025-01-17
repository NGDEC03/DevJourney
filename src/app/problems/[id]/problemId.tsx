'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Editor from "@monaco-editor/react"
import axios from 'axios'
import { CheckCircle, Clock, BarChart2, Code2 } from 'lucide-react'
import { SkeletonLoader } from '@/components/ui/skeletonLoader'
import { languageOptions } from '@/utils/languageOptions'
import { useSession } from 'next-auth/react'

interface problem_id {
    id: string;
}
interface problem {
    problemId: string;
    problemName: string;
    problemDescription: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    attemptCount: number;
    successCount: number;
    memoryLimit: number;
    timeLimit: number;
    tags: string[];
    createdAt: string;
    userName?: string;
    constraint: string[];
    testCases: testCase[];
    examples?: testCase[];
}
interface testCase {
    caseId: string;
    input: string;
    output: string;
    explanation: string;
    timeLimit: number;
    memoryLimit: number;
    problemId: string;
}

async function fetchProblem(id: string) {
    // console.log(id);
    
    const problemData = await axios.get(`/api/get-problem?problem_Id=${id}`)
    return problemData.data
}

export default function ProblemPage({id}: {id: problem_id}) {
    // console.log(id);
    const { data: session } = useSession();
    const [problemData, setProblemData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [code, setCode] = useState('')
    const [language, setLanguage] = useState('javascript')

    useEffect(() => {
        const fetchData = async() => {
            try {
                const data = await fetchProblem(id.id) as problem;
                data.examples = (data.testCases).slice(0, 3)
                setProblemData(data)
                // setCode(getDefaultCode(language))
            } catch(error) {
                console.error("Error fetching problem data", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id.id])

    useEffect(() => {
        // console.log(language);
    }, [language])

    if(loading) {
        return <SkeletonLoader />
    }

    const handleSubmit = async() => {
        // console.log({ 
        //     problemId: id.id, 
        //     language, 
        //     code, 
        //     userName: session?.user?.userName 
        // });
        try {
            const response = await axios.post(`/api/submit`, {
                problemId: id.id,
                language: language,
                code: code,
                userName: session?.user?.userName,
            })
            console.log(response);
        } catch (error) {
            console.error(error);
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
                                    {/* <CardDescription className="mt-2">Problem #{id.id}</CardDescription> */}
                                </div>
                                <Badge className={`text-sm font-semibold px-3 py-1 rounded-full ${
                                    problemData.difficulty === "Easy" ? "bg-green-100 text-green-800" :
                                    problemData.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800" :
                                    "bg-red-100 text-red-800"
                                }`}>
                                    {problemData.difficulty}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 mb-4">{problemData.problemDescription}</p>
                            <div className="flex items-center space-x-6 mb-6">
                                <div className="flex items-center">
                                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                                    <span className="text-sm font-medium">{((problemData.successCount/problemData.attemptCount)*100).toFixed(1)}% Success</span>
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
                                        <p><strong>Input:</strong> {example.input}</p>
                                        <p><strong>Output:</strong> {example.output}</p>
                                        <p><strong>Explanation:</strong> {example.explanation}</p>
                                    </div>
                                ))}
                            </div>

                            <Separator className="my-6" />
                            
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Constraints</h3>
                                <ul className="list-disc list-inside space-y-2">
                                    {problemData.constraint.map((constraint: string, index: number) => (
                                        <li key={index} className="text-gray-700">{constraint}</li>
                                    ))}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-wrap gap-2">
                        {problemData.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-sm">{tag}</Badge>
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
                                onChange={(value) => setCode(value || '')}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    lineNumbers: 'on',
                                    roundedSelection: false,
                                    scrollBeyondLastLine: false,
                                    readOnly: false,
                                    automaticLayout: true,
                                }}
                            />
                            <p className="pt-3 text-center text-sm">{!session && "You must be logged in to submit"}</p>
                            <Button onClick={handleSubmit} className="w-full mt-3 bg-green-600 hover:bg-green-700" title={!session ? "You must be logged in to submit" : "logged in"} disabled={!session}>
                                <Code2 className="mr-2 h-4 w-4" /> Submit Solution
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}