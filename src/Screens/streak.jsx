// StreaksPage.jsx (or add this to your existing App.jsx)
import React from 'react';
import { Flame, Calendar,BookOpen,Trophy, Target, Award,PlayCircle, Star, ChevronRight, Zap, History,CheckCircle } from 'lucide-react';
import { useAppState } from '../App.jsx'; // Import the hook from our state context

function StreaksPage() {
  const { userProgress } = useAppState();

  // *** 1. CALCULATE STREAK DATA ***
  // In a real app, this would be calculated from a history of completion dates.
  // For this mock, we'll use the number of completed lessons across all courses.
  const calculateStreakData = () => {
    let totalCompletedLessons = 0;
    let lastCompletedCourse = null;
    let mostLessonsCourse = { count: 0, course: null };

    // Loop through progress to calculate metrics
    Object.entries(userProgress).forEach(([courseId, progress]) => {
      const course = mockCourses.find(c => c.id === courseId);
      const completedCount = progress.completedLessons.length;
      
      totalCompletedLessons += completedCount;

      // Find the course with the most completed lessons
      if (completedCount > mostLessonsCourse.count && course) {
        mostLessonsCourse = { count: completedCount, course };
      }
      // Simple logic for "last completed": just use the last one we find with progress.
      // A real implementation would use timestamps.
      if (completedCount > 0) {
        lastCompletedCourse = course;
      }
    });

    // Calculate current streak (this is mocked)
    // A real implementation would check for consecutive days with completed lessons.
    const currentStreak = 7; // Let's assume a 7-day streak
    const longestStreak = 12; // Let's assume a 12-day record

    return {
      currentStreak,
      longestStreak,
      totalCompletedLessons,
      lastCompletedCourse,
      mostLessonsCourse
    };
  };

  const { currentStreak, longestStreak, totalCompletedLessons, lastCompletedCourse, mostLessonsCourse } = calculateStreakData();

  // *** 2. MOCK DATA FOR RECENT ACTIVITY & ACHIEVEMENTS ***
  const recentActivity = [
    { id: 1, course: "React 101", lesson: "State & Events", action: "Completed", date: "2 hours ago", icon: <CheckCircle className="w-4 h-4 text-green-500" /> },
    { id: 2, course: "JavaScript Pro", lesson: "Async/Await", action: "Quiz Passed", date: "1 day ago", icon: <Award className="w-4 h-4 text-blue-500" /> },
    { id: 3, course: "React 101", lesson: "Components & Props", action: "Started", date: "1 day ago", icon: <PlayCircle className="w-4 h-4 text-amber-500" /> },
  ];

  const unlockedAchievements = [
    { id: 1, name: "First Steps", description: "Complete your first lesson", icon: <Star className="w-6 h-6 text-amber-400" />, unlocked: true },
    { id: 2, name: "Week of Fire", description: "Maintain a 7-day streak", icon: <Flame className="w-6 h-6 text-orange-500" />, unlocked: currentStreak >= 7 },
    { id: 3, name: "Bookworm", description: "Complete 10 lessons", icon: <BookOpen className="w-6 h-6 text-blue-500" />, unlocked: totalCompletedLessons >= 10 },
    { id: 4, name: "Marathon Runner", description: "Achieve a 30-day streak", icon: <Zap className="w-6 h-6 text-purple-500" />, unlocked: false }, // Locked
  ];

  return (
    <div className="p-6">
      {/* *** 3. HEADER & MAIN STREAK CARD *** */}
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-8 h-8 text-amber-500" />
        <h1 className="text-2xl font-bold">Your Learning Streaks</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* Current Streak Card - The Most Important */}
        <div className="rounded-2xl border p-6 text-center dark:border-zinc-800 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/30 dark:to-zinc-900">
          <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-full dark:bg-amber-900/40 mb-4">
            <Flame className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Current Streak</h2>
          <p className="text-4xl font-bold mb-2 text-amber-600 dark:text-amber-400">{currentStreak}</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">days in a row</p>
          <div className="mt-4 text-xs text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 py-1 px-2 rounded-md">
            🔥 Keep it going! You're on fire.
          </div>
        </div>

        {/* Longest Streak Card */}
        <div className="rounded-2xl border p-6 text-center dark:border-zinc-800">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full dark:bg-blue-900/40 mb-4">
            <History className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Longest Streak</h2>
          <p className="text-4xl font-bold mb-2 text-blue-600 dark:text-blue-400">{longestStreak}</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">your personal best</p>
        </div>

        {/* Total Lessons Card */}
        <div className="rounded-2xl border p-6 text-center dark:border-zinc-800">
          <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full dark:bg-green-900/40 mb-4">
            <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Lessons Mastered</h2>
          <p className="text-4xl font-bold mb-2 text-green-600 dark:text-green-400">{totalCompletedLessons}</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">total completed</p>
          {mostLessonsCourse.course && (
            <p className="text-xs text-zinc-500 mt-2">
              Top course: <span className="font-medium">{mostLessonsCourse.course.title}</span>
            </p>
          )}
        </div>
      </div>

      {/* *** 4. RECENT ACTIVITY FEED *** */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2"><History className="w-5 h-5" /> Recent Activity</h2>
          <button className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">View all</button>
        </div>
        <div className="rounded-2xl border dark:border-zinc-800 overflow-hidden">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-4 border-b last:border-b-0 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
              <div className="flex-shrink-0">
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.course}: {activity.lesson}</p>
                <p className="text-xs text-zinc-500">{activity.action} • {activity.date}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* *** 5. ACHIEVEMENTS SECTION *** */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Award className="w-5 h-5" /> Unlocked Achievements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {unlockedAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`rounded-2xl border p-4 text-center dark:border-zinc-800 flex flex-col items-center ${achievement.unlocked ? 'bg-white dark:bg-zinc-900' : 'bg-zinc-50 dark:bg-zinc-900/50 opacity-60'}`}
            >
              <div className={`p-2 rounded-full mb-3 ${achievement.unlocked ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-zinc-200 dark:bg-zinc-800'}`}>
                {achievement.icon}
              </div>
              <h3 className="font-semibold text-sm mb-1">{achievement.name}</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">{achievement.description}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${achievement.unlocked ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                {achievement.unlocked ? 'Unlocked' : 'Locked'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* *** 6. CALENDAR VIEW (Placeholder for future enhancement) *** */}
      {/* <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Calendar className="w-5 h-5" /> Streak Calendar</h2>
        <div className="rounded-2xl border p-4 text-center dark:border-zinc-800">
          <p className="text-sm text-zinc-500 py-8">[Visual calendar showing learning history would go here]</p>
        </div>
      </div> */}
    </div>
  );
}

export default StreaksPage;