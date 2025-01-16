'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Editor from "@monaco-editor/react"
import axios from 'axios'
import { CheckCircle, Clock, BarChart2 } from 'lucide-react'
import { SkeletonLoader } from '@/components/ui/skeletonLoader'
// const problemData = {
//     id: 1,
//     title: "Two Sum",
//     difficulty: "Hard",
//     acceptanceRate: "46.8%",
//     description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
//     examples: [
//         {
//             input: "nums = [2,7,11,15], target = 9",
//             output: "[0,1]",
//             explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
//         },
//         {
//             input: "nums = [3,2,4], target = 6",
//             output: "[1,2]",
//             explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
//         }
//     ],
//     constraints: [
//         "2 <= nums.length <= 10^4",
//         "-10^9 <= nums[i] <= 10^9",
//         "-10^9 <= target <= 10^9",
//         "Only one valid answer exists."
//     ],
//     tags: ["Array", "Hash Table"],
//     starterCode: `function twoSum(nums, target) {
//     // Your code here
// };`
// }
async function fetchProblem(id: string) {
    const problemData = await axios.get(`/api/get-problem?problem_Id=${id}`);
    return problemData.data;
}

export default function ProblemPage({id}:{id:string}) {
    const [problemData, setProblemData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState(null);
    useEffect(() => {
        const fetchData = async() => {
            try {
                const data = await fetchProblem(id);
                data.examples = (data.testCases).slice(0, 3);
                // console.log(data);
                setProblemData(data);
            } catch(error) {
                console.error("Error fetching problem data");
            } finally {
                setLoading(false)
            }
        }
        fetchData();
    }, [id]);
    if(loading) {
        return <SkeletonLoader/>
    }
    

    const handleSubmit = async() => {
//    

    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className='text-2xl'>{problemData.problemName}</CardTitle>
                                    
                                </div>
                                <Badge className={problemData.difficulty === "Easy" ? "bg-green-600 text-green-100" : problemData.difficulty === "Medium" ? "bg-yellow-600 text-yellow-100" : "bg-red-600 text-red-100"}>
                                    {problemData.difficulty}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p>{problemData.problemDescription}</p>
                            <div className="flex items-center space-x-4 mt-4">
                                <div className="flex items-center">
                                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                                    <span className="text-sm">{(problemData.successCount/problemData.attemptCount)*100}%</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1 text-yellow-500" />
                                    <span className="text-sm">15 min</span>
                                </div>
                                <div className="flex items-center">
                                    <BarChart2 className="h-4 w-4 mr-1 text-blue-500" />
                                    <span className="text-sm">{problemData.attemptCount}</span>
                                </div>
                            </div>


                            <Separator className='my-4'></Separator>
                            {problemData.examples.map((example: any, index: number) => (
                                <div key={index} className="mb-4">
                                    <p className="font-semibold">Example {index + 1}:</p>
                                    <p><strong>Input:</strong> {example.input}</p>
                                    <p><strong>Output:</strong> {example.output}</p>
                                    <p><strong>Explanation:</strong> {example.explanation}</p>
                                    {index < problemData.examples.length - 1 && <Separator className="my-2" />}
                                </div>
                            ))}

                            <Separator className='my-4'></Separator>
                            <CardTitle className='mb-4'>Constraints</CardTitle>
                            <ol className="list-disc list-inside">
                                {problemData.constraint.map((constraint: string, index: number) => (
                                    <li key={index}>{constraint}</li>
                                ))}
                            </ol>
                        </CardContent>
                    </Card>

                    <div className="flex flex-wrap gap-2">
                        {problemData.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="outline">{tag}</Badge>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Code Editor</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Editor
                                height="60vh"
                                defaultLanguage="javascript"
                                value={""}
                                onChange={(value: any) => setCode(value || '')}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    lineNumbers: 'on',
                                    roundedSelection: false,
                                    scrollBeyondLastLine: false,
                                    readOnly: false
                                }}
                            />
                            <Button onClick={handleSubmit} className="w-full mt-4">Submit Solution</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

