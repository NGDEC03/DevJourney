import React from 'react'
import ProblemPage from './problemId'

async function page({ params }: { params: Promise<string> }) {
    const id=await params


    return (
        <ProblemPage id1={id}></ProblemPage>
    )
}

export default page