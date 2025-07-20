import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Check, Filter, Moon, Sun, Calendar, Tag, Star } from 'lucide-react';

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newCategory, setNewCategory] = useState('Personal');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created');
  const [darkMode, setDarkMode] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');

  const motivationalQuotes = [
    "🎉 Amazing! You're crushing your goals!",
    "✨ One step closer to greatness!",
    "🚀 You're unstoppable today!",
    "💪 Keep that momentum going!",
    "🌟 Excellence is your standard!",
    "🎯 Bulls-eye! Another win!",
    "🔥 You're on fire!",
    "⚡ Productivity champion!"
  ];

  const typewriterTexts = [
    "Conquer your day, one task at a time...",
    "Turn your dreams into achievements...",
    "Every task completed is progress made...",
    "You've got this! Let's make it happen..."
  ];

  // Typewriter effect
  useEffect(() => {
    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    
    const typewriterInterval = setInterval(() => {
      const currentFullText = typewriterTexts[currentTextIndex];
      
      if (!isDeleting) {
        setTypewriterText(currentFullText.substring(0, currentCharIndex + 1));
        currentCharIndex++;
        
        if (currentCharIndex === currentFullText.length) {
          setTimeout(() => { isDeleting = true; }, 2000);
        }
      } else {
        setTypewriterText(currentFullText.substring(0, currentCharIndex - 1));
        currentCharIndex--;
        
        if (currentCharIndex === 0) {
          isDeleting = false;
          currentTextIndex = (currentTextIndex + 1) % typewriterTexts.length;
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearInterval(typewriterInterval);
  }, []);

  // Check for all tasks completed
  useEffect(() => {
    const incompleteTasks = tasks.filter(task => !task.completed);
    if (tasks.length > 0 && incompleteTasks.length === 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        category: newCategory,
        dueDate: newDueDate,
        priority: newPriority,
        createdAt: new Date().toISOString()
      };
      setTasks([...tasks, task]);
      setNewTask('');
      setNewDueDate('');
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
      setCurrentQuote(randomQuote);
      setShowQuote(true);
      setTimeout(() => setShowQuote(false), 3000);
    }
    
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      setTasks(tasks.map(task => 
        task.id === editingId ? { ...task, text: editText.trim() } : task
      ));
    }
    setEditingId(null);
    setEditText('');
  };

  const filteredAndSortedTasks = () => {
    let filtered = tasks;
    
    switch (filter) {
      case 'completed':
        filtered = tasks.filter(task => task.completed);
        break;
      case 'pending':
        filtered = tasks.filter(task => !task.completed);
        break;
      case 'urgent':
        filtered = tasks.filter(task => task.priority === 'high');
        break;
      default:
        break;
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Work: 'bg-blue-500',
      Personal: 'bg-purple-500',
      Urgent: 'bg-red-500',
      Health: 'bg-green-500',
      Learning: 'bg-orange-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const completedTasksCount = tasks.filter(task => task.completed).length;
  const progressPercentage = tasks.length > 0 ? (completedTasksCount / tasks.length) * 100 : 0;

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800'}`}>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            >
              🎉
            </div>
          ))}
        </div>
      )}

      {/* Motivational Quote Popup */}
      {showQuote && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 animate-bounce">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-2 max-w-sm text-center`}>
            <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              {currentQuote}
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-6">
            <div className="w-8"></div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              TaskMaster Pro
            </h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-700 shadow-lg'}`}
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
          
          <div className="h-12 mb-6">
            <p className="text-xl text-gray-600 dark:text-gray-300 italic">
              {typewriterText}
              <span className="animate-pulse">|</span>
            </p>
          </div>

          {/* Progress Bar */}
          {tasks.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress: {completedTasksCount}/{tasks.length} tasks completed</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className={`w-full h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Add Task Form */}
        <div className={`p-6 rounded-2xl shadow-xl mb-8 transition-all duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} border`}>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                placeholder="What's your next victory? ✨"
                className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 placeholder-gray-500'}`}
              />
              <button
                onClick={addTask}
                disabled={!newTask.trim()}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              >
                <Plus size={20} />
                Let's Go!
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className={`px-4 py-2 rounded-lg border transition-all duration-300 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`}
              >
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Urgent">Urgent</option>
                <option value="Health">Health</option>
                <option value="Learning">Learning</option>
              </select>
              
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className={`px-4 py-2 rounded-lg border transition-all duration-300 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`}
              />
              
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className={`px-4 py-2 rounded-lg border transition-all duration-300 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-600 dark:text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`px-3 py-2 rounded-lg border transition-all duration-300 ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200'}`}
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="urgent">High Priority</option>
            </select>
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-3 py-2 rounded-lg border transition-all duration-300 ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200'}`}
          >
            <option value="created">Sort by Created</option>
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="category">Sort by Category</option>
          </select>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredAndSortedTasks().length === 0 ? (
            <div className={`text-center py-16 px-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="text-6xl mb-4">🌟</div>
              <p className="text-xl font-semibold mb-2">
                {tasks.length === 0 ? "Ready to conquer your day?" : "All tasks completed!"}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {tasks.length === 0 ? "Add your first task and start achieving greatness!" : "You're absolutely crushing it! 🎉"}
              </p>
            </div>
          ) : (
            filteredAndSortedTasks().map((task, index) => (
              <div
                key={task.id}
                className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
                } border ${task.completed ? 'opacity-75' : ''}`}
                style={{
                  animation: `slideInUp 0.5s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className={`w-6 h-6 rounded-full border-2 transition-all duration-300 hover:scale-110 flex items-center justify-center ${
                      task.completed 
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 border-transparent' 
                        : `${darkMode ? 'border-gray-600 hover:border-purple-400' : 'border-gray-300 hover:border-purple-500'}`
                    }`}
                  >
                    {task.completed && <Check size={16} className="text-white" />}
                  </button>
                  
                  <div className="flex-1">
                    {editingId === task.id ? (
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                        onBlur={saveEdit}
                        className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`}
                        autoFocus
                      />
                    ) : (
                      <div>
                        <p className={`text-lg ${task.completed ? 'line-through text-gray-500' : ''}`}>
                          {task.text}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(task.category)}`}>
                            <Tag size={12} className="mr-1" />
                            {task.category}
                          </span>
                          {task.dueDate && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                              <Calendar size={12} className="mr-1" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            <Star size={12} className="mr-1" />
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!task.completed && (
                      <button
                        onClick={() => startEdit(task.id, task.text)}
                        className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-blue-400' : 'hover:bg-gray-100 text-gray-500 hover:text-blue-500'}`}
                      >
                        <Edit3 size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-red-400' : 'hover:bg-gray-100 text-gray-500 hover:text-red-500'}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TodoApp;