
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams,useLocation } from "react-router-dom";
import {Menu,BookOpen,Trophy,Layers,Code2,ChevronDown,Search,User,PlayCircle,ChevronRight,Sun,Moon,CheckCircle,Award,Flame,Zap,Target,BarChart3,Filter,X,Clock,Lock,Unlock,Star,Users,ArrowLeft} from "lucide-react";
import { useAppState } from "../App.jsx";
import {mockCourses} from "../App.jsx";

function CatalogPage() {
  const { userProgress } = useAppState();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false); // For mobile filter toggle

  // Get all unique tags and levels from courses for filters
  const allTags = useMemo(() => {
    const tagsSet = new Set();
    mockCourses.forEach((course) => {
      course.tags.forEach((tag) => tagsSet.add(tag));
    });
    return ["All", ...Array.from(tagsSet).sort()];
  }, []);

  const allLevels = useMemo(() => {
    const levelsSet = new Set(mockCourses.map((course) => course.level));
    return ["All", ...Array.from(levelsSet).sort()];
  }, []);

  // Filter and sort logic
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = mockCourses.filter((course) => {
      // Search filter (title, summary, tags)
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      // Level filter
      const matchesLevel =
        selectedLevel === "All" || course.level === selectedLevel;

      // Tag filter
      const matchesTag =
        selectedTag === "All" || course.tags.includes(selectedTag);

      return matchesSearch && matchesLevel && matchesTag;
    });

    // Sort logic
    switch (sortBy) {
      case "popularity":
        // Mock popularity - in a real app, this would come from backend data
        filtered.sort((a, b) => b.id.localeCompare(a.id)); // Placeholder
        break;
      case "duration":
        filtered.sort((a, b) => a.lessons.length - b.lessons.length);
        break;
      case "completion":
        filtered.sort((a, b) => {
          const progressA = userProgress[a.id]?.completedLessons.length || 0;
          const progressB = userProgress[b.id]?.completedLessons.length || 0;
          // Sort by completion percentage descending
          return progressB / b.lessons.length - progressA / a.lessons.length;
        });
        break;
      case "alphabetical":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // 'default' might be a curated order set in the mock data
        break;
    }

    return filtered;
  }, [
    mockCourses,
    searchQuery,
    selectedLevel,
    selectedTag,
    sortBy,
    userProgress,
  ]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedLevel("All");
    setSelectedTag("All");
    setSortBy("default");
  };

  const areFiltersActive =
    searchQuery ||
    selectedLevel !== "All" ||
    selectedTag !== "All" ||
    sortBy !== "default";

  return (
    <div className="p-4 lg:p-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6" /> Course Catalog
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Explore all courses and start your learning journey.
          </p>
        </div>
        <div className="text-sm text-zinc-500">
          Showing{" "}
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {filteredAndSortedCourses.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {mockCourses.length}
          </span>{" "}
          courses
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search courses, topics, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="lg:hidden w-full flex items-center justify-between p-3 rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-800"
        >
          <span className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </span>
          {isFiltersOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {/* Filters Grid - Visible on desktop, conditionally on mobile */}
        <div
          className={`${isFiltersOpen ? "block" : "hidden"} lg:grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 lg:p-0 rounded-xl border bg-zinc-50 dark:bg-zinc-900/50 dark:border-zinc-800 lg:border-0 lg:bg-transparent`}
        >
          {/* Level Filter */}
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
              Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full p-2 rounded-lg border bg-white dark:bg-zinc-800 dark:border-zinc-700 text-sm"
            >
              {allLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Tag Filter */}
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
              Topic
            </label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full p-2 rounded-lg border bg-white dark:bg-zinc-800 dark:border-zinc-700 text-sm"
            >
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 rounded-lg border bg-white dark:bg-zinc-800 dark:border-zinc-700 text-sm"
            >
              <option value="default">Recommended</option>
              <option value="popularity">Popularity</option>
              <option value="duration">Duration (Shortest)</option>
              <option value="completion">My Progress</option>
              <option value="alphabetical">A to Z</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-end">
            <button
              onClick={clearAllFilters}
              disabled={!areFiltersActive}
              className="w-full px-4 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {filteredAndSortedCourses.length > 0 ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        // Empty State
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
            No courses found
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
          {areFiltersActive && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-4 py-2 text-sm"
            >
              <X className="w-4 h-4" /> Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Enhanced CourseCard Component with more info
function CourseCard({ course }) {
  const { userProgress } = useAppState();
  const navigate = useNavigate();
  const progress = userProgress[course.id];
  const completedLessons = progress?.completedLessons.length || 0;
  const totalLessons = course.lessons.length;
  const progressPercentage =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const isCompleted = progressPercentage === 100;

  // Mock data for engagement - would come from backend
  const mockRating = 4.7;
  const mockEnrolled = 1250;

  return (
    <div className="group rounded-2xl border bg-white dark:bg-zinc-900 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Course Image/Header Placeholder */}
      <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <BookOpen className="w-12 h-12 text-white opacity-90" />
      </div>

      <div className="p-5">
        {/* Course Level and Progress */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            {course.level}
          </span>
          {completedLessons > 0 && (
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {completedLessons}/{totalLessons} done
            </div>
          )}
        </div>

        {/* Course Title */}
        <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
          {course.title}
        </h3>

        {/* Course Summary */}
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
          {course.summary}
        </p>

        {/* Progress Bar */}
        {completedLessons > 0 && !isCompleted && (
          <div className="mb-4">
            <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {course.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {tag}
            </span>
          ))}
          {course.tags.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              +{course.tags.length - 3}
            </span>
          )}
        </div>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {course.lessons.length} lessons
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{" "}
              {mockRating}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" /> {mockEnrolled.toLocaleString()}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate(`/course/${course.id}`)}
          className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
            isCompleted
              ? "bg-green-100 text-green-900 dark:bg-green-900/20 dark:text-green-300"
              : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle className="w-4 h-4" /> Completed
            </>
          ) : completedLessons > 0 ? (
            `Continue (${completedLessons}/${totalLessons})`
          ) : (
            "Start Learning"
          )}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default CatalogPage;
