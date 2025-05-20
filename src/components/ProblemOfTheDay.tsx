"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { Problem } from "@prisma/client";
import { motion } from "framer-motion";
import { BookOpen, Target, TrendingUp } from "lucide-react";

interface UserStats {
  totalSolved: number;
  difficultyDistribution: {
    Easy: number;
    Medium: number;
    Hard: number;
  };
  weakTopics: string[];
}

interface POTDResponse {
  problem: Problem;
  learningPath: string;
  topicFocus: string;
  userStats: UserStats;
}

export function ProblemOfTheDay() {
  const [data, setData] = useState<POTDResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPOTD = async () => {
      try {
        const response = await fetch("/api/potd");
        if (!response.ok) {
          throw new Error("Failed to fetch Problem of the Day");
        }
        const responseData = await response.json();
        setData(responseData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPOTD();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse bg-white rounded-lg shadow-md p-6">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <p className="text-gray-600">No problem available for today</p>
      </div>
    );
  }

  const { problem, learningPath, topicFocus, userStats } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Problem of the Day
        </h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            problem.difficulty === "Easy"
              ? "bg-green-100 text-green-800"
              : problem.difficulty === "Medium"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {problem.difficulty}
        </span>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        
        <p className="text-blue-700">{learningPath}</p>
        <div className="mt-2 flex items-center gap-2">
          <Target className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-600">Focus Topic: {topicFocus}</span>
        </div>
      </div>

      {/* Problem Details */}
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {problem.problemName}
      </h3>
      <p className="text-gray-600 mb-4 line-clamp-2">
        {problem.problemDescription}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {problem.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* User Progress */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-800">Your Progress</h3>
        </div>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Total Solved</p>
            <p className="font-medium">{userStats.totalSolved}</p>
          </div>
          <div>
            <p className="text-gray-600">Easy</p>
            <p className="font-medium">{userStats.difficultyDistribution.Easy}</p>
          </div>
          <div>
            <p className="text-gray-600">Medium</p>
            <p className="font-medium">{userStats.difficultyDistribution.Medium}</p>
          </div>
          <div>
            <p className="text-gray-600">Hard</p>
            <p className="font-medium">{userStats.difficultyDistribution.Hard}</p>
          </div>
        </div>
        {userStats.weakTopics.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">Topics to Improve:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {userStats.weakTopics.map((topic) => (
                <span
                  key={topic}
                  className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <Link
        href={`/problems/${problem.problemId}`}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Solve Problem
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
    </motion.div>
  );
} 