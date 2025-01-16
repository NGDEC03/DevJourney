import React from 'react'
import ProblemPage from './problemId'

async function page({ params }: { params: Promise<string> }) {
    const id=await params


    return (
        <ProblemPage id={id}></ProblemPage>
    )
}

export default page