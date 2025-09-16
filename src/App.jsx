import React, { createContext, useContext, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams,useLocation } from "react-router-dom";
import {Menu,BookOpen,Trophy,Layers,Code2,Search,User,PlayCircle,ChevronRight,Sun,Moon,CheckCircle,Award,Flame,Zap,Target,BarChart3,Filter,X,Clock,Lock,Unlock,Star,Users,ArrowLeft} from "lucide-react";
import CatalogPage from "./Screens/catalog";
import CoursePage from "./Screens/coursepage";
import StreaksPage from "./Screens/streak";
import Playground from "./Screens/playground";
// *** 1. CENTRAL STATE MANAGEMENT WITH REACT CONTEXT ***
// This replaces the simple hook and will manage user-wide state.
const AppStateContext = createContext();

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}

function AppStateProvider({ children }) {
  // Get theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('learnforge-theme');
    return saved ? saved : 'light';
  });
  // User progress: { courseId: { completedLessons: [1, 3, 5], score: 85 } }
  const [userProgress, setUserProgress] = useState(() => {
    const saved = localStorage.getItem('learnforge-progress');
    return saved ? JSON.parse(saved) : {};
  });
  // Current code in the playground for each lesson
  const [playgroundCode, setPlaygroundCode] = useState({});
  // Output from the code execution
  const [codeOutput, setCodeOutput] = useState("// Output will appear here\n");

  // *** Persist theme and progress to localStorage on change ***
  useEffect(() => {
    localStorage.setItem('learnforge-theme', theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('learnforge-progress', JSON.stringify(userProgress));
  }, [userProgress]);

  const toggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  // *** Function to mark a lesson as completed ***
  const completeLesson = (courseId, lessonId) => {
    setUserProgress(prev => {
      const courseProgress = prev[courseId] || { completedLessons: [], score: 0 };
      // If lesson is already completed, do nothing
      if (courseProgress.completedLessons.includes(lessonId)) return prev;
      
      const newCompletedLessons = [...courseProgress.completedLessons, lessonId];
      // Simple scoring: 10 points per lesson completed
      const newScore = newCompletedLessons.length * 10; 
      
      return {
        ...prev,
        [courseId]: {
          ...courseProgress,
          completedLessons: newCompletedLessons,
          score: newScore
        }
      };
    });
  };

  // *** Function to execute code (MOCK - In a real app, use a sandboxed iframe or WebContainer API) ***
  const runCode = (code) => {
    try {
      // This is a simple mock. WARNING: `eval` is dangerous and should NEVER be used in a real production app with user input.
      // For a real project, you would use a service like StackBlitz's SDK or a Web Worker with a limited context.
      const originalLog = console.log;
      let newOutput = "";
      console.log = (...args) => {
        newOutput += args.join(' ') + '\n';
      };
      eval(code); // *** DANGER: ONLY FOR DEMO ***
      console.log = originalLog;
      setCodeOutput(newOutput || "Code executed successfully (no output).");
    } catch (error) {
      setCodeOutput(`Error: ${error.message}`);
    }
  };

  const value = {
    theme,
    toggleTheme,
    userProgress,
    completeLesson,
    playgroundCode,
    setPlaygroundCode,
    codeOutput,
    runCode,
    setCodeOutput 
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider> 
  );
}
// *** END OF STATE MANAGEMENT ***

