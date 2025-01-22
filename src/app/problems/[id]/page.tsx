import React from 'react'
import ProblemPage from './problemId'

async function page({ params }: { params: Promise<string> }) {
    const id=await params
    const problem_id={
        id:id
    }

    return (
        <ProblemPage params={problem_id}></ProblemPage>
    )
}

export default page