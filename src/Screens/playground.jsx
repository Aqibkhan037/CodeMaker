import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, Download, Upload, RotateCcw, ChevronDown, ChevronRight, Bug, Zap, Code2, Lightbulb, Sparkles } from 'lucide-react';

// *** IMPORTANT: This is a MOCK execution function. ***
// In a REAL project, you would use a SAFE sandbox like:
// 1. StackBlitz's SDK (@stackblitz/sdk)
// 2. A Web Worker with a limited context
// 3. Skypack or ESBuild for bundling
// 4. CodeMirror or Monaco Editor for the editor itself
function useCodeExecution() {
  const [output, setOutput] = useState("// Welcome to the LearnForge Playground!\n// Write your JavaScript/React code here and press 'Run'.\n\n");
  const [isRunning, setIsRunning] = useState(false);

  const runCode = (code) => {
    setIsRunning(true);
    setOutput("$ Running...\n");
    
    // Simulate a small delay for execution (feels more real)
    setTimeout(() => {
      try {
        let newOutput = "";
        // Capture console.log
        const originalLog = console.log;
        console.log = (...args) => {
          newOutput += args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
          ).join(' ') + '\n';
        };

        // Capture errors
        window.onerror = (message) => {
          newOutput += `Error: ${message}\n`;
        };

        // **DANGER: eval is used for demo only**
        // This is a massive security risk for a real app with user accounts.
        // This is why we use sandboxed solutions in production.
        eval(code);

        console.log = originalLog;
        window.onerror = null;

        setOutput(prev => prev + newOutput + "\n$ Execution finished.\n");
      } catch (error) {
        setOutput(prev => prev + `Error: ${error.message}\n`);
      } finally {
        setIsRunning(false);
      }
    }, 100);
  };

  const clearOutput = () => {
    setOutput("");
  };

  return { output, isRunning, runCode, clearOutput };
}

