import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code } from 'lucide-react'
import React from "react"

interface InputOutputFormatProps {
  inputFormat: string
  outputFormat: string
}

export function InputOutputFormat({ inputFormat, outputFormat }: InputOutputFormatProps) {
  return (
    
    <div className="space-y-4">
    <div>
      <h4 className="text-lg font-semibold mb-2 text-xl">Input Format:</h4>
      <ul className="list-disc list-inside">
        {inputFormat.split("\n").map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ul>
    </div>
    <div>
      <h4 className="text-lg font-semibold mb-2 text-xl">Output Format:</h4>
      <ul className="list-disc list-inside">
        {outputFormat.split("\n").map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ul>
    </div>
  </div>
  
   
  )
}