// *** 2. ENHANCED DATA STRUCTURE ***
export const mockCourses = [
  {
    id: "react-101",
    title: "React 101",
    level: "Beginner",
    summary: "Build modern UIs with hooks, router, and patterns.",
    tags: ["React", "Hooks", "SPA"],
    lessons: [
      {
        id: 1,
        title: "Components & Props",
        content: [
          "React lets you build user interfaces by composing small, reusable pieces called components.",
          "Props are how you pass data into a component. They are read-only."
        ],
        initialCode: `function Welcome({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}\n\n// TODO: Use the Welcome component below to say hello to "LearnForge"\nfunction App() {\n  return (\n    <div>\n      {/* Your code here */}\n    </div>\n  );\n}`,
        solution: `function Welcome({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}\n\nfunction App() {\n  return (\n    <div>\n      <Welcome name="LearnForge" />\n    </div>\n  );\n}`,
        quiz: [
          {
            question: "What are props?",
            options: [
              "Internal state of a component",
              "Reusable UI building blocks",
              "A way to pass data into a component", // Correct
              "A CSS framework"
            ],
            correctIndex: 2
          },
          {
            question: "Can a component change its own props?",
            options: [
              "Yes, always",
              "No, props are read-only", // Correct
              "Only if they are objects",
              "Only in class components"
            ],
            correctIndex: 1
          }
        ]
      },
      {
        id: 2,
        title: "State & Events",
        content: ["Lesson 2 content..."],
        initialCode: "// Code for lesson 2",
        solution: "// Solution for lesson 2",
        quiz: [{ question: "Q2", options: ["A1", "A2"], correctIndex: 0 }]
      }
      // ... more lessons
    ]
  },
  // ... other courses
];

// *** 3. COMPONENT UPDATES ***

// TopBar now uses the global state
function TopBar() {
  const { theme, toggleTheme } = useAppState(); // *** Use global state ***
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between gap-3 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-zinc-900/70 dark:border-zinc-800 px-4 py-3">
      {/* ... rest remains the same, but uses global toggleTheme ... */}
    </div>
  );
}
function SidebarLink({ to, icon, children }) {
  // Get the current path to check if this link is active
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all ${
        isActive
          ? "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300" // Active state styles
          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800" // Default and hover states
      }`}
    >
      <div className={`transition-transform ${
        isActive ? "text-blue-600 dark:text-blue-400" : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
      }`}>
        {icon}
      </div>
      <span className="flex-1">{children}</span>
      <ChevronRight className={`w-4 h-4 transition-transform ${
        isActive ? "text-blue-600 dark:text-blue-400" : "text-zinc-300 group-hover:text-zinc-400 dark:text-zinc-700"
      }`} />
    </Link>
  );
}

// Sidebar shows actual progress from global state
function Sidebar() {
  const { userProgress } = useAppState(); // *** Get user progress ***
  const reactProgress = userProgress["react-101"];
  const completedCount = reactProgress?.completedLessons.length || 0;
  const totalLessons = mockCourses.find(c => c.id === "react-101").lessons.length;
  const streak = 7; // Would be calculated from dates in a real app

  return (
    <aside className="hidden md:block w-64 shrink-0 border-r bg-white/50 dark:bg-zinc-900/50 dark:border-zinc-800 p-4">
      <nav className="space-y-1 text-sm">
        <SidebarLink to="/catalog" icon={<Layers className="w-4 h-4" />}>Catalog</SidebarLink>
        <SidebarLink to="/streaks" icon={<Trophy className="w-4 h-4" />}>
          <span className="flex items-center justify-between w-full">
            Streaks <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600"><Flame className="w-3 h-3" /> {streak}</span>
          </span>
        </SidebarLink>
        <SidebarLink to="/playground" icon={<Code2 className="w-4 h-4" />}>Playground</SidebarLink>
      </nav>
      <div className="mt-6 rounded-xl border p-4 dark:border-zinc-800">
        <p className="font-medium mb-1 flex items-center gap-2"><Award className="w-4 h-4" /> Daily Goal</p>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">Complete 1 lesson to keep your streak 🔥</p>
        <div className="mt-1 h-2 rounded bg-zinc-200 dark:bg-zinc-800">
          {/* *** Progress bar now shows real progress *** */}
          <div
            className="h-2 rounded bg-green-500 transition-all duration-300"
            style={{ width: `${(completedCount / totalLessons) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-zinc-500 mt-2 text-right">{completedCount}/{totalLessons} lessons</p>
      </div>
    </aside>
  );
}
// CourseCard can show a checkmark for completed courses
function CourseCard({ course }) {
  const { userProgress } = useAppState();
  const progress = userProgress[course.id];
  const isInProgress = progress && progress.completedLessons.length > 0;
  const isCompleted = progress && progress.completedLessons.length === course.lessons.length;

  return (
    <div className="rounded-2xl border p-4 flex flex-col gap-2 dark:border-zinc-800 relative"> {/* *** Added relative *** */}
      {/* *** Checkmark for completed course *** */}
      {isCompleted && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full">
          <CheckCircle className="w-5 h-5" />
        </div>
      )}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{course.level}</p>
        <span className="text-xs rounded-full border px-2 py-1 dark:border-zinc-800">{course.lessons.length} lessons</span>
      </div>
      <h3 className="font-semibold text-lg">{course.title}</h3>z
      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{course.summary}</p>
      <div className="flex flex-wrap gap-2 mt-1">
        {course.tags.map((t) => (
          <span key={t} className="text-xs rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5">{t}</span>
        ))}
      </div>
      <button onClick={() => navigate(`/course/${course.id}`)} className={`mt-3 inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm ${isCompleted ? 'bg-green-100 text-green-900 dark:bg-green-900/20 dark:text-green-300' : 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'}`}>
        {isCompleted ? 'Completed' : 'View Course'} <ChevronRight className="w-4 h-4"/>
      </button>
    </div>
  );
}

