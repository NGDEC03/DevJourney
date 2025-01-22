import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PieChartIcon } from 'lucide-react'

export default function ProblemDistributionChart({ data, colorMap }:{data:{name:string,value:number,color:string}[],colorMap:{Easy:string,Medium:string,Hard:string}}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <PieChartIcon className="h-4 w-4 mr-2" aria-label="Problem Distribution" />
          Problem Distribution
        </CardTitle>
        <CardDescription>Breakdown of solved problems</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry:{name:string,value:number,color:string}, index:number) => (
                  <Cell key={`cell-${index}`} fill={colorMap[entry.name as keyof typeof colorMap]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1 text-center">
          {data.map((entry:any) => (
            <div key={entry.name}>
              <div className="text-sm font-medium">{entry.name}</div>
              <div className="text-2xl font-bold" style={{ color: colorMap[entry.name as keyof typeof colorMap] }}>{entry.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

