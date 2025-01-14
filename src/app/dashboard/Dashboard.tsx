'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import axiosRetry from 'axios-retry'
import dynamic from 'next/dynamic'
import { SkeletonLoader } from '@/components/ui/skeletonLoader'
import Ghost from '@/lib/1479.gif'
import UserStatsCards from '@/components/ui/userStatsCard'
import RecentProblems from '@/components/ui/recentProblems'
import SubmissionsHistory from '@/components/ui/submissionHistory'
import Image from 'next/image'

axiosRetry(axios, { retries: 3 })

const LazyPieChart = dynamic(() => import('@/components/ui/pieChart'), { ssr: false })

export default function DashboardPage() {
  const { data: session } = useSession()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)

  const colorMap = useMemo(() => ({
    Easy: '#4ade80',
    Medium: '#facc15',
    Hard: '#f87171'
  }), [])

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (session?.user?.userName) {
        setLoading(true)
        setError(null)

        try {
          const response = await axios.get(`/api/user-stats?userName=${session.user.userName}`)

          setDashboardData(response.data)
        } catch (err) {
          console.error('Error fetching dashboard data:', err)
          setError('Failed to load dashboard data. Please try again later.')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchDashboardData()
  }, [session])

  if (loading) {
    return <SkeletonLoader />
  }

  if (error) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center">
        <Image src={Ghost} alt='error'/>
        <p className="text-2xl font-bold text-zinc-700 mb-4">Error</p>
        <p className="text-lg text-gray-800">{error}</p>
      </div>
    )
  }

  const { userStats, recentProblems, problemDistribution, recentSubmissions } = dashboardData || {}

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome back, {session?.user?.Name || "Coder"}!</h1>

      <UserStatsCards userStats={userStats} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <RecentProblems problems={recentProblems} />
        <LazyPieChart data={problemDistribution} colorMap={colorMap} />
      </div>

      <div className="overflow-x-auto">
        <SubmissionsHistory submissions={recentSubmissions} />
      </div>
    </div>
  )
}
