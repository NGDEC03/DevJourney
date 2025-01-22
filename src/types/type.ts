export interface Problem {
    problemId: string; // unique identifier for the problem
    problemName: string; // name of the problem
    problemDescription?: string; // description of the problem
    difficulty: string; // difficulty of the problem
    attemptCount?: number; // number of attempts for this problem
    successCount?: number; // number of successful submissions
    memoryLimit?: number; // memory limit for solving the problem
    timeLimit?: number; // time limit for solving the problem
    tags?: string[]; // tags associated with the problem (e.g., DP, Arrays, etc.)
    createdAt?: string; // timestamp when the problem was created
    userName?: string; // optional username of the user who created the problem
    testCases?: Case[]; // list of test cases for the problem
    constraint?: string[]; // problem constraints
    submissions?: Submission[]; // list of submissions related to the problem
  }
  export interface DashboardData {
    userStats: {
      totalSolved: number;
      solvedLastWeek: number;
      streak: number;
      ranking: number | null;
      rankingPercentile: number;
      learningProgress: number;
    };
    recentProblems: Array<{ problemId: string; problemName: string; difficulty: string; completed: boolean }>;
    problemDistribution: Array<{ name: string; value: number; color: string }>;
    recentSubmissions: Array<{ id: string; problemId: string; status: string; submittedAt: string }>;
  }
  
  export interface UserStats {
    totalSolved: number; // Total number of solved problems
    solvedLastWeek: number; // Number of problems solved in the last week
    streak: number; // The user's streak (consecutive days of activity)
    ranking: number | null; // User's ranking, can be null if not available
    rankingPercentile: number; // The user's ranking percentile
    learningProgress: number; // The user's learning progress, likely a percentage (0-100)
  }
  export interface Case {
    caseId: string; // unique identifier for the test case
    input: string; // input for the test case
    output: string; // expected output for the test case
    explanation?: string; // optional explanation for the test case
  }
  
  export interface Submission {
    id: string; // unique identifier for the submission
    status: string; // submission status (e.g., 'Accepted', 'Rejected')
    language?: string; // programming language used for the submission
    runtime?: string; // runtime of the solution (optional)
    memory?: string; // memory usage of the solution (optional)
    submittedAt: string; // timestamp when the submission was made
    failedTestCaseId?: string; // ID of the failed test case (if any)
    failureReason?: string; // reason for failure (if any)
    userId?: string; // ID of the user who made the submission
    problemId: string; // ID of the problem related to the submission
    problem?:Problem
  }
  