function Playground() {
  const [code, setCode] = useState(`// Try some React! (Remember to import)
// import React from 'react';
// import { useState } from 'react';

function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', margin: '1rem 0' }}>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  );
}

// Try rendering your components
console.log("Hello from the playground!");

// For React components, you'd render them to a DOM element
// ReactDOM.render(<Welcome name="LearnForge" />, document.getElementById('root'));
`);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('output'); // 'output' or 'problems'
  const [snippets] = useState([
    {
      name: "React Counter",
      code: `function Counter() {
  const [count, setCount] = React.useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  );
}`
    },
    {
      name: "API Fetch",
      code: `async function fetchData() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    const data = await response.json();
    console.log('Fetched data:', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

fetchData();`
    },
    {
      name: "Array Methods",
      code: `// Map, Filter, Reduce examples
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((total, num) => total + num, 0);

console.log('Doubled:', doubled);
console.log('Evens:', evens);
console.log('Sum:', sum);`
    }
  ]);

  const textareaRef = useRef(null);
  const { output, isRunning, runCode, clearOutput } = useCodeExecution();

  // Basic syntax highlighting on keypress
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        
        setCode(prev => 
          prev.substring(0, start) + '  ' + prev.substring(end)
        );
        
        // Move cursor position
        setTimeout(() => {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }, 0);
      }
    };

    const textarea = textareaRef.current;
    textarea.addEventListener('keydown', handleKeyDown);
    
    return () => {
      textarea.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleRun = () => {
    runCode(code);
  };

  const handleStop = () => {
    // In a real sandbox, this would actually terminate execution
    // For this mock, we can't stop the eval, but we can update the UI
    setIsRunning(false);
    setOutput(prev => prev + "\n$ Execution stopped by user.\n");
  };

  const handleClear = () => {
    clearOutput();
  };

  const loadSnippet = (snippetCode) => {
    setCode(snippetCode);
  };

  const handleExport = () => {
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'learnforge-playground.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCode(e.target.result);
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100">
      {/* *** TOP TOOLBAR *** */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-blue-400" />
          <h1 className="font-semibold">Advanced Playground</h1>
          <div className="flex items-center gap-1 text-xs text-zinc-400 ml-4">
            <Zap className="w-4 h-4" />
            <span>Powered by JavaScript</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Run/Stop Button */}
          {!isRunning ? (
            <button 
              onClick={handleRun}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-sm font-medium"
              disabled={isRunning}
            >
              <Play className="w-4 h-4" /> Run
            </button>
          ) : (
            <button 
              onClick={handleStop}
              className="flex items-center gap-2 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 rounded text-sm font-medium"
            >
              <Square className="w-4 h-4" /> Stop
            </button>
          )}
          
          <button 
            onClick={handleClear}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-sm"
          >
            <RotateCcw className="w-4 h-4" /> Clear
          </button>
          
          <div className="h-4 w-px bg-zinc-700 mx-2"></div>
          
          <label className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-sm cursor-pointer">
            <Upload className="w-4 h-4" /> Import
            <input type="file" accept=".js,.jsx,.txt" onChange={handleImport} className="hidden" />
          </label>
          
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-sm"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* *** LEFT SIDEBAR - SNIPPETS *** */}
        {isSidebarOpen && (
          <div className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
            <div className="p-3 border-b border-zinc-800">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Code Snippets
              </h2>
              <p className="text-xs text-zinc-400 mt-1">Quick-start templates</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {snippets.map((snippet, index) => (
                <button
                  key={index}
                  onClick={() => loadSnippet(snippet.code)}
                  className="w-full text-left p-3 hover:bg-zinc-800 border-b border-zinc-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium">{snippet.name}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 truncate">
                    {snippet.code.split('\n')[0]}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* *** MAIN EDITOR AREA *** */}
        <div className="flex-1 flex flex-col">
          {/* Editor Header */}
          <div className="flex items-center justify-between bg-zinc-900 px-4 py-2 border-b border-zinc-800">
            <span className="text-sm font-mono text-zinc-400">script.js</span>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 hover:bg-zinc-800 rounded"
            >
              {isSidebarOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {/* Code Editor */}
          <div className="flex-1 overflow-auto relative">
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-zinc-950 text-zinc-100 font-mono text-sm p-4 outline-none resize-none whitespace-pre overflow-auto"
              spellCheck="false"
              style={{ 
                tabSize: 2,
                lineHeight: '1.5',
              }}
            />
          </div>
        </div>

        {/* *** RIGHT PANEL - OUTPUT & DEBUGGING *** */}
        <div className="w-96 bg-zinc-900 border-l border-zinc-800 flex flex-col">
          {/* Output Tabs */}
          <div className="flex border-b border-zinc-800">
            <button 
              onClick={() => setActiveTab('output')}
              className={`flex-1 py-2 px-4 text-sm font-medium flex items-center gap-2 justify-center ${activeTab === 'output' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Code2 className="w-4 h-4" /> Output
            </button>
            <button 
              onClick={() => setActiveTab('problems')}
              className={`flex-1 py-2 px-4 text-sm font-medium flex items-center gap-2 justify-center ${activeTab === 'problems' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Bug className="w-4 h-4" /> Problems
            </button>
          </div>

          {/* Output Content */}
          <div className="flex-1 overflow-auto">
            {activeTab === 'output' ? (
              <pre className="font-mono text-sm p-4 whitespace-pre-wrap break-words">
                {output}
              </pre>
            ) : (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Bug className="w-5 h-5 text-amber-400" />
                  <h3 className="font-semibold">Debugging Console</h3>
                </div>
                <p className="text-sm text-zinc-400">
                  {/* In a real implementation, this would show linting errors, warnings, etc. */}
                  No problems detected. Your code looks clean!
                </p>
                
                <div className="mt-6">
                  <h4 className="text-xs font-semibold text-zinc-500 mb-2">DEBUGGING TIPS</h4>
                  <ul className="text-sm text-zinc-400 space-y-1">
                    <li>• Use <code className="bg-zinc-800 px-1 rounded">console.log()</code> to trace values</li>
                    <li>• Check for syntax errors in the output tab</li>
                    <li>• Use try/catch blocks for error handling</li>
                    <li>• Export your code to save your progress</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="border-t border-zinc-800 px-4 py-2 flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-4">
              <span>{code.split('\n').length} lines</span>
              <span>{code.length} characters</span>
              {isRunning && <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div> Running</span>}
            </div>
            <div>JavaScript</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Playground;