import React, { createContext, useContext, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams,useLocation } from "react-router-dom";
import {Menu,BookOpen,Trophy,Layers,Code2,Search,User,PlayCircle,ChevronRight,Sun,Moon,CheckCircle,Award,Flame,Zap,Target,BarChart3,Filter,X,Clock,Lock,Unlock,Star,Users,ArrowLeft} from "lucide-react";
import { useAppState } from "../App.jsx"; 
import {mockCourses} from "../App.jsx";



function CoursePage() {
  const { id } = useParams(); // Get the course ID from the URL
  const navigate = useNavigate();
  const { userProgress, completeLesson } = useAppState();

  // Find the current course data
  const course = mockCourses.find(c => c.id === id);
  if (!course) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Course not found</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">The course you're looking for doesn't exist.</p>
        <Link to="/catalog" className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline">
          ← Back to Catalog
        </Link>
      </div>
    );
  }

  const progress = userProgress[course.id] || { completedLessons: [], score: 0 };
  const { completedLessons, score } = progress;
  const totalLessons = course.lessons.length;
  const completionPercentage = Math.round((completedLessons.length / totalLessons) * 100);

  // Check if a lesson is unlocked (previous lesson is completed)
  const isLessonUnlocked = (lessonId) => {
    const lessonIndex = course.lessons.findIndex(l => l.id === lessonId);
    // First lesson is always unlocked
    if (lessonIndex === 0) return true;
    // Check if previous lesson is completed
    const previousLesson = course.lessons[lessonIndex - 1];
    return completedLessons.includes(previousLesson.id);
  };

  // Calculate estimated total course duration (assuming 10 mins per lesson)
  const totalDuration = totalLessons * 10;
  // Calculate time saved based on completed lessons
  const timeSaved = completedLessons.length * 10;

  // Mock engagement data - would come from backend
  const mockStats = {
    rating: 4.8,
    enrolled: 2844,
    averageCompletion: 72,
  };

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto">
      {/* Navigation Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        <Link to="/catalog" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
          Catalog
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-zinc-900 dark:text-zinc-100">{course.title}</span>
      </nav>

      {/* Course Header */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-8">
        {/* Course Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {course.level}
            </span>
            {completionPercentage === 100 && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 flex items-center gap-1">
                <Trophy className="w-4 h-4" /> Completed
              </span>
            )}
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            {course.title}
          </h1>
          
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
            {course.summary}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                // Find first uncompleted lesson or start from the beginning
                const nextLesson = course.lessons.find(lesson => 
                  !completedLessons.includes(lesson.id) && isLessonUnlocked(lesson.id)
                ) || course.lessons[0];
                
                navigate(`lesson/${nextLesson.id}`);
              }}
              className="flex items-center gap-2 rounded-xl bg-blue-600 text-white px-6 py-3 font-medium hover:bg-blue-700 transition-colors"
            >
              <PlayCircle className="w-5 h-5" />
              {completedLessons.length === 0 ? 'Start Course' : 'Continue Learning'}
            </button>
            
            <button className="flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 px-4 py-3 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              <Star className="w-5 h-5" />
              Save for Later
            </button>
          </div>
        </div>

        {/* Course Stats Card */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="rounded-2xl border p-6 bg-white dark:bg-zinc-900 dark:border-zinc-800">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Your Progress
            </h3>
            
            {/* Progress Circle */}
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  className="text-zinc-200 dark:text-zinc-700 stroke-current"
                  strokeWidth="10"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                />
                {/* Progress circle */}
                <circle
                  className="text-blue-600 stroke-current"
                  strokeWidth="10"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * completionPercentage) / 100}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{completionPercentage}%</span>
              </div>
            </div>

            {/* Progress Stats */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Lessons</span>
                <span className="font-medium">{completedLessons.length}/{totalLessons}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Score</span>
                <span className="font-medium">{score} XP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Time Saved</span>
                <span className="font-medium">{timeSaved} min</span>
              </div>
            </div>

            {/* Streak */}
            {completedLessons.length > 0 && (
              <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <span className="font-medium">7-day streak</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Lessons List - 2/3 width */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Course Content
            </h2>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {totalLessons} lessons • {totalDuration} min
            </span>
          </div>

          <div className="space-y-3">
            {course.lessons.map((lesson, index) => {
              const isCompleted = completedLessons.includes(lesson.id);
              const isUnlocked = isLessonUnlocked(lesson.id);
              const isNextLesson = !isCompleted && isUnlocked && 
                !course.lessons.slice(0, index).some(l => !completedLessons.includes(l.id) && isLessonUnlocked(l.id));

              return (
                <div
                  key={lesson.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    isCompleted
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                      : isUnlocked
                      ? 'border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 hover:shadow-md cursor-pointer'
                      : 'border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 cursor-not-allowed opacity-75'
                  }`}
                  onClick={() => isUnlocked && navigate(`lesson/${lesson.id}`)}
                >
                  {/* Lesson Number/Status */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${
                    isCompleted
                      ? 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300'
                      : isUnlocked
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300'
                      : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : isUnlocked ? (
                      isNextLesson ? (
                        <PlayCircle className="w-5 h-5" />
                      ) : (
                        index + 1
                      )
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>

                  {/* Lesson Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                      Lesson {index + 1} • 10 min
                    </p>
                  </div>

                  {/* Lesson Actions */}
                  <div className="flex items-center gap-2">
                    {isCompleted && (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    )}
                    <ChevronRight className={`w-5 h-5 text-zinc-400 ${
                      isUnlocked ? 'group-hover:text-zinc-600 dark:group-hover:text-zinc-300' : ''
                    }`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Course Stats */}
          <div className="rounded-2xl border p-6 bg-white dark:bg-zinc-900 dark:border-zinc-800">
            <h3 className="font-semibold text-lg mb-4">Course Overview</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Enrolled
                </span>
                <span className="font-medium">{mockStats.enrolled.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  Rating
                </span>
                <span className="font-medium">{mockStats.rating}/5.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Completion
                </span>
                <span className="font-medium">{mockStats.averageCompletion}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Duration
                </span>
                <span className="font-medium">{totalDuration} min</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="rounded-2xl border p-6 bg-white dark:bg-zinc-900 dark:border-zinc-800">
            <h3 className="font-semibold text-lg mb-4">You'll Learn</h3>
            <div className="flex flex-wrap gap-2">
              {course.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full text-sm bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Achievement */}
          {completionPercentage === 100 && (
            <div className="rounded-2xl border p-6 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-700">
              <div className="text-center">
                <Trophy className="w-12 h-12 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2 text-amber-900 dark:text-amber-100">
                  Course Mastered!
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                  You've completed all lessons in this course.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-amber-800 dark:text-amber-200">
                  <Award className="w-4 h-4" />
                  {score} XP Earned
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CoursePage;