// *** 4. SUPERCHARGED LESSON PAGE ***
function LessonPage() {
  const { courseId, n } = useParams(); // Get URL params
  const { playgroundCode, setPlaygroundCode, runCode, codeOutput, completeLesson, userProgress } = useAppState();
  const lessonNumber = parseInt(n);
  const course = mockCourses.find(c => c.id === courseId);
  const lesson = course?.lessons.find(l => l.id === lessonNumber);
  const navigate = useNavigate();

  if (!course || !lesson) {
    return <div>Lesson not found!</div>;
  }

  const progress = userProgress[courseId];
  const isCompleted = progress?.completedLessons.includes(lessonNumber);

  // Handle code in playground for this specific lesson
  const currentCode = playgroundCode[`${courseId}-${lessonNumber}`] || lesson.initialCode;
  const setCurrentCode = (code) => setPlaygroundCode(prev => ({ ...prev, [`${courseId}-${lessonNumber}`]: code }));

  const [currentQuizAnswers, setCurrentQuizAnswers] = useState([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const isQuizCorrect = quizSubmitted && currentQuizAnswers.every((answer, index) => answer === lesson.quiz[index].correctIndex);

  const handleRunCode = () => {
    runCode(currentCode);
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    if (isQuizCorrect) {
      // Only complete the lesson if the quiz is correct
      completeLesson(courseId, lessonNumber);
    }
  };

  const handleNextLesson = () => {
    const nextLesson = course.lessons.find(l => l.id === lessonNumber + 1);
    if (nextLesson) {
      navigate(`/course/${courseId}/lesson/${nextLesson.id}`);
      setQuizSubmitted(false);
      setCurrentQuizAnswers([]);
      setCodeOutput("// Output will appear here\n");
    } else {
      // No more lessons, go back to course page
      navigate(`/course/${courseId}`);
    }
  };

  return (
    <div className="p-4 grid lg:grid-cols-2 gap-6"> {/* Increased gap */}
      {/* Theory Section */}
      <div className="rounded-2xl border p-6 dark:border-zinc-800"> {/* More padding */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">Lesson {lessonNumber}: {lesson.title}</h3>
            <p className="text-sm text-zinc-500">{course.title}</p>
          </div>
          {isCompleted && <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />}
        </div>
        
        <article className="prose prose-zinc dark:prose-invert max-w-none text-sm">
          {lesson.content.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
          <pre className="rounded-xl bg-zinc-950 text-zinc-50 p-4 overflow-x-auto text-xs mt-4"><code>{lesson.initialCode}</code></pre>
        </article>
      </div>

      {/* Interactive Playground Section */}
      <div className="rounded-2xl border p-6 dark:border-zinc-800 flex flex-col">
        <h3 className="font-semibold mb-4">Coding Playground</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">Edit the code below and click Run to see the output.</p>
        <textarea
          className="w-full h-40 rounded-xl border p-4 text-sm font-mono dark:bg-zinc-900 dark:border-zinc-800 mb-4 flex-grow" 
          value={currentCode}
          onChange={(e) => setCurrentCode(e.target.value)}
          spellCheck="false"
        ></textarea>
        <div className="mt-2 flex items-center gap-2 mb-4">
          <button onClick={handleRunCode} className="rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-4 py-2 text-sm font-medium">Run Code</button>
          <button onClick={() => setCurrentCode(lesson.initialCode)} className="rounded-xl border px-4 py-2 text-sm dark:border-zinc-800">Reset</button>
        </div>

        {/* Output Console */}
        <div className="bg-zinc-950 text-zinc-50 rounded-xl p-4 font-mono text-xs whitespace-pre-wrap overflow-auto max-h-40">
          {codeOutput}
        </div>
      </div>

      {/* Quiz Section */}
      <div className="rounded-2xl border p-6 dark:border-zinc-800 lg:col-span-2"> {/* More padding */}
        <h3 className="font-semibold mb-4">Quick Quiz</h3>
        <div className="space-y-4 text-sm">
          {lesson.quiz.map((q, qIndex) => (
            <div key={qIndex} className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
              <p className="font-medium mb-2">{q.question}</p>
              <div className="space-y-2">
                {q.options.map((option, oIndex) => {
                  const isSelected = currentQuizAnswers[qIndex] === oIndex;
                  const isCorrectAnswer = oIndex === q.correctIndex;
                  const showResults = quizSubmitted;

                  let style = "flex items-center gap-3 p-2 rounded-md cursor-pointer ";
                  if (showResults) {
                    if (isCorrectAnswer) {
                      style += "bg-green-100 text-green-900 dark:bg-green-900/20 dark:text-green-300";
                    } else if (isSelected && !isCorrectAnswer) {
                      style += "bg-rose-100 text-rose-900 dark:bg-rose-900/20 dark:text-rose-300";
                    }
                  } else {
                    style += isSelected
                      ? "bg-blue-50 dark:bg-blue-900/20"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800";
                  }

                  return (
                    <label key={oIndex} className={style}>
                      <input
                        type="radio"
                        name={`q-${qIndex}`}
                        checked={isSelected}
                        onChange={() => {
                          const newAnswers = [...currentQuizAnswers];
                          newAnswers[qIndex] = oIndex;
                          setCurrentQuizAnswers(newAnswers);
                        }}
                        disabled={quizSubmitted}
                        className="hidden" // We hide the default radio and style the label instead
                      />
                      <div className={`flex items-center justify-center w-5 h-5 rounded-full border ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-zinc-400'} ${showResults && isCorrectAnswer ? 'border-green-500 bg-green-500' : ''}`}>
                        {(isSelected && !showResults) && <div className="w-2 h-2 rounded-full bg-white"></div>}
                        {showResults && isCorrectAnswer && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                      {option}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3">
          {!quizSubmitted ? (
            <button
              onClick={handleQuizSubmit}
              disabled={currentQuizAnswers.length !== lesson.quiz.length}
              className="rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Quiz
            </button>
          ) : (
            <>
              {isQuizCorrect ? (
                <>
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Perfect! Lesson completed.</span>
                  </div>
                  <button onClick={handleNextLesson} className="ml-auto rounded-xl bg-green-600 text-white px-4 py-2 text-sm font-medium inline-flex items-center gap-2">
                    {course.lessons.find(l => l.id === lessonNumber + 1) ? 'Next Lesson' : 'Finish Course'} <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                  <span className="font-medium">Not quite right. Try again!</span>
                  <button onClick={() => setQuizSubmitted(false)} className="ml-auto rounded-xl border px-4 py-2 text-sm dark:border-zinc-800">
                    Retry Quiz
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  const { userProgress } = useAppState(); // We can use our global state here too!
  const totalCourses = mockCourses.length;
  const completedCourses = mockCourses.filter(course => {
    const progress = userProgress[course.id];
    return progress && progress.completedLessons.length === course.lessons.length;
  }).length;

  // Calculate total lessons across all courses
  const totalLessons = mockCourses.reduce((sum, course) => sum + course.lessons.length, 0);
  const completedLessons = Object.values(userProgress).reduce((sum, progress) => sum + progress.completedLessons.length, 0);

  const features = [
    {
      icon: <Zap className="w-5 h-5 text-blue-600" />,
      title: "Learn by Doing",
      description: "Short interactive content, quizzes, and real coding challenges keep you engaged. Practice in our built-in, safe playground."
    },
    {
      icon: <Target className="w-5 h-5 text-green-600" />,
      title: "Track Progress",
      description: "Set daily goals, track your streak, and watch your skills grow with detailed progress charts and completion metrics."
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-amber-600" />,
      title: "Compete & Streaks",
      description: "Climb the leaderboard, earn points for completing lessons, and compete with friends to keep your learning streak alive."
    }
  ];

  return (
    <div className="p-4">
      {/* Hero Section */}
      <div className="rounded-2xl border p-8 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950 dark:border-zinc-800 text-center md:text-left">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Become a World‑Class Developer</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto md:mx-0">
            Bite‑sized interactive lessons, built‑in code playground, quizzes, and gamification. Track your progress and learn by doing—at your own pace.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link to="/catalog" className="rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-6 py-3 text-sm font-medium inline-flex items-center gap-2 justify-center">
              Browse Catalog <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/playground" className="rounded-xl border px-6 py-3 text-sm font-medium dark:border-zinc-800 inline-flex items-center gap-2 justify-center">
              Try Playground <Code2 className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Progress Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
        <div className="rounded-2xl border p-5 dark:border-zinc-800 text-center">
          <div className="text-2xl font-bold text-blue-600">{completedCourses}/{totalCourses}</div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Courses Completed</div>
        </div>
        <div className="rounded-2xl border p-5 dark:border-zinc-800 text-center">
          <div className="text-2xl font-bold text-green-600">{completedLessons}/{totalLessons}</div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Lessons Finished</div>
        </div>
        <div className="rounded-2xl border p-5 dark:border-zinc-800 text-center">
          <div className="text-2xl font-bold text-amber-600">7</div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Day Streak</div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {features.map((feature, index) => (
          <div key={index} className="rounded-2xl border p-6 dark:border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              {feature.icon}
              <h3 className="font-semibold text-lg">{feature.title}</h3>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


// *** 5. UPDATED APP COMPONENT WITH PROVIDER ***
export default function App() {
  return (
    <AppStateProvider> {/* *** Wrap everything in our state provider *** */}
      <BrowserRouter>
        <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
          <TopBar />
          <div className="mx-auto max-w-7xl flex">
            <Sidebar />
            <main className="flex-1 min-w-0">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/course/:id" element={<CoursePage />} />
                <Route path="/course/:id/lesson/:n" element={<LessonPage />} /> {/* *** This route now uses the supercharged component *** */}
                <Route path="/playground" element={<Playground/>} />
                <Route path="/streaks" element={<StreaksPage />} />
                
              </Routes>
            </main>
          </div>
          <footer className="border-t mt-6 p-4 text-center text-xs text-zinc-500 dark:border-zinc-800">© {new Date().getFullYear()} LearnForge — SoloLearn++ MVP UI</footer>
        </div>
      </BrowserRouter>
    </AppStateProvider>
  );
}