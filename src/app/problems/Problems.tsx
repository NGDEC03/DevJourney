import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function ProblemsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Coding Problems</h1>
      <div className="flex justify-between items-center mb-6">
        <Input className="w-64" placeholder="Search problems..." />
        <div className="space-x-2">
          <Button variant="outline">Easy</Button>
          <Button variant="outline">Medium</Button>
          <Button variant="outline">Hard</Button>
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
          <TableRow>
            <TableCell>
              <Link href="#" className="text-blue-600 hover:underline">
                Two Sum
              </Link>
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Easy
              </Badge>
            </TableCell>
            <TableCell>45%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Link href="#" className="text-blue-600 hover:underline">
                Longest Substring Without Repeating Characters
              </Link>
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Medium
              </Badge>
            </TableCell>
            <TableCell>32%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Link href="#" className="text-blue-600 hover:underline">
                Median of Two Sorted Arrays
              </Link>
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                Hard
              </Badge>
            </TableCell>
            <TableCell>28%